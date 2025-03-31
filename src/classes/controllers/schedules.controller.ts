import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SchedulesService } from '../services/schedules.service';
import { ScheduleDto, UpdateScheduleDto } from '../dtos/schedule.dto';

@Controller('classes/:classId/schedules')
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) { }

    @Post()
    create(
        @Param('classId') classId: number,
        @Body() createScheduleDto: ScheduleDto,
    ) {
        return this.schedulesService.create(classId, createScheduleDto);
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() updateScheduleDto: UpdateScheduleDto,
    ) {
        return this.schedulesService.update(id, updateScheduleDto);
    }

    @Get()
    findAllByClass(@Param('classId') classId: number) {
        return this.schedulesService.findAllByClass(classId);
    }
}
