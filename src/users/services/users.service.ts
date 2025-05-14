import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/register-student.dto';
import { UpdateUserDto } from '../dtos/update-student.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(body: CreateUserDto) {
        try {
            const student = this.userRepository.create(body);
            await this.userRepository.save(student);
            return student;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Usuario con mismo dni u email ya existente.');
            }
            throw error;
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            if (updateUserDto.password === '') {
                delete updateUserDto.password;
            }
            await this.userRepository.update(id, updateUserDto);
            return await this.findOne(id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Usuario con mismo dni u email ya existente.');
            }
            throw error;
        }
    }

    async findStudents(): Promise<Omit<User, 'password'>[]> {
        const students = await this.userRepository.find({ where: { role: 'student' } });
        return students.map(student => {
            const { password, ...studentWithoutPassword } = student;
            return studentWithoutPassword;
        });
    }

    async findOne(id: number): Promise<User> {
        try {
            return await this.userRepository.findOneOrFail({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw new NotFoundException('Could not find any User with id: ' + id)
        }
    }
}
