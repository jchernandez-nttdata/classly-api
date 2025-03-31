import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreatePaymentDto {
    @IsInt()
    studentId: number;

    @IsInt()
    scheduleId: number;

    @IsInt()
    @Min(0)
    amount: number;

    @IsInt()
    @Min(0)
    paidClasses: number;
}