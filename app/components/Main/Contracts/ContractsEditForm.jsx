'use client';
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function ContractsEditForm({ lang, contractId }) {
    const { id } = useParams();

    // LOADING STATES
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // STATE
    const [form, setForm] = useState({
        contractDate: null,
        clientName: '',
        clientIdNumber: '',
        clientPhone: '',
        clientAddress: '',
        contractAmount: 0,
        contractStartDate: null,
        contractDuration: 0,
        contractEndDate: null,
        unitsId: [],
        installments: []
    });

    // Load contract data
    useEffect(() => {
        const fetchContractData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.API_URL}/client/contract?contractId=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const contract = response.data?.clientContract;
                if (contract) {
                    // Convert date strings to Date objects
                    setForm({
                        ...contract,
                        clientPhone: contract.clientPhone,
                        clientName: contract.clientName,
                        clientIdNumber: contract.clientIdNumber,
                        clientAddress: contract.clientAddress,
                        contractDate: new Date(contract.contractDate),
                        contractStartDate: new Date(contract.contractStartDate),
                        contractEndDate: new Date(contract.contractEndDate),
                        contractId: contract._id,
                        installments: contract.installments.map((inst) => ({
                            ...inst,
                            date: new Date(inst.date)
                        }))
                    });
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || t.loadError);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchContractData();
    }, [id]);

    // TRANSLATIONS
    const translations = {
        ar: {
            title: 'تعديل العقد',
            clientPhone: 'رقم الهاتف',
            clientName: 'اسم العميل',
            clientIdNumber: 'رقم الهوية',
            clientAddress: 'عنوان العميل',
            contractDate: 'تاريخ العقد',
            contractAmount: 'قيمة العقد',
            contractStartDate: 'تاريخ بداية العقد',
            contractDuration: 'مدة العقد (بالسنوات)',
            contractEndDate: 'تاريخ نهاية العقد',
            units: 'الوحدات',
            installments: 'الأقساط',
            addInstallment: 'إضافة قسط',
            date: 'التاريخ',
            price: 'المبلغ',
            paymentType: 'طريقة الدفع',
            reason: 'السبب',
            delete: 'حذف',
            cash: 'نقداً',
            check: 'شيك',
            card: 'بطاقة دفع',
            updateContract: 'تحديث العقد',
            fillAllFields: 'يرجى تعبئة جميع الحقول',
            success: 'تم تحديث العقد بنجاح',
            error: 'حدث خطأ أثناء تحديث العقد',
            loadError: 'حدث خطأ أثناء تحميل بيانات العقد'
        },
        en: {
            title: 'Edit Contract',
            clientPhone: 'Phone Number',
            clientName: 'Client Name',
            clientIdNumber: 'ID Number',
            clientAddress: 'Client Address',
            contractDate: 'Contract Date',
            contractAmount: 'Contract Amount',
            contractStartDate: 'Contract Start Date',
            contractDuration: 'Contract Duration (Years)',
            contractEndDate: 'Contract End Date',
            units: 'Units',
            installments: 'Installments',
            addInstallment: 'Add Installment',
            date: 'Date',
            price: 'Amount',
            paymentType: 'Payment Type',
            reason: 'Reason',
            delete: 'Delete',
            cash: 'Cash',
            check: 'Check',
            card: 'Card',
            updateContract: 'Update Contract',
            fillAllFields: 'Please fill all fields',
            success: 'Contract updated successfully',
            error: 'Error updating contract',
            loadError: 'Error loading contract data'
        }
    };

    const t = translations[lang] || translations.ar;
    const direction = lang === 'ar' ? 'rtl' : 'ltr';

    // Add new installment row
    const addInstallment = () => {
        setForm((prev) => ({
            ...prev,
            installments: [
                ...prev.installments,
                {
                    date: null,
                    price: 0,
                    paymentType: 'cash',
                    reason: ''
                }
            ]
        }));
    };

    // Remove installment row
    const removeInstallment = (index) => {
        setForm((prev) => ({
            ...prev,
            installments: prev.installments.filter((_, i) => i !== index)
        }));
    };

    // Update installment data
    const updateInstallment = (index, field, value) => {
        setForm((prev) => ({
            ...prev,
            installments: prev.installments.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!form.clientPhone || !form.clientName || !form.contractAmount) {
            toast.error(t.fillAllFields);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.API_URL}/edit/contract`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(t.success);
        } catch (error) {
            toast.error(t.error);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <form className="mb-0" dir={direction} onSubmit={handleSubmit}>
            <div className="card">
                <h1 className="text-2xl font-bold mb-4 uppercase">{t.title}</h1>
                <div className="grid formgrid p-fluid">
                    {/* Client Information */}
                    <div className="field col-12">
                        <label htmlFor="clientPhone">{t.clientPhone}</label>
                        <InputText id="clientPhone" value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} placeholder={t.clientPhone} />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="clientName">{t.clientName}</label>
                        <InputText id="clientName" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder={t.clientName} />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="clientIdNumber">{t.clientIdNumber}</label>
                        <InputText id="clientIdNumber" value={form.clientIdNumber} onChange={(e) => setForm({ ...form, clientIdNumber: e.target.value })} placeholder={t.clientIdNumber} />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="clientAddress">{t.clientAddress}</label>
                        <InputText id="clientAddress" value={form.clientAddress} onChange={(e) => setForm({ ...form, clientAddress: e.target.value })} placeholder={t.clientAddress} />
                    </div>

                    {/* Contract Details */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractDate">{t.contractDate}</label>
                        <Calendar id="contractDate" value={form.contractDate} onChange={(e) => setForm({ ...form, contractDate: e.value })} dateFormat="dd-mm-yy" placeholder={t.contractDate} />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractAmount">{t.contractAmount}</label>
                        <InputNumber id="contractAmount" value={form.contractAmount} onValueChange={(e) => setForm({ ...form, contractAmount: e.value })} placeholder={t.contractAmount} />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="contractDuration">{t.contractDuration}</label>
                        <InputNumber id="contractDuration" value={form.contractDuration} onValueChange={(e) => setForm({ ...form, contractDuration: e.value })} placeholder={t.contractDuration} />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractStartDate">{t.contractStartDate}</label>
                        <Calendar id="contractStartDate" value={form.contractStartDate} onChange={(e) => setForm({ ...form, contractStartDate: e.value })} dateFormat="dd-mm-yy" placeholder={t.contractStartDate} />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractEndDate">{t.contractEndDate}</label>
                        <Calendar id="contractEndDate" value={form.contractEndDate} onChange={(e) => setForm({ ...form, contractEndDate: e.value })} dateFormat="dd-mm-yy" placeholder={t.contractEndDate} />
                    </div>
                </div>
            </div>

            <div className="card">
                {/* Installments Section */}
                <div className="field col-12">
                    <div className="flex justify-content-between align-items-center mb-3">
                        <h2 className="text-xl font-bold">{t.installments}</h2>
                        <Button type="button" icon="pi pi-plus" onClick={addInstallment} label={t.addInstallment} size="small" severity="help" />
                    </div>

                    {form.installments.map((installment, index) => (
                        <div key={index} className="grid formgrid p-fluid mb-3">
                            <div className="field col-12 md:col-3">
                                <Calendar value={installment.date} onChange={(e) => updateInstallment(index, 'date', e.value)} dateFormat="dd-mm-yy" placeholder={t.date} />
                            </div>
                            <div className="field col-12 md:col-2">
                                <InputNumber value={installment.price} onValueChange={(e) => updateInstallment(index, 'price', e.value)} placeholder={t.price} />
                            </div>
                            <div className="field col-12 md:col-3">
                                <InputText value={installment.reason} onChange={(e) => updateInstallment(index, 'reason', e.target.value)} placeholder={t.reason} />
                            </div>
                            <div className="field col-12 md:col-3">
                                <Dropdown
                                    value={installment.paymentType}
                                    options={[
                                        { label: t.card, value: 'card' },
                                        { label: t.cash, value: 'cash' },
                                        { label: t.check, value: 'check' }
                                    ]}
                                    onChange={(e) => updateInstallment(index, 'paymentType', e.value)}
                                />
                            </div>
                            <div className="field col-12 md:col-1 flex justify-content-end align-items-end">
                                <Button type="button" icon="pi pi-trash" className="p-button-danger" onClick={() => removeInstallment(index)} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className={`field col-12 mt-4 ${direction === 'rtl' ? 'mr-auto' : 'ml-auto'}`}>
                    <Button
                        type="submit"
                        style={{
                            width: '100%'
                        }}
                        label={
                            loading ? (
                                <ProgressSpinner
                                    fill={'#fff'}
                                    strokeWidth={'4'}
                                    style={{
                                        width: '2rem',
                                        height: '2rem'
                                    }}
                                />
                            ) : (
                                t.updateContract
                            )
                        }
                        disabled={loading}
                    />
                </div>
            </div>
        </form>
    );
}
