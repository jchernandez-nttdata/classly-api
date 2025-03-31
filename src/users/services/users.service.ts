import { Injectable } from '@nestjs/common';
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
        const student = this.userRepository.create(body);
        await this.userRepository.save(student);
        return student;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async findStudents(): Promise<Omit<User, 'password'>[]> {
        const students = await this.userRepository.find({ where: { role: 'student' } });
        return students.map(student => {
            const { password, ...studentWithoutPassword } = student;
            return studentWithoutPassword;
        });
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOneOrFail({
            where: {
                id: id
            }
        });
    }
}
