import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchedule } from '../entities/user_schedule.entity';
import { MoreThan, Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { SchedulesService } from './schedules.service';
import { CreateUserScheduleDto, UpdateUserScheduleDto } from '../dtos/user_schedule.dto';
import { User } from 'src/users/entities/user.entity';
import { Schedule } from '../entities/schedule.entity';
import { AttendancesService } from 'src/attendances/services/attendances.service';

@Injectable()
export class UserSchedulesService {
    constructor(
        @InjectRepository(UserSchedule)
        private readonly userScheduleRepository: Repository<UserSchedule>,
        private readonly userService: UsersService,
        private readonly scheduleService: SchedulesService,
        @Inject(forwardRef(() => AttendancesService))
        private readonly attendanceService: AttendancesService
    ) { }

    async create(createUserScheduleDto: CreateUserScheduleDto): Promise<UserSchedule> {
        const { studentId, scheduleId, remainingClasses } = createUserScheduleDto;

        const student = await this.userService.findOne(studentId)
        const schedule = await this.scheduleService.findOne(scheduleId);

        const studentSchedule = await this.findOneByStudentAndSchedule(studentId, scheduleId);
        if (studentSchedule) throw new Error('Student and schedule relationship already exists');

        const userSchedule = this.userScheduleRepository.create({
            student: student,
            schedule: schedule,
            remainingClasses: remainingClasses,
        });

        return await this.userScheduleRepository.save(userSchedule);
    }

    async findOneByStudentAndSchedule(studentId: number, scheduleId: number): Promise<UserSchedule | null> {
        return await this.userScheduleRepository.findOne({ where: { student: { id: studentId }, schedule: { id: scheduleId } } });
    }

    async findOne(id: number): Promise<UserSchedule> {
        try {
            return await this.userScheduleRepository.findOneOrFail({ where: { id: id } });
        } catch (error) {
            throw new NotFoundException('Could not find user schedule with id: ' + id)
        }
    }

    async findAllByStudentId(studentId: number): Promise<UserSchedule[]> {
        const userSchedules = await this.userScheduleRepository.find({
            where: { student: { id: studentId } },
            relations: ['schedule', 'schedule.class'],
        });

        if (!userSchedules.length) {
            throw new NotFoundException(`No schedules found for student with ID ${studentId}`);
        }

        return userSchedules;
    }

    async update(id: number, updateUserScheduleDto: UpdateUserScheduleDto): Promise<UserSchedule> {
        await this.userScheduleRepository.update(id, updateUserScheduleDto);
        return await this.findOne(id);
    }

    async findStudentsByClassId(classId: number) {
        const userSchedules = await this.userScheduleRepository.find({
            where: { schedule: { class: { id: classId } } },
            relations: ['student', 'schedule', 'schedule.class'],
        });

        const students = userSchedules.map(userSchedule => ({
            studentName: userSchedule.student.name,
            remainingClasses: userSchedule.remainingClasses,
            className: userSchedule.schedule.class.className,
            schedule: {
                dayOfWeek: userSchedule.schedule.dayOfWeek,
                startTime: userSchedule.schedule.startTime,
                endTime: userSchedule.schedule.endTime
            },
        }));

        return students;
    }

    async findSchedulesByStudentAndLocation(studentId: number, locationId: number) {
        const userSchedules = await this.userScheduleRepository.find({
            where: { student: { id: studentId }, schedule: { class: { location: { id: locationId } } } },
            relations: ['schedule', 'schedule.class', 'schedule.class.location'],
        });

        const schedules = userSchedules.map(userSchedule => ({
            userScheduleId: userSchedule.id,
            className: userSchedule.schedule.class.className,
            dayOfWeek: userSchedule.schedule.dayOfWeek,
            startTime: userSchedule.schedule.startTime,
            endTime: userSchedule.schedule.endTime,
        }));

        return schedules;
    }

    async findSchedulesWithRemainingClasses(studentId: number): Promise<any[]> {
        const userSchedules = await this.userScheduleRepository.find({
            where: { student: { id: studentId }, remainingClasses: MoreThan(0) },
            relations: ['schedule', 'schedule.class'],
        });

        if (!userSchedules.length) {
            throw new NotFoundException(`No schedules found with remaining classes for student with ID ${studentId}`);
        }

        const schedules = await Promise.all(userSchedules.map(async userSchedule => {
            const attendanceRecorded = await this.attendanceService.isAttendanceRecordedToday(userSchedule.id);

            return {
                userScheduleId: userSchedule.id,
                className: userSchedule.schedule.class.className,
                dayOfWeek: userSchedule.schedule.dayOfWeek,
                startTime: userSchedule.schedule.startTime,
                endTime: userSchedule.schedule.endTime,
                attendanceRecorded: attendanceRecorded,
            };
        }));

        return schedules;
    }
}
