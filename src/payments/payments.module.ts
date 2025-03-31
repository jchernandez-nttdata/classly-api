import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsService } from './services/payments.service';
import { ClassesModule } from 'src/classes/classes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [
    ClassesModule,
    TypeOrmModule.forFeature([Payment])
  ]
})
export class PaymentsModule {}
