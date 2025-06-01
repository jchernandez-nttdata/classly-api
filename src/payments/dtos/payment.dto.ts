import { IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreatePaymentDto {
    @IsInt()
    studentId: number;

    @IsInt()
    scheduleId: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    amount: number;

    @IsInt()
    @Min(0)
    paidClasses: number;
}