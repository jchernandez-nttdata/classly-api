import { Injectable, NotFoundException } from '@nestjs/common';
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
        return await this.findOne(id)
    }

    async findAllByClass(classId: number): Promise<Schedule[]> {
        const classEntity = await this.classService.findOne(classId);
        return await this.scheduleRepository.find({ where: { class: classEntity } });
    }

    async findAllByLocationId(locationId: number) {
        const schedules = await this.scheduleRepository.find({
            relations: ['class', 'class.location'],
            where: {
                class: {
                    location: {
                        id: locationId,
                    },
                },
            },
        });

        return schedules.map(schedule => ({
            id: schedule.id,
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            className: schedule.class.className,
            locationName: schedule.class.location.locationName,
        }));
    }

    async findOne(id: number): Promise<Schedule> {
        try {
            return await this.scheduleRepository.findOneOrFail({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw new NotFoundException('Could not find Schedule with id: ' + id)
        }
    }
}
