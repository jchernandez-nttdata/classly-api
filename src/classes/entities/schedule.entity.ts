import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Class } from './class.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Class, classEntity => classEntity.id)
  class: Class;

  @Column()
  dayOfWeek: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}