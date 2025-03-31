import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Schedule } from './schedule.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('user_schedules')
export class UserSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  student: number;

  @ManyToOne(() => Schedule, schedule => schedule.id)
  schedule: number;
}