import { Controller, Param, Post } from '@nestjs/common';
import { AttendancesService } from '../services/attendances.service';
import { Attendance } from '../entities/attendance.entity';

@Controller('')
export class AttendancesController {
    constructor(private readonly attendanceService: AttendancesService) {}

    @Post('userSchedules/:userScheduleId/attendance')
    async addAttendance(@Param('userScheduleId') userScheduleId: number): Promise<Attendance> {
        return await this.attendanceService.addAttendance(userScheduleId);
    }
}
