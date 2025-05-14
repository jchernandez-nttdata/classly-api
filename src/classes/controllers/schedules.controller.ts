import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SchedulesService } from '../services/schedules.service';
import { ScheduleDto, UpdateScheduleDto } from '../dtos/schedule.dto';
import { UserSchedulesService } from '../services/user_schedules.service';

@Controller()
export class SchedulesController {
    constructor(
        private readonly schedulesService: SchedulesService,
        private readonly userSchedulesService: UserSchedulesService,
    ) { }

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

    @Get('locations/:locationId/schedules')
    findAllByLocation(@Param('locationId') locationId: number) {
        return this.schedulesService.findAllByLocationId(locationId);
    }

    @Get('locations/:locationId/students/:studentId/schedules')
    async getSchedulesByStudentAndLocation(
        @Param('locationId') locationId: number,
        @Param('studentId') studentId: number
    ) {
        return await this.userSchedulesService.findSchedulesByStudentAndLocation(studentId, locationId);
    }

    @Get('students/:studentId/schedules')
    async getSchedulesWithRemainingClasses(@Param('studentId') studentId: number): Promise<any[]> {
        return await this.userSchedulesService.findSchedulesWithRemainingClasses(studentId);
    }
}
