import { UserSchedule } from 'src/classes/entities/user_schedule.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserSchedule, userSchedule => userSchedule.id)
  userSchedule: number;

  @Column()
  amount: number;

  @Column()
  paymentDate: Date;

  @Column()
  remainingClasses: number;
}