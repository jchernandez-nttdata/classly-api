import { Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AttendancesService } from '../services/attendances.service';
import { Attendance } from '../entities/attendance.entity';
import { CreateAttendanceDto } from '../dtos/create-attendance.dto';

@Controller()
export class AttendancesController {
    constructor(private readonly attendanceService: AttendancesService) { }

    @Post('attendances')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreateAttendanceDto): Promise<Attendance> {
        return await this.attendanceService.addAttendance(dto.userScheduleId, dto.locationId);
    }

    @Get('students/:studentId/attendances')
    async getAttendancesByStudentId(@Param('studentId') studentId: number): Promise<any[]> {
        return await this.attendanceService.getAttendancesByStudentId(studentId);
    }

    @Get('schedules/:scheduleId/attendances/dates')
    async getAttendanceDatesByScheduleId(@Param('scheduleId') scheduleId: number): Promise<string[]> {
        return await this.attendanceService.getAttendanceDatesByScheduleId(scheduleId);
    }

    @Get('schedules/:scheduleId/attendances')
    async getStudentAttendanceByDate(
        @Param('scheduleId') scheduleId: number,
        @Query('date') date: string
    ): Promise<{ name: string, registrationDate: string }[]> {
        return this.attendanceService.getStudentAttendanceByDate(scheduleId, date);
    }
}
