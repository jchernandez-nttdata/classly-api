import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async validateUser(loginDto: LoginDto): Promise<User> {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });
    
        if (user && user.password === password) {
          return user;
        } else {
          throw new UnauthorizedException('Invalid email or password');
        }
      }
}
