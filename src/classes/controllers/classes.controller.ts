import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ClassesService } from '../services/classes.service';
import { ClassDto, UpdateClassDto } from '../dtos/class.dto';

@Controller('locations/:locationId/classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    @Post()
    create(
        @Param('locationId') locationId: number,
        @Body() createClassDto: ClassDto,
    ) {
        return this.classesService.create(locationId, createClassDto);
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() updateClassDto: UpdateClassDto,
    ) {
        return this.classesService.update(id, updateClassDto);
    }

    @Get()
    findAllByLocation(@Param('locationId') locationId: number) {
      return this.classesService.findAllByLocation(locationId);
    }
}
