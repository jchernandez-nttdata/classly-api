import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/register-student.dto';
import { UpdateUserDto } from '../dtos/update-student.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        try {
            return this.userService.update(id, updateUserDto);
        } catch (error) {
            throw error
        }
    }

    @Get('students')
    findStudents(@Query('search') search?: string) {
      return this.userService.findStudents(search);
    }
}
