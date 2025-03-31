import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchedule } from '../entities/user_schedule.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { SchedulesService } from './schedules.service';
import { CreateUserScheduleDto } from '../dtos/user_schedule.dto';
import { User } from 'src/users/entities/user.entity';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class UserSchedulesService {
    constructor(
        @InjectRepository(UserSchedule)
        private readonly userScheduleRepository: Repository<UserSchedule>,
        private readonly userService: UsersService,
        private readonly scheduleService: SchedulesService,
    ) { }

    async create(createUserScheduleDto: CreateUserScheduleDto): Promise<UserSchedule> {
        const { studentId, scheduleId, remainingClasses } = createUserScheduleDto;

        const student = await this.userService.findOne(studentId)
        const schedule = await this.scheduleService.findOne(scheduleId);

        await this.checkIfUserScheduleExistsOrThrow(studentId, scheduleId);

        const userSchedule = this.userScheduleRepository.create({
            student: student,
            schedule: schedule,
            remainingClasses: remainingClasses,
        });

        return await this.userScheduleRepository.save(userSchedule);
    }

    async checkIfUserScheduleExistsOrThrow(studentId: number, scheduleId: number): Promise<void> {
        const existingUserSchedule = await this.userScheduleRepository.findOne({
            where: {
                student: { id: studentId },
                schedule: { id: scheduleId },
            },
        });

        if (existingUserSchedule) {
            throw new Error('UserSchedule with the same student and schedule already exists');
        }
    }
}
