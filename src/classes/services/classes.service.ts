import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from '../entities/class.entity';
import { Repository } from 'typeorm';
import { ClassDto, UpdateClassDto } from '../dtos/class.dto';
import { LocationsService } from './locations.service';

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Class)
        private readonly classRepository: Repository<Class>,
        private readonly locationService: LocationsService,
    ) { }

    async create(locationId: number, createClassDto: ClassDto): Promise<Class> {
        const location = await this.locationService.findOne(locationId)

        const newClass = this.classRepository.create({
            ...createClassDto,
            location: location,
        });
        return await this.classRepository.save(newClass);
    }

    async update(id: number, updateClassDto: UpdateClassDto): Promise<Class> {
        await this.classRepository.update(id, updateClassDto);
        return this.classRepository.findOneOrFail({
            where: {
                id: id
            }
        });
    }

    async findAllByLocation(locationId: number): Promise<Class[]> {
        const location = await this.locationService.findOne(locationId);
        return await this.classRepository.find({ where: { location: location } });
    }

    async findOne(id: number): Promise<Class> {
        return this.classRepository.findOneOrFail({
            where: {
                id: id
            }
        });
    }
}
