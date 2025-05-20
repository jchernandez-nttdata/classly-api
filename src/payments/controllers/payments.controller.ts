import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { CreatePaymentDto } from '../dtos/payment.dto';

@Controller()
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('payments')
    createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.createPayment(createPaymentDto);
    }

    @Get('students/:studentId/payments')
    async getPaymentsByStudent(@Param('studentId') studentId: number) {
        return await this.paymentsService.getPaymentsByStudent(studentId);
    }

    @Get('user-schedules/:userScheduleId/payments')
    async getPaymentsByUserScheduleId(@Param('userScheduleId') userScheduleId: number) {
        return await this.paymentsService.getPaymentsByUserScheduleId(userScheduleId);
    }

    @Get('payments')
    async getAllPayments() {
        return await this.paymentsService.getAllPayments();
    }
}
