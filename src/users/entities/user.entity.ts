import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  dni: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  role: string; // 'admin' or 'student'

  @Column({ type: 'date' })
  birthdate: string; // YYYY-MM-DD
}