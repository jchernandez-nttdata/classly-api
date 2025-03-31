import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchedule } from '../entities/user_schedule.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { SchedulesService } from './schedules.service';
import { CreateUserScheduleDto, UpdateUserScheduleDto } from '../dtos/user_schedule.dto';
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

    async update(id: number, updateUserScheduleDto: UpdateUserScheduleDto): Promise<UserSchedule> {
        await this.userScheduleRepository.update(id, updateUserScheduleDto);
        return await this.findOne(id);
    }
}
