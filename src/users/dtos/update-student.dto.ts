import { CreateUserDto } from './register-student.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(CreateUserDto, ['role'] as const) {}