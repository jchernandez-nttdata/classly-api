import { forwardRef, Module } from '@nestjs/common';
import { AttendancesController } from './controllers/attendances.controller';
import { AttendancesService } from './services/attendances.service';
import { ClassesModule } from 'src/classes/classes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    forwardRef(() => ClassesModule),
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService],
  exports: [AttendancesService]
})
export class AttendancesModule { }
