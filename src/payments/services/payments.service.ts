import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Repository } from 'typeorm';
import { UserSchedulesService } from 'src/classes/services/user_schedules.service';
import { CreatePaymentDto } from '../dtos/payment.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly userSchedulesService: UserSchedulesService,
    ) { }

    async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const { studentId, scheduleId, amount, paidClasses } = createPaymentDto;

        let userSchedule = await this.userSchedulesService.findOneByStudentAndSchedule(studentId, scheduleId);
        if (!userSchedule) {
            userSchedule = await this.userSchedulesService.create({
                studentId: studentId,
                scheduleId: scheduleId,
                remainingClasses: paidClasses,
            });
        } else {
            userSchedule.remainingClasses += paidClasses;
            await this.userSchedulesService.update(userSchedule.id, { remainingClasses: userSchedule.remainingClasses });
        }

        const payment = this.paymentRepository.create({
            userSchedule: userSchedule,
            amount: amount,
            paymentDate: new Date(),
            paidClasses: paidClasses,
        });

        return await this.paymentRepository.save(payment);
    }

    async getPaymentsByStudent(studentId: number): Promise<Payment[]> {
        const payments = await this.paymentRepository.find({
            where: { userSchedule: { student: { id: studentId } } },
            relations: ['userSchedule', 'userSchedule.student'],
        });

        if (!payments.length) {
            throw new NotFoundException(`No payments found for student with ID ${studentId}`);
        }

        return payments;
    }

    async getPaymentsByUserScheduleId(userScheduleId: number): Promise<Payment[]> {
        const payments = await this.paymentRepository.find({
            where: { userSchedule: { id: userScheduleId } },
            relations: ['userSchedule'],
        });

        if (!payments.length) {
            throw new NotFoundException(`No payments found for UserSchedule with ID ${userScheduleId}`);
        }

        return payments;
    }
}
