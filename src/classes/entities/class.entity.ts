import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Location } from './locations.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  className: string;

  @Column()
  description: string;

  @ManyToOne(() => Location, location => location.id)
  location: Location;
}