import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../entities/schedule.entity';
import { Repository } from 'typeorm';
import { ClassesService } from './classes.service';
import { ScheduleDto, UpdateScheduleDto } from '../dtos/schedule.dto';

@Injectable()
export class SchedulesService {
    constructor(
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
        private readonly classService: ClassesService,
    ) { }

    async create(classId: number, createScheduleDto: ScheduleDto): Promise<Schedule> {
        const classEntity = await this.classService.findOne(classId);
        const newSchedule = this.scheduleRepository.create({
            ...createScheduleDto,
            class: classEntity,
        });
        return await this.scheduleRepository.save(newSchedule);
    }

    async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
        await this.scheduleRepository.update(id, updateScheduleDto);
        return await this.scheduleRepository.findOneOrFail({
            where: {
                id: id
            }
        });
    }

    async findAllByClass(classId: number): Promise<Schedule[]> {
        const classEntity = await this.classService.findOne(classId);
        return await this.scheduleRepository.find({ where: { class: classEntity } });
    }
}
