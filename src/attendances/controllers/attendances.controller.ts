import { Controller, Get, Param, Post } from '@nestjs/common';
import { AttendancesService } from '../services/attendances.service';
import { Attendance } from '../entities/attendance.entity';

@Controller()
export class AttendancesController {
    constructor(private readonly attendanceService: AttendancesService) { }

    @Post('userSchedules/:userScheduleId/attendances')
    async addAttendance(@Param('userScheduleId') userScheduleId: number): Promise<Attendance> {
        return await this.attendanceService.addAttendance(userScheduleId);
    }

    @Get('students/:studentId/attendances')
    async getAttendancesByStudentId(@Param('studentId') studentId: number): Promise<any[]> {
        return await this.attendanceService.getAttendancesByStudentId(studentId);
    }

    @Get('schedules/:scheduleId/attendances/dates')
    async getAttendanceDatesByScheduleId(@Param('scheduleId') scheduleId: number): Promise<string[]> {
        return await this.attendanceService.getAttendanceDatesByScheduleId(scheduleId);
    }
}
