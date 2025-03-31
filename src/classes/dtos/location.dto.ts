import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  locationName: string;

  @IsString()
  address: string;
}

export class UpdateLocationDto extends PartialType(LocationDto) {}