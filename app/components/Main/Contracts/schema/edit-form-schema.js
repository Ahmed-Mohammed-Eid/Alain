import { z } from 'zod';

export const editContractSchema = (lang) => {
    return z.object({
        clientPhone: z.string().min(1, { message: lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required' }),
        clientName: z.string().min(1, { message: lang === 'ar' ? 'اسم العميل مطلوب' : 'Client name is required' }),
        clientIdNumber: z.string().min(1, { message: lang === 'ar' ? 'رقم الهوية مطلوب' : 'ID number is required' }),
        clientAddress: z.object({
            Governorate: z.string().optional(),
            region: z.string().optional(),
            block: z.string().optional(),
            street: z.string().optional(),
            building: z.string().optional(),
            apartment: z.string().optional()
        }).optional(),
        contractDate: z.date().nullable().optional(),
        contractType: z.string().min(1, { message: lang === 'ar' ? 'نوع العقد مطلوب' : 'Contract type is required' }),
        realestateId: z.string().min(1, { message: lang === 'ar' ? 'العقار مطلوب' : 'Real estate is required' }),
        unitsId: z.array(z.string()).min(1, { message: lang === 'ar' ? 'يجب اختيار وحدة واحدة على الأقل' : 'At least one unit is required' }),
        contractAmount: z.number().min(1, { message: lang === 'ar' ? 'قيمة العقد مطلوبة' : 'Contract amount is required' }),
        contractDuration: z.number().min(0, { message: lang === 'ar' ? 'مدة العقد مطلوبة' : 'Contract duration is required' }),
        contractStartDate: z.date({ required_error: lang === 'ar' ? 'تاريخ بداية العقد مطلوب' : 'Contract start date is required' }),
        contractEndDate: z.date({ required_error: lang === 'ar' ? 'تاريخ نهاية العقد مطلوب' : 'Contract end date is required' }),
        installmentsNumber: z.number().min(1, { message: lang === 'ar' ? 'عدد الأقساط مطلوب' : 'Installments number is required' }),
        installments: z.array(z.object({
            date: z.date({ required_error: lang === 'ar' ? 'تاريخ القسط مطلوب' : 'Installment date is required' }),
            price: z.number().min(0, { message: lang === 'ar' ? 'قيمة القسط مطلوبة' : 'Installment price is required' }),
            paymentType: z.string().min(1, { message: lang === 'ar' ? 'طريقة الدفع مطلوبة' : 'Payment type is required' }),
            reason: z.string().min(1, { message: lang === 'ar' ? 'سبب القسط مطلوب' : 'Installment reason is required' }).optional()
        })).optional()
    });
};