import { UserSchedule } from 'src/classes/entities/user_schedule.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserSchedule, userSchedule => userSchedule.id)
  userSchedule: UserSchedule;

  @Column('decimal', {
    precision: 10, scale: 2, transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  }) amount: number;

  @Column()
  paymentDate: Date;

  @Column()
  paidClasses: number;
}