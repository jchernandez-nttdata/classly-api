import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClassDto {
  @IsString()
  className: string;

  @IsString()
  description: string;
}

export class UpdateClassDto extends PartialType(ClassDto) {}