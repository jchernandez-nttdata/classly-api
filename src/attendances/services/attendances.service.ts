import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Between, Repository } from 'typeorm';
import { UserSchedulesService } from 'src/classes/services/user_schedules.service';

@Injectable()
export class AttendancesService {
    constructor(
        @Inject(forwardRef(() => UserSchedulesService))
        private readonly userScheduleService: UserSchedulesService,
        @InjectRepository(Attendance)
        private readonly attendanceRepository: Repository<Attendance>,
    ) { }

    async addAttendance(userScheduleId: number): Promise<Attendance> {
        const userSchedule = await this.userScheduleService.findOne(userScheduleId);

        if (userSchedule.remainingClasses <= 0) {
            throw new BadRequestException(`No remaining classes for UserSchedule with ID ${userScheduleId}`);
        }

        await this.validateAttendanceNotRecordedToday(userScheduleId)

        const newUserSchedule = await this.userScheduleService.update(userSchedule.id, { remainingClasses: userSchedule.remainingClasses - 1 })

        const attendance = this.attendanceRepository.create({
            userSchedule: newUserSchedule,
            registrationDate: new Date(),
        });

        return await this.attendanceRepository.save(attendance);
    }

    private async validateAttendanceNotRecordedToday(userScheduleId: number): Promise<void> {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const existingAttendance = await this.attendanceRepository.findOne({
            where: {
                userSchedule: { id: userScheduleId },
                registrationDate: Between(startOfDay, endOfDay),
            },
        });

        if (existingAttendance) {
            throw new BadRequestException(`Attendance already recorded for today`);
        }
    }

    async isAttendanceRecordedToday(userScheduleId: number): Promise<boolean> {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const existingAttendance = await this.attendanceRepository.findOne({
            where: {
                userSchedule: { id: userScheduleId },
                registrationDate: Between(startOfDay, endOfDay),
            },
        });

        return !!existingAttendance;
    }

    async getAttendancesByStudentId(studentId: number): Promise<any[]> {
        const userSchedules = await this.userScheduleService.findAllByStudentId(studentId);

        const attendances = await Promise.all(userSchedules.map(async userSchedule => {
            const attendanceRecords = await this.attendanceRepository.find({
                where: { userSchedule: { id: userSchedule.id } },
                relations: ['userSchedule'],
            });

            return attendanceRecords.map(attendance => ({
                className: userSchedule.schedule.class.className,
                startTime: userSchedule.schedule.startTime,
                endTime: userSchedule.schedule.endTime,
                registrationDate: attendance.registrationDate,
            }));
        }));

        return attendances.flat();
    }
    
}
