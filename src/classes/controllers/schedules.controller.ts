import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SchedulesService } from '../services/schedules.service';
import { ScheduleDto, UpdateScheduleDto } from '../dtos/schedule.dto';

@Controller()
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) { }

    @Post('classes/:classId/schedules')
    create(
        @Param('classId') classId: number,
        @Body() createScheduleDto: ScheduleDto,
    ) {
        return this.schedulesService.create(classId, createScheduleDto);
    }

    @Put('classes/:classId/schedules/:id')
    update(
        @Param('id') id: number,
        @Body() updateScheduleDto: UpdateScheduleDto,
    ) {
        return this.schedulesService.update(id, updateScheduleDto);
    }

    @Get('classes/:classId/schedules')
    findAllByClass(@Param('classId') classId: number) {
        return this.schedulesService.findAllByClass(classId);
    }
}
