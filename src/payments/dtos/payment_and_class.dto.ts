
interface PaymentWithClassInfo {
  id: number;
  studentName: string;
  amount: number;
  paidClasses: number;
  paymentDate: Date;
  class: {
    locationName: string;
    className: string;
    schedule: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    };
  };
}
