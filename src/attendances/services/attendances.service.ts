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

    async isAttendanceRecordedThisWeek(dayOfWeek: number, userScheduleId: number): Promise<boolean> {
        const now = new Date();

        // JavaScript getDay(): 0 (Sunday) to 6 (Saturday)
        // Convert it to ISO: 1 (Monday) to 7 (Sunday)
        const currentISOWeekDay = now.getDay() === 0 ? 7 : now.getDay();

        const classISOWeekDay = dayOfWeek;

        // Calcular diferencia de días
        const diff = classISOWeekDay - currentISOWeekDay;

        const classDate = new Date(now);
        classDate.setDate(now.getDate() + diff);
        classDate.setHours(0, 0, 0, 0);
        const classStart = new Date(classDate);
        const classEnd = new Date(classDate);
        classEnd.setHours(23, 59, 59, 999);

        const existingAttendance = await this.attendanceRepository.findOne({
            where: {
                userSchedule: { id: userScheduleId },
                registrationDate: Between(classStart, classEnd),
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

    async getAttendanceDatesByScheduleId(scheduleId: number): Promise<string[]> {
        await this.userScheduleService.findOne(scheduleId)
        const results = await this.attendanceRepository
            .createQueryBuilder('attendance')
            .select('DISTINCT DATE(attendance.registrationDate)', 'date')
            .innerJoin('attendance.userSchedule', 'userSchedule')
            .innerJoin('userSchedule.schedule', 'schedule')
            .where('schedule.id = :scheduleId', { scheduleId })
            .orderBy('date', 'DESC')
            .getRawMany();

        return results.map(r => r.date);
    }

    async getStudentAttendanceByDate(scheduleId: number, date: string): Promise<{ name: string, registrationDate: string }[]> {
        const userSchedules = await this.userScheduleService.findAllByScheduleId(scheduleId);

        const attendanceRecords = await Promise.all(userSchedules.map(async userSchedule => {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);

            return this.attendanceRepository.find({
                where: {
                    userSchedule: { id: userSchedule.id },
                    registrationDate: Between(startDate, endDate)
                },
                relations: ['userSchedule', 'userSchedule.student']
            });
        }));

        const studentAttendance = attendanceRecords.flat().map(attendance => ({
            studentId: attendance.userSchedule.student.id,
            name: attendance.userSchedule.student.name,
            registrationDate: attendance.registrationDate.toISOString()
        }));

        return studentAttendance;
    }
}
