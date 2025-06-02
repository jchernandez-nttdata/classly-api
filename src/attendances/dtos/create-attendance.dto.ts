// src/attendances/dto/create-attendance.dto.ts
import { IsInt, Min } from 'class-validator';

export class CreateAttendanceDto {
    @IsInt()
    @Min(1)
    userScheduleId: number;

    @IsInt()
    @Min(1)
    locationId: number;
}
