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

// REACT HOOK FORM
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editContractSchema } from './schema/edit-form-schema';
export default function ContractsEditForm({ lang, contractId }) {
    const { id } = useParams();

    // LOADING STATES
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [realestates, setRealestates] = useState([]);
    const [units, setUnits] = useState([]);

    // REACT HOOK FORM
    const schema = editContractSchema(lang);
    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
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
        }
    });

    // WATCH FORM VALUES
    const watchedRealestateId = watch('realestateId');
    const watchedInstallments = watch('installments', []);
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
                    // Convert date strings to Date objects and set form values
                    reset({
                        ...contract,
                        clientPhone: contract.clientPhone,
                        clientName: contract.clientName,
                        clientIdNumber: contract.clientIdNumber,
                        clientAddress: typeof contract.clientAddress === 'string' ? { Governorate: '', region: '', block: '', street: '', building: '', apartment: '' } : contract.clientAddress || {},
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
    }, [id, reset]);
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

            const unitsData = [];

            response.data.realestate.units.forEach((unit) => {
                if (unit?.unitStatus === 'vacant') {
                    unitsData.push({
                        _id: unit._id,
                        title: `${unit.unitType}${unit.floorNumber ? ` - Floor ${unit.floorNumber}` : ''}${unit.unitNumber ? ` - Unit ${unit.unitNumber}` : ''}`
                    });
                }
            });

            setUnits(unitsData);
        } catch (error) {
            toast.error(t.failedFetchUnits);
        }
    };
    useEffect(() => {
        if (watchedRealestateId) {
            fetchUnits(watchedRealestateId);
        } else {
            setUnits([]);
        }
    }, [watchedRealestateId]);
    // Update installment data
    const updateInstallment = (index, field, value) => {
        const currentInstallments = watchedInstallments || [];
        const newInstallments = currentInstallments.map((item, i) => (i === index ? { ...item, [field]: value } : item));
        setValue('installments', newInstallments);
    };
    const handleAddressChange = (e) => {
        const { id, value } = e.target;
        const currentAddress = watch('clientAddress') || {};
        setValue('clientAddress', {
            ...currentAddress,
            [id]: value
        });
    };

    const calculateInstallments = async () => {
        // Get current form values
        const contractAmount = watch('contractAmount');
        const installmentsNumber = watch('installmentsNumber');
        const contractStartDate = watch('contractStartDate');
        const contractEndDate = watch('contractEndDate');

        // VALIDATE THE (AMOUNT && INSTALLMENTS NUMBER && START DATE && END DATE)
        if (!contractAmount) {
            toast.error(t.enterContractAmount);
            return;
        }
        if (!installmentsNumber) {
            toast.error(t.enterInstallmentsNumber);
            return;
        }
        if (!contractStartDate) {
            toast.error(t.enterStartDate);
            return;
        }
        if (!contractEndDate) {
            toast.error(t.enterEndDate);
            return;
        }

        // SEND THE REQUEST WITH THE DATA TO CALCULATE THINGS
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.API_URL}/calc/contract/payments`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    contractAmount: contractAmount,
                    installmentsNumber: installmentsNumber,
                    startDate: contractStartDate,
                    endDate: contractEndDate
                }
            });

            if (response.data?.paymentsData) {
                setValue('installments', response.data.paymentsData);
            }
        } catch (error) {
            console.error('Error calculating installments:', error);
            toast.error(t.errorCalculating);
        }
    };

    // GET THE REAL ESTATE NAME
    const realestateId = watch('realestateId');
    const selectedRealestate = realestates.find((item) => item._id === realestateId);
    const realestateName = selectedRealestate ? selectedRealestate.title : '';
    const unitsId = watch('unitsId'); // = [];
    const selectedUnits = units.filter((unit) => unitsId.includes(unit._id));
    const unitsTitlesArray = selectedUnits.map((unit) => unit.title);

    // Handle form submission
    const onSubmit = async (data) => {
        setLoading(true);

        const dataToSend = {
            ...data,
            realestateTitle: realestateName,
            unitsDetails: unitsTitlesArray
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.API_URL}/edit/contract`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(t.success);
        } catch (error) {
            toast.error(t.error);
        } finally {
            setLoading(false);
        }
    };

    const onError = (errors) => {
        console.log('Form validation errors:', errors);
        toast.error(t.fillAllFields);
    };
    if (initialLoading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <form className="mb-0" dir={direction} onSubmit={handleFormSubmit(onSubmit, onError)}>
            <div className="card">
                <h1 className="text-2xl font-bold mb-4 uppercase">{t.title}</h1>
                <div className="grid formgrid p-fluid">
                    {/* Client Information */}
                    <div className="field col-12">
                        <label htmlFor="clientPhone">{t.clientPhone}</label>
                        <Controller name="clientPhone" control={control} render={({ field }) => <InputText id="clientPhone" placeholder={t.clientPhone} {...field} className={errors.clientPhone ? 'p-invalid' : ''} />} />
                        {errors.clientPhone && <small className="p-error">{errors.clientPhone.message}</small>}
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="clientName">{t.clientName}</label>
                        <Controller name="clientName" control={control} render={({ field }) => <InputText id="clientName" placeholder={t.clientName} {...field} className={errors.clientName ? 'p-invalid' : ''} />} />
                        {errors.clientName && <small className="p-error">{errors.clientName.message}</small>}
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="clientIdNumber">{t.clientIdNumber}</label>
                        <Controller name="clientIdNumber" control={control} render={({ field }) => <InputText id="clientIdNumber" placeholder={t.clientIdNumber} {...field} className={errors.clientIdNumber ? 'p-invalid' : ''} />} />
                        {errors.clientIdNumber && <small className="p-error">{errors.clientIdNumber.message}</small>}
                    </div>

                    <div className="field col-12">
                        <label className="font-bold">{t.clientAddress}</label>
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="Governorate">{t.governorate}</label>
                        <Controller
                            name="clientAddress.Governorate"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="Governorate"
                                    placeholder={t.governorate}
                                    {...field}
                                    className={errors.clientAddress?.Governorate ? 'p-invalid' : ''}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleAddressChange(e);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="region">{t.region}</label>
                        <Controller
                            name="clientAddress.region"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="region"
                                    placeholder={t.region}
                                    {...field}
                                    className={errors.clientAddress?.region ? 'p-invalid' : ''}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleAddressChange(e);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="block">{t.block}</label>
                        <Controller
                            name="clientAddress.block"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="block"
                                    placeholder={t.block}
                                    {...field}
                                    className={errors.clientAddress?.block ? 'p-invalid' : ''}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleAddressChange(e);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="street">{t.street}</label>
                        <Controller
                            name="clientAddress.street"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="street"
                                    placeholder={t.street}
                                    {...field}
                                    className={errors.clientAddress?.street ? 'p-invalid' : ''}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleAddressChange(e);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="building">{t.building}</label>
                        <Controller
                            name="clientAddress.building"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="building"
                                    placeholder={t.building}
                                    {...field}
                                    className={errors.clientAddress?.building ? 'p-invalid' : ''}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleAddressChange(e);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="apartment">{t.apartment}</label>
                        <Controller
                            name="clientAddress.apartment"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="apartment"
                                    placeholder={t.apartment}
                                    {...field}
                                    className={errors.clientAddress?.apartment ? 'p-invalid' : ''}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleAddressChange(e);
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* CONTRACT TYPE */}
                    <div className="field col-12">
                        <label htmlFor="contractType">{t.contractType}</label>
                        <Controller
                            name="contractType"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    id="contractType"
                                    {...field}
                                    options={[
                                        { label: t.maintenance, value: 'صيانه' },
                                        { label: t.rental, value: 'ايجار' }
                                    ]}
                                    placeholder={t.contractType}
                                    className={errors.contractType ? 'p-invalid' : ''}
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                        {errors.contractType && <small className="p-error">{errors.contractType.message}</small>}
                    </div>

                    {/* REAL ESTATE */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="realestateId">{t.realEstate}</label>
                        <Controller
                            name="realestateId"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    id="realestateId"
                                    {...field}
                                    options={realestates}
                                    optionLabel="title"
                                    optionValue="_id"
                                    placeholder={t.realEstate}
                                    className={errors.realestateId ? 'p-invalid' : ''}
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                        {errors.realestateId && <small className="p-error">{errors.realestateId.message}</small>}
                    </div>

                    {/* UNITS */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="unitsId">{t.units}</label>
                        <Controller
                            name="unitsId"
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    id="unitsId"
                                    display="chip"
                                    {...field}
                                    options={units}
                                    optionLabel="title"
                                    optionValue="_id"
                                    placeholder={t.units}
                                    className={errors.unitsId ? 'p-invalid' : ''}
                                    disabled={!watchedRealestateId}
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                        {errors.unitsId && <small className="p-error">{errors.unitsId.message}</small>}
                    </div>

                    {/* Contract Details */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractDate">{t.contractDate}</label>
                        <Controller
                            name="contractDate"
                            control={control}
                            render={({ field }) => <Calendar id="contractDate" placeholder={t.contractDate} {...field} className={errors.contractDate ? 'p-invalid' : ''} dateFormat="dd-mm-yy" onChange={(e) => field.onChange(e.value)} />}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractAmount">{t.contractAmount}</label>
                        <Controller
                            name="contractAmount"
                            control={control}
                            render={({ field }) => <InputNumber id="contractAmount" placeholder={t.contractAmount} {...field} className={errors.contractAmount ? 'p-invalid' : ''} onChange={(e) => field.onChange(e.value)} />}
                        />
                        {errors.contractAmount && <small className="p-error">{errors.contractAmount.message}</small>}
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractDuration">{t.contractDuration}</label>
                        <Controller
                            name="contractDuration"
                            control={control}
                            render={({ field }) => <InputNumber id="contractDuration" min={0} showButtons placeholder={t.contractDuration} {...field} className={errors.contractDuration ? 'p-invalid' : ''} onChange={(e) => field.onChange(e.value)} />}
                        />
                    </div>

                    {/* INSTALLMENTS NUMBER */}
                    <div className="field col-12 md:col-6">
                        <label htmlFor="installmentsNumber">{t.installmentsNumber}</label>
                        <Controller
                            name="installmentsNumber"
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    id="installmentsNumber"
                                    min={0}
                                    showButtons
                                    placeholder={t.installmentsNumber}
                                    {...field}
                                    className={errors.installmentsNumber ? 'p-invalid' : ''}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                        // Clear installments when number changes
                                        setValue('installments', []);
                                    }}
                                />
                            )}
                        />
                        {errors.installmentsNumber && <small className="p-error">{errors.installmentsNumber.message}</small>}
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractStartDate">{t.contractStartDate}</label>
                        <Controller
                            name="contractStartDate"
                            control={control}
                            render={({ field }) => (
                                <Calendar id="contractStartDate" showIcon placeholder={t.contractStartDate} {...field} className={errors.contractStartDate ? 'p-invalid' : ''} dateFormat="dd-mm-yy" onChange={(e) => field.onChange(e.value)} />
                            )}
                        />
                        {errors.contractStartDate && <small className="p-error">{errors.contractStartDate.message}</small>}
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="contractEndDate">{t.contractEndDate}</label>
                        <Controller
                            name="contractEndDate"
                            control={control}
                            render={({ field }) => (
                                <Calendar id="contractEndDate" showIcon placeholder={t.contractEndDate} {...field} className={errors.contractEndDate ? 'p-invalid' : ''} dateFormat="dd-mm-yy" onChange={(e) => field.onChange(e.value)} />
                            )}
                        />
                        {errors.contractEndDate && <small className="p-error">{errors.contractEndDate.message}</small>}
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

                    {watchedInstallments.map((installment, index) => (
                        <div key={index} className="grid formgrid p-fluid mb-3">
                            <div className="field col-12 md:col-3">
                                <label htmlFor={`installmentDate-${index}`}>{t.date}</label>
                                <Controller
                                    name={`installments.${index}.date`}
                                    control={control}
                                    render={({ field }) => (
                                        <Calendar
                                            id={`installmentDate-${index}`}
                                            {...field}
                                            value={field.value ? new Date(field.value) : null}
                                            dateFormat="dd-mm-yy"
                                            placeholder={t.date}
                                            className={errors.installments?.[index]?.date ? 'p-invalid' : ''}
                                            onChange={(e) => field.onChange(e.value)}
                                        />
                                    )}
                                />
                                {errors.installments?.[index]?.date && <small className="p-error">{errors.installments[index].date.message}</small>}
                            </div>
                            <div className="field col-12 md:col-3">
                                <label htmlFor={`installmentPrice-${index}`}>{t.price}</label>
                                <Controller
                                    name={`installments.${index}.price`}
                                    control={control}
                                    render={({ field }) => <InputNumber id={`installmentPrice-${index}`} {...field} placeholder={t.price} className={errors.installments?.[index]?.price ? 'p-invalid' : ''} onChange={(e) => field.onChange(e.value)} />}
                                />
                                {errors.installments?.[index]?.price && <small className="p-error">{errors.installments[index].price.message}</small>}
                            </div>
                            <div className="field col-12 md:col-3">
                                <label htmlFor={`installmentReason-${index}`}>{t.reason}</label>
                                <Controller
                                    name={`installments.${index}.reason`}
                                    control={control}
                                    render={({ field }) => <InputText id={`installmentReason-${index}`} {...field} placeholder={t.reason} className={errors.installments?.[index]?.reason ? 'p-invalid' : ''} />}
                                />
                            </div>
                            <div className="field col-12 md:col-3">
                                <label htmlFor={`installmentPaymentType-${index}`}>{t.paymentType}</label>
                                <Controller
                                    name={`installments.${index}.paymentType`}
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown
                                            id={`installmentPaymentType-${index}`}
                                            {...field}
                                            options={[
                                                { label: t.card, value: 'card' },
                                                { label: t.cash, value: 'cash' },
                                                { label: t.check, value: 'check' }
                                            ]}
                                            placeholder={t.paymentType}
                                            className={errors.installments?.[index]?.paymentType ? 'p-invalid' : ''}
                                            onChange={(e) => field.onChange(e.value)}
                                        />
                                    )}
                                />
                                {errors.installments?.[index]?.paymentType && <small className="p-error">{errors.installments[index].paymentType.message}</small>}
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
