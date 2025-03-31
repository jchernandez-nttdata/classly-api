import { forwardRef, Module } from '@nestjs/common';
import { ClassesController } from './controllers/classes.controller';
import { ClassesService } from './services/classes.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Schedule } from './entities/schedule.entity';
import { UserSchedule } from './entities/user_schedule.entity';
import { Location } from './entities/locations.entity';
import { LocationsController } from './controllers/locations.controller';
import { LocationsService } from './services/locations.service';
import { SchedulesService } from './services/schedules.service';
import { SchedulesController } from './controllers/schedules.controller';
import { UserSchedulesService } from './services/user_schedules.service';
import { AttendancesService } from 'src/attendances/services/attendances.service';
import { AttendancesModule } from 'src/attendances/attendances.module';


@Module({
  imports: [
    UsersModule,
    forwardRef(() => AttendancesModule),
    TypeOrmModule.forFeature([Class, Location, Schedule, UserSchedule])
  ],
  controllers: [ClassesController, LocationsController, SchedulesController],
  providers: [ClassesService, LocationsService, SchedulesService, UserSchedulesService],
  exports: [TypeOrmModule, LocationsService, ClassesService, SchedulesService, UserSchedulesService]
})

export class ClassesModule {}
