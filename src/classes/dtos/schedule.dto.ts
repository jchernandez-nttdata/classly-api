import { PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, Max, Matches } from 'class-validator';

export class ScheduleDto {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @Max(7)
    dayOfWeek: number;

    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    startTime: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    endTime: string;
}

export class UpdateScheduleDto extends PartialType(ScheduleDto) {}