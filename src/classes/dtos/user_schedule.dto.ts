import { OmitType, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateUserScheduleDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsInt()
  @IsNotEmpty()
  scheduleId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  remainingClasses: number;
}

export class UpdateUserScheduleDto extends OmitType(CreateUserScheduleDto, ['scheduleId', 'studentId'] as const) { }