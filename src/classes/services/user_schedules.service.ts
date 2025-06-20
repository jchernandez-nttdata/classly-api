import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchedule } from '../entities/user_schedule.entity';
import { MoreThan, Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { SchedulesService } from './schedules.service';
import { CreateUserScheduleDto, UpdateUserScheduleDto } from '../dtos/user_schedule.dto';
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
            return await this.userScheduleRepository.findOneOrFail({
                where: { id },
                relations: ['schedule', 'schedule.class', 'schedule.class.location'],
            });
        } catch (error) {
            throw new NotFoundException('Could not find user schedule with id: ' + id);
        }
    }

    async findAllByStudentId(studentId: number): Promise<UserSchedule[]> {
        const userSchedules = await this.userScheduleRepository.find({
            where: { student: { id: studentId } },
            relations: ['schedule', 'schedule.class'],
        });

        if (!userSchedules.length) {
            throw new NotFoundException(`No user schedules found for student with ID ${studentId}`);
        }

        return userSchedules;
    }

    async findAllByScheduleId(scheduleId: number): Promise<UserSchedule[]> {
        const userSchedules = await this.userScheduleRepository.find({
            where: { schedule: { id: scheduleId } },
            relations: ['schedule'],
        });

        if (!userSchedules.length) {
            throw new NotFoundException(`No user schedules found for schedule with ID ${scheduleId}`);
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

    async findUserSchedulesByStudentId(studentId: number): Promise<any[]> {
        const userSchedules = await this.userScheduleRepository.find({
            where: { student: { id: studentId }, remainingClasses: MoreThan(0) },
            relations: ['schedule', 'schedule.class', 'schedule.class.location'],
        });

        if (!userSchedules.length) {
            throw new NotFoundException(`No schedules found with remaining classes for student with ID ${studentId}`);
        }

        const schedules = await Promise.all(userSchedules.map(async userSchedule => {
            const attendanceRecorded = await this.attendanceService.isAttendanceRecordedThisWeek(userSchedule);

            return {
                userScheduleId: userSchedule.id,
                className: userSchedule.schedule.class.className,
                locationName: userSchedule.schedule.class.location.locationName,
                dayOfWeek: userSchedule.schedule.dayOfWeek,
                startTime: userSchedule.schedule.startTime,
                endTime: userSchedule.schedule.endTime,
                attendanceRecorded: attendanceRecorded,
                remainingClasses: userSchedule.remainingClasses,
            };
        }));

        return schedules;
    }

    async findStudentsByScheduleId(scheduleId: number) {
        const userSchedules = await this.userScheduleRepository.find({
            where: {
                schedule: { id: scheduleId },
                student: { role: 'student' },
            },
            relations: ['student', 'schedule'],
        });

        return userSchedules.map(us => ({
            id: us.student.id,
            name: us.student.name,
            email: us.student.email,
            dni: us.student.dni,
            phone: us.student.phone,
            remainingClasses: us.remainingClasses
        }));
    }

    async unenrollStudent(userId: number, scheduleId: number): Promise<void> {
        const userSchedule = await this.userScheduleRepository.findOne({
            where: {
                student: { id: userId },
                schedule: { id: scheduleId },
            },
            relations: ['student', 'schedule'],
        });

        if (!userSchedule) {
            throw new NotFoundException('Enrollment not found');
        }

        if (userSchedule.remainingClasses > 0) {
            throw new BadRequestException('Student still has remaining classes');
        }

        await this.userScheduleRepository.remove(userSchedule);
    }
}
