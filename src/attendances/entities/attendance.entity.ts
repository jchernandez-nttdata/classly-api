import { UserSchedule } from 'src/classes/entities/user_schedule.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserSchedule, userSchedule => userSchedule.id)
  userSchedule: number;

  @Column()
  registrationDate: Date;
}