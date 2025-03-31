import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { LocationsService } from 'src/classes/services/locations.service';
import { ClassesService } from 'src/classes/services/classes.service';
import { SchedulesService } from 'src/classes/services/schedules.service';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
  imports: [ClassesModule],
  providers: [SeedService, LocationsService, ClassesService, SchedulesService],
  controllers: [SeedController]
})
export class SeedModule { }
