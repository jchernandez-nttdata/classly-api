import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { LocationsService } from 'src/classes/services/locations.service';
import { ClassesService } from 'src/classes/services/classes.service';
import { SchedulesService } from 'src/classes/services/schedules.service';
import { ClassesModule } from 'src/classes/classes.module';
import { UsersService } from 'src/users/services/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ClassesModule, UsersModule],
  providers: [SeedService, LocationsService, ClassesService, SchedulesService, UsersService],
  controllers: [SeedController]
})
export class SeedModule { }
