import { Module } from '@nestjs/common';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
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
