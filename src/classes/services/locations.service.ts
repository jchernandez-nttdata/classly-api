import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '../entities/locations.entity';
import { Repository } from 'typeorm';
import { LocationDto, UpdateLocationDto } from '../dtos/location.dto';

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(Location)
        private locationRepository: Repository<Location>,
    ) { }

    async create(body: LocationDto) {
        const location = this.locationRepository.create(body);
        await this.locationRepository.save(location);
        return location;
    }

    async update(id: number, updateUserDto: UpdateLocationDto): Promise<Location> {
        await this.locationRepository.update(id, updateUserDto);
        return await this.findOne(id);
    }

    async findAll(): Promise<Location[]> {
        return this.locationRepository.find();
    }

    async findOne(id: number): Promise<Location> {
        try {
            return await this.locationRepository.findOneOrFail({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw new NotFoundException('Could not find Location with id: ' + id)
        }
    }
}
