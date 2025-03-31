import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ClassesService } from '../services/classes.service';
import { ClassDto, UpdateClassDto } from '../dtos/class.dto';
import { UserSchedulesService } from '../services/user_schedules.service';

@Controller()
export class ClassesController {
    constructor(
        private readonly classesService: ClassesService,
        private readonly userScheduleService: UserSchedulesService,
    ) { }

    @Post('locations/:locationId/classes')
    create(
        @Param('locationId') locationId: number,
        @Body() createClassDto: ClassDto,
    ) {
        return this.classesService.create(locationId, createClassDto);
    }

    @Put('locations/:locationId/classes/:id')
    update(
        @Param('id') id: number,
        @Body() updateClassDto: UpdateClassDto,
    ) {
        return this.classesService.update(id, updateClassDto);
    }

    @Get('locations/:locationId/classes')
    findAllByLocation(@Param('locationId') locationId: number) {
      return this.classesService.findAllByLocation(locationId);
    }

    @Get('classes/:classId/students')
    async getStudentsByClassId(@Param('classId') classId: number) {
        return this.userScheduleService.findStudentsByClassId(classId)
    }
}
