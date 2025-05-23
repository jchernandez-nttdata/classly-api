import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SchedulesService } from '../services/schedules.service';
import { ScheduleDto, UpdateScheduleDto } from '../dtos/schedule.dto';
import { UserSchedulesService } from '../services/user_schedules.service';

@Controller()
export class UserSchedulesController {
    constructor(
        private readonly userSchedulesService: UserSchedulesService,
    ) { }

    @Get('/schedules/:scheduleId/students')
    async getStudentsBySchedule(@Param('scheduleId') scheduleId: number) {
        return this.userSchedulesService.findStudentsByScheduleId(scheduleId);
    }

    @Delete('students/:studentId/schedules/:scheduleId')
    unenrollStudent(
        @Param('studentId', ParseIntPipe) studentId: number,
        @Param('scheduleId', ParseIntPipe) scheduleId: number,
    ) {
        return this.userSchedulesService.unenrollStudent(studentId, scheduleId);
    }
}
