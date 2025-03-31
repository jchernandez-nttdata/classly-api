import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { LocationsService } from '../services/locations.service';
import { LocationDto, UpdateLocationDto } from '../dtos/location.dto';

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) { }

    @Get()
    findAll() {
        return this.locationsService.findAll();
    }

    @Post()
    create(@Body() createLocationDto: LocationDto) {
        return this.locationsService.create(createLocationDto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateLocationDto: UpdateLocationDto) {
        return this.locationsService.update(id, updateLocationDto);
    }
}
