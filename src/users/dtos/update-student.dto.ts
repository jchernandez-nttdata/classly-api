import { CreateUserDto } from './register-student.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
    OmitType(CreateUserDto, ['role'] as const)
) { }