import { Module } from '@nestjs/common';
import { AttendancesController } from './controllers/attendances.controller';
import { AttendancesService } from './services/attendances.service';
import { ClassesModule } from 'src/classes/classes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';

@Module({
  imports: [
    ClassesModule,
    TypeOrmModule.forFeature([Attendance])
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService]
})
export class AttendancesModule { }
