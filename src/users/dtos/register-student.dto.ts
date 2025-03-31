import { IsEmail, IsString, IsPhoneNumber, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  dni: string;

  @IsString()
  password: string;

  @IsPhoneNumber('PE')
  phone: string;

  @IsEnum(['admin', 'student'])
  role: string;
}