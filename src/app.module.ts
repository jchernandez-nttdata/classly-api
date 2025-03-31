import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { AttendancesModule } from './attendances/attendances.module';
import { PaymentsModule } from './payments/payments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [UsersModule, ClassesModule, AttendancesModule, PaymentsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'bkd3sszxgp8vmrxys2rw-mysql.services.clever-cloud.com',
      port: 3306,
      username: 'udolnajtd2brwltd',
      password: 'lbty0hDeladI3Z9RYDJl',
      database: 'bkd3sszxgp8vmrxys2rw',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy()
    }),
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
