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

export default function ContractsCreateForm({ lang }) {
    // LOADING STATE
    const [loading, setLoading] = useState(false);

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

    // TRANSLATIONS
    const translations = {
        ar: {
            title: 'إنشاء عقد جديد',
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
            createContract: 'إنشاء العقد',
            fillAllFields: 'يرجى تعبئة جميع الحقول',
            success: 'تم إنشاء العقد بنجاح',
            error: 'حدث خطأ أثناء إنشاء العقد'
        },
        en: {
            title: 'Create New Contract',
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
            createContract: 'Create Contract',
            fillAllFields: 'Please fill all fields',
            success: 'Contract created successfully',
            error: 'Error creating contract'
        }
    };

    const t = translations[lang] || translations.ar;
    const direction = lang === 'ar' ? 'rtl' : 'ltr';

    // Check client data when phone number is entered
    const checkClientData = async (phone) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.API_URL}/client/data?clientPhone=${phone}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data?.client) {
                const { clientName, clientIdNumber, clientAddress } = response.data.client;
                setForm((prev) => ({
                    ...prev,
                    clientName: clientName,
                    clientIdNumber: clientIdNumber,
                    clientAddress: clientAddress
                }));
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };

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
            const response = await axios.post(`${process.env.API_URL}/create/contract`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(t.success);
            // Reset form or redirect
        } catch (error) {
            toast.error(t.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="mb-0" dir={direction} onSubmit={handleSubmit}>
            <div className="card">
                <h1 className="text-2xl font-bold mb-4 uppercase">{t.title}</h1>
                <div className="grid formgrid p-fluid">
                    {/* Phone Number (First Input) */}
                    <div className="field col-12">
                        <label htmlFor="clientPhone">{t.clientPhone}</label>
                        <InputText id="clientPhone" placeholder={t.clientPhone} value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} onBlur={(e) => checkClientData(e.target.value)} />
                    </div>

                    {/* Client Information */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="clientName">{t.clientName}</label>
                        <InputText id="clientName" placeholder={t.clientName} value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="clientIdNumber">{t.clientIdNumber}</label>
                        <InputText id="clientIdNumber" placeholder={t.clientIdNumber} value={form.clientIdNumber} onChange={(e) => setForm({ ...form, clientIdNumber: e.target.value })} />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="clientAddress">{t.clientAddress}</label>
                        <InputText id="clientAddress" placeholder={t.clientAddress} value={form.clientAddress} onChange={(e) => setForm({ ...form, clientAddress: e.target.value })} />
                    </div>

                    {/* Contract Details */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractDate">{t.contractDate}</label>
                        <Calendar id="contractDate" placeholder={t.contractDate} value={form.contractDate} onChange={(e) => setForm({ ...form, contractDate: e.value })} dateFormat="dd-mm-yy" />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractAmount">{t.contractAmount}</label>
                        <InputNumber id="contractAmount" placeholder={t.contractAmount} value={form.contractAmount} onValueChange={(e) => setForm({ ...form, contractAmount: e.value })} />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="contractDuration">{t.contractDuration}</label>
                        <InputNumber id="contractDuration" placeholder={t.contractDuration} value={form.contractDuration} onValueChange={(e) => setForm({ ...form, contractDuration: e.value })} />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractStartDate">{t.contractStartDate}</label>
                        <Calendar id="contractStartDate" placeholder={t.contractStartDate} value={form.contractStartDate} onChange={(e) => setForm({ ...form, contractStartDate: e.value })} dateFormat="dd-mm-yy" />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractEndDate">{t.contractEndDate}</label>
                        <Calendar id="contractEndDate" placeholder={t.contractEndDate} value={form.contractEndDate} onChange={(e) => setForm({ ...form, contractEndDate: e.value })} dateFormat="dd-mm-yy" />
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
                                <label htmlFor={`installmentDate-${index}`}>{t.date}</label>
                                <Calendar id={`installmentDate-${index}`} value={installment.date} onChange={(e) => updateInstallment(index, 'date', e.value)} dateFormat="dd-mm-yy" placeholder={t.date} />
                            </div>
                            <div className="field col-12 md:col-2">
                                <label htmlFor={`installmentPrice-${index}`}>{t.price}</label>
                                <InputNumber id={`installmentPrice-${index}`} value={installment.price} onValueChange={(e) => updateInstallment(index, 'price', e.value)} placeholder={t.price} />
                            </div>
                            <div className="field col-12 md:col-3">
                                <label htmlFor={`installmentReason-${index}`}>{t.reason}</label>
                                <InputText id={`installmentReason-${index}`} value={installment.reason} onChange={(e) => updateInstallment(index, 'reason', e.target.value)} placeholder={t.reason} />
                            </div>
                            <div className="field col-12 md:col-3">
                                <label htmlFor={`installmentPaymentType-${index}`}>{t.paymentType}</label>
                                <Dropdown
                                    id={`installmentPaymentType-${index}`}
                                    value={installment.paymentType}
                                    defaultValue={t.card}
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
                                t.createContract
                            )
                        }
                        disabled={loading}
                    />
                </div>
            </div>
        </form>
    );
}