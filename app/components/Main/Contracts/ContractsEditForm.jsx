'use client';
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function ContractsEditForm({ lang, contractId }) {
    const { id } = useParams();

    // LOADING STATES
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [realestates, setRealestates] = useState([]);
    const [units, setUnits] = useState([]);

    // STATE
    const [form, setForm] = useState({
        contractDate: null,
        clientName: '',
        contractType: '',
        clientIdNumber: '',
        clientPhone: '',
        clientAddress: {
            Governorate: '',
            region: '',
            block: '',
            street: '',
            building: '',
            apartment: ''
        },
        contractAmount: 0,
        contractStartDate: null,
        contractDuration: 0,
        contractEndDate: null,
        realestateId: null,
        unitsId: [],
        installments: [],
        installmentsNumber: 0
    });

    // TRANSLATIONS
    const translations = {
        ar: {
            title: 'تعديل العقد',
            clientPhone: 'رقم الهاتف',
            clientName: 'اسم العميل',
            clientIdNumber: 'رقم الهوية',
            clientAddress: 'عنوان العميل',
            governorate: 'المحافظة',
            region: 'المنطقة',
            block: 'القطعة',
            street: 'الشارع',
            building: 'المبنى',
            apartment: 'الشقة',
            contractDate: 'تاريخ العقد',
            contractAmount: 'قيمة العقد',
            contractStartDate: 'تاريخ بداية العقد',
            contractDuration: 'مدة العقد (بالسنوات)',
            contractEndDate: 'تاريخ نهاية العقد',
            units: 'الوحدات',
            installments: 'الأقساط',
            date: 'التاريخ',
            price: 'المبلغ',
            paymentType: 'طريقة الدفع',
            reason: 'السبب',
            cash: 'نقداً',
            check: 'شيك',
            card: 'بطاقة دفع',
            updateContract: 'تحديث العقد',
            fillAllFields: 'يرجى تعبئة جميع الحقول',
            success: 'تم تحديث العقد بنجاح',
            error: 'حدث خطأ أثناء تحديث العقد',
            loadError: 'حدث خطأ أثناء تحميل بيانات العقد',
            contractType: 'نوع العقد',
            realEstate: 'العقار',
            installmentsNumber: 'عدد الأقساط',
            calculateInstallments: 'حساب الأقساط',
            maintenance: 'صيانة',
            rental: 'إيجار',
            mustLoginRealestate: 'يجب تسجيل الدخول لعرض العقارات',
            failedFetchRealestate: 'فشل في جلب العقارات',
            failedFetchUnits: 'فشل في جلب الوحدات',
            enterContractAmount: 'يرجى إدخال قيمة العقد',
            enterInstallmentsNumber: 'يرجى إدخال عدد الأقساط',
            enterStartDate: 'يرجى إدخال تاريخ بداية العقد',
            enterEndDate: 'يرجى إدخال تاريخ نهاية العقد',
            errorCalculating: 'حدث خطأ في حساب الأقساط'
        },
        en: {
            title: 'Edit Contract',
            clientPhone: 'Phone Number',
            clientName: 'Client Name',
            clientIdNumber: 'ID Number',
            clientAddress: 'Client Address',
            governorate: 'Governorate',
            region: 'Region',
            block: 'Block',
            street: 'Street',
            building: 'Building',
            apartment: 'Apartment',
            contractDate: 'Contract Date',
            contractAmount: 'Contract Amount',
            contractStartDate: 'Contract Start Date',
            contractDuration: 'Contract Duration (Years)',
            contractEndDate: 'Contract End Date',
            units: 'Units',
            installments: 'Installments',
            date: 'Date',
            price: 'Amount',
            paymentType: 'Payment Type',
            reason: 'Reason',
            cash: 'Cash',
            check: 'Check',
            card: 'Card',
            updateContract: 'Update Contract',
            fillAllFields: 'Please fill all fields',
            success: 'Contract updated successfully',
            error: 'Error updating contract',
            loadError: 'Error loading contract data',
            contractType: 'Contract Type',
            realEstate: 'Real Estate',
            installmentsNumber: 'Installments Number',
            calculateInstallments: 'Calculate Installments',
            maintenance: 'Maintenance',
            rental: 'Rental',
            mustLoginRealestate: 'You must be logged in to view real estates',
            failedFetchRealestate: 'Failed to fetch real estates',
            failedFetchUnits: 'Failed to fetch units',
            enterContractAmount: 'Please enter the contract amount',
            enterInstallmentsNumber: 'Please enter the installments number',
            enterStartDate: 'Please enter the contract start date',
            enterEndDate: 'Please enter the contract end date',
            errorCalculating: 'Error calculating installments'
        }
    };

    const t = translations[lang] || translations.ar;
    const direction = lang === 'ar' ? 'rtl' : 'ltr';

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
                        clientAddress: contract.clientAddress || { Governorate: '', region: '', block: '', street: '', building: '', apartment: '' },
                        contractType: contract.contractType || '',
                        contractDate: new Date(contract.contractDate),
                        contractStartDate: new Date(contract.contractStartDate),
                        contractEndDate: new Date(contract.contractEndDate),
                        realestateId: contract.realestateId,
                        unitsId: contract.unitsId || [],
                        installmentsNumber: contract.installments?.length || 0,
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

    const fetchRealestates = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(t.mustLoginRealestate);
                return;
            }
            const response = await axios.get(`${process.env.API_URL}/realestates`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRealestates(response?.data?.realestates || []);
        } catch (error) {
            toast.error(t.failedFetchRealestate);
        }
    };

    useEffect(() => {
        fetchRealestates();
    }, []);

    const fetchUnits = async (realestateId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(t.mustLoginRealestate);
                return;
            }

            const response = await axios.get(`${process.env.API_URL}/realestate/details`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    realestateId
                }
            });

            if (!response?.data?.realestate?.units) {
                setUnits([]);
                return;
            }

            // Transform units data from the API response
            const unitsData = response.data.realestate.units.map((unit) => ({
                _id: unit._id,
                title: `${unit.unitType}${unit.floorNumber ? ` - Floor ${unit.floorNumber}` : ''}${unit.unitNumber ? ` - Unit ${unit.unitNumber}` : ''}`
            }));

            setUnits(unitsData);
        } catch (error) {
            toast.error(t.failedFetchUnits);
        }
    };

    useEffect(() => {
        if (form.realestateId) {
            fetchUnits(form.realestateId);
        } else {
            setUnits([]);
        }
    }, [form.realestateId]);

    // Update installment data
    const updateInstallment = (index, field, value) => {
        setForm((prev) => ({
            ...prev,
            installments: prev.installments.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        }));
    };

    const handleAddressChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({
            ...prev,
            clientAddress: {
                ...prev.clientAddress,
                [id]: value
            }
        }));
    };

    async function calculateInstallments() {
        // VALIDATE THE (AMOUNT && INSTALLMENTS NUMBER && START DATE && END DATE)
        if (!form.contractAmount) {
            toast.error(t.enterContractAmount);
            return;
        }
        if (!form.installmentsNumber) {
            toast.error(t.enterInstallmentsNumber);
            return;
        }
        if (!form.contractStartDate) {
            toast.error(t.enterStartDate);
            return;
        }
        if (!form.contractEndDate) {
            toast.error(t.enterEndDate);
            return;
        }

        // SEND THE REQUEST WITH THE DATA TO CALCULATE THINGS
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.API_URL}/calc/contract/payments`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    contractAmount: form.contractAmount,
                    installmentsNumber: form.installmentsNumber,
                    startDate: form.contractStartDate,
                    endDate: form.contractEndDate
                }
            });

            if (response.data?.paymentsData) {
                setForm((prev) => ({
                    ...prev,
                    installments: response.data.paymentsData
                }));
            }
        } catch (error) {
            console.error('Error calculating installments:', error);
            toast.error(t.errorCalculating);
        }
    }

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
                        <label className="font-bold">{t.clientAddress}</label>
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="Governorate">{t.governorate}</label>
                        <InputText id="Governorate" placeholder={t.governorate} value={form.clientAddress.Governorate} onChange={handleAddressChange} />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="region">{t.region}</label>
                        <InputText id="region" placeholder={t.region} value={form.clientAddress.region} onChange={handleAddressChange} />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="block">{t.block}</label>
                        <InputText id="block" placeholder={t.block} value={form.clientAddress.block} onChange={handleAddressChange} />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="street">{t.street}</label>
                        <InputText id="street" placeholder={t.street} value={form.clientAddress.street} onChange={handleAddressChange} />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="building">{t.building}</label>
                        <InputText id="building" placeholder={t.building} value={form.clientAddress.building} onChange={handleAddressChange} />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="apartment">{t.apartment}</label>
                        <InputText id="apartment" placeholder={t.apartment} value={form.clientAddress.apartment} onChange={handleAddressChange} />
                    </div>

                    {/* CONTRACT TYPE */}
                    <div className="field col-12">
                        <label htmlFor="contractType">{t.contractType}</label>
                        <Dropdown
                            id="contractType"
                            value={form.contractType}
                            options={[
                                { label: t.maintenance, value: 'صيانه' },
                                { label: t.rental, value: 'ايجار' }
                            ]}
                            onChange={(e) => setForm({ ...form, contractType: e.value })}
                            placeholder={t.contractType}
                        />
                    </div>

                    {/* REAL ESTATE */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="realestateId">{t.realEstate}</label>
                        <Dropdown id="realestateId" value={form.realestateId} options={realestates} optionLabel="title" optionValue="_id" onChange={(e) => setForm({ ...form, realestateId: e.value })} placeholder={t.realEstate} />
                    </div>

                    {/* UNITS */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="unitsId">{t.units}</label>
                        <MultiSelect
                            id="unitsId"
                            display="chip"
                            value={form.unitsId}
                            options={units}
                            optionLabel="title"
                            optionValue="_id"
                            onChange={(e) => setForm({ ...form, unitsId: e.value })}
                            placeholder={t.units}
                            disabled={!form.realestateId}
                        />
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

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractDuration">{t.contractDuration}</label>
                        <InputNumber id="contractDuration" min={0} showButtons value={form.contractDuration} onValueChange={(e) => setForm({ ...form, contractDuration: e.value })} placeholder={t.contractDuration} />
                    </div>

                    {/* INSTALLMENTS NUMBER */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="installmentsNumber">{t.installmentsNumber}</label>
                        <InputNumber
                            id="installmentsNumber"
                            min={0}
                            showButtons
                            placeholder={t.installmentsNumber}
                            value={form.installmentsNumber}
                            onValueChange={(e) => {
                                setForm({ ...form, installmentsNumber: e.value, installments: [] });
                            }}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractStartDate">{t.contractStartDate}</label>
                        <Calendar id="contractStartDate" showIcon value={form.contractStartDate} onChange={(e) => setForm({ ...form, contractStartDate: e.value })} dateFormat="dd-mm-yy" placeholder={t.contractStartDate} />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractEndDate">{t.contractEndDate}</label>
                        <Calendar id="contractEndDate" showIcon value={form.contractEndDate} onChange={(e) => setForm({ ...form, contractEndDate: e.value })} dateFormat="dd-mm-yy" placeholder={t.contractEndDate} />
                    </div>
                </div>
            </div>

            <div className="card">
                {/* Installments Section */}
                <div className="field col-12">
                    <div className="flex justify-content-between align-items-center mb-3">
                        <h2 className="text-xl font-bold">{t.installments}</h2>
                        {/* CALCULATE INSTALLMENTS */}
                        <Button type="button" icon="pi pi-calculator" label={t.calculateInstallments} size="small" severity="info" onClick={calculateInstallments} />
                    </div>

                    {form.installments.map((installment, index) => (
                        <div key={index} className="grid formgrid p-fluid mb-3">
                            <div className="field col-12 md:col-3">
                                <label htmlFor={`installmentDate-${index}`}>{t.date}</label>
                                <Calendar id={`installmentDate-${index}`} value={installment.date} onChange={(e) => updateInstallment(index, 'date', e.value)} dateFormat="dd-mm-yy" placeholder={t.date} />
                            </div>
                            <div className="field col-12 md:col-3">
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
