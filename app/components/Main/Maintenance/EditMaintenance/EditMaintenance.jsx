'use client';
import React, { useState, useEffect } from 'react';
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { textToTime, timeToText } from '../../../../../helpers/textToTime';

export default function EditMaintenances({ maintenancesId, lang }) {
    // RTL Check
    const isRTL = lang === 'ar';

    // Translations
    const t = {
        en: {
            title: 'Edit Visit',
            clientName: 'Client Name',
            phoneNumber: 'Phone Number',
            governorate: 'Governorate',
            region: 'Region',
            block: 'Block',
            street: 'Street',
            alley: 'Alley',
            building: 'Building',
            floor: 'Floor',
            apartment: 'Apartment',
            visitDate: 'Visit Date',
            visitTime: 'Visit Time',
            description: 'Description',
            files: 'Files',
            edit: 'Edit Visit',
            fillAllFields: 'Please fill in all fields.',
            editSuccess: 'Visit edited successfully.',
            editError: 'An error occurred while editing the visit.',
            fetchError: 'An error occurred while fetching visit data.'
        },
        ar: {
            title: 'تعديل الزيارة',
            clientName: 'اسم العميل',
            phoneNumber: 'رقم العميل',
            governorate: 'المحافظة',
            region: 'المنطقة',
            block: 'القطعة',
            street: 'الشارع',
            alley: 'الزقاق',
            building: 'البناء',
            floor: 'الطابق',
            apartment: 'الشقة',
            visitDate: 'تاريخ الزيارة',
            visitTime: 'وقت الزيارة',
            description: 'الوصف',
            files: 'الملفات',
            edit: 'تعديل الزيارة',
            fillAllFields: 'يرجى تعبئة جميع الحقول.',
            editSuccess: 'تم تعديل الزيارة بنجاح.',
            editError: 'حدث خطأ أثناء تعديل الزيارة.',
            fetchError: 'حدث خطأ أثناء جلب بيانات الزيارة.'
        }
    }[lang];

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        clientName: '',
        phoneNumber: '',
        governorate: '',
        region: '',
        block: '',
        street: '',
        alley: '',
        building: '',
        floor: '',
        appartment: '',
        visitDate: '',
        visitTime: '',
        description: '',
        files: [],
        agentId: '',
        visitId: ''
    });

    // HANDLERS
    function editMaintenances(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');

        if (
            form.clientName === '' ||
            form.phoneNumber === '' ||
            form.governorate === '' ||
            form.region === '' ||
            form.block === '' ||
            form.street === '' ||
            form.alley === '' ||
            form.building === '' ||
            form.floor === '' ||
            form.appartment === '' ||
            form.visitDate === '' ||
            form.visitTime === '' ||
            form.description === ''
        ) {
            toast.error(t.fillAllFields);
            return;
        }

        setLoading(true);

        const formData = new FormData();

        formData.append('visitId', maintenancesId);
        formData.append('clientName', form.clientName);
        formData.append('phoneNumber', form.phoneNumber);
        formData.append('governorate', form.governorate);
        formData.append('region', form.region);
        formData.append('block', form.block);
        formData.append('street', form.street);
        formData.append('alley', form.alley);
        formData.append('building', form.building);
        formData.append('floor', form.floor);
        formData.append('appartment', form.appartment);
        formData.append('visitDate', form.visitDate);
        formData.append('visitTime', timeToText(form.visitTime));
        formData.append('description', form.description);
        formData.append('agentId', '');

        if (form?.files?.length > 0) {
            for (let i = 0; i < form.files.length; i++) {
                formData.append('files', form.files[i]);
            }
        }

        axios
            .put(`${process.env.API_URL}/edit/maintenance`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                toast.success(response.data?.message || t.editSuccess);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t.editError);
                setLoading(false);
            });
    }

    function getMaintenance(id) {
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/admin/maintenance?maintenanceId=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                const maintenances = res.data?.maintenance;

                setForm({
                    clientName: maintenances?.clientName,
                    phoneNumber: maintenances?.phoneNumber,
                    governorate: maintenances?.governorate,
                    region: maintenances?.region,
                    block: maintenances?.block,
                    street: maintenances?.street,
                    alley: maintenances?.alley,
                    building: maintenances?.building,
                    floor: maintenances?.floor,
                    appartment: maintenances?.appartment,
                    visitDate: new Date(maintenances?.visitDate),
                    visitTime: textToTime(maintenances?.visitTime),
                    description: maintenances?.description,
                    agentId: maintenances?.agentId
                });
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || t.fetchError);
            });
    }

    useEffect(() => {
        getMaintenance(maintenancesId);
    }, [maintenancesId]);

    return (
        <div className={'card mb-0'} dir={isRTL ? 'rtl' : 'ltr'}>
            <h1 className={'text-2xl font-bold mb-4 uppercase'}>{t.title}</h1>
            <form className="grid formgrid p-fluid" onSubmit={editMaintenances}>
                <div className="field col-12">
                    <label htmlFor="assessmentsTitle">{t.clientName}</label>
                    <InputText id="assessmentsTitle" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder={t.clientName} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="assessmentsType">{t.phoneNumber}</label>
                    <InputText id="assessmentsType" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder={t.phoneNumber} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">{t.governorate}</label>
                    <InputText id={'sectionId'} value={form.governorate} onChange={(e) => setForm({ ...form, governorate: e.value })} placeholder={t.governorate} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">{t.region}</label>
                    <InputText id="sectionId" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder={t.region} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">{t.block}</label>
                    <InputText id="sectionId" value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} placeholder={t.block} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">{t.street}</label>
                    <InputText id="sectionId" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder={t.street} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">{t.alley}</label>
                    <InputText id="sectionId" value={form.alley} onChange={(e) => setForm({ ...form, alley: e.target.value })} placeholder={t.alley} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">{t.building}</label>
                    <InputText id="sectionId" value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} placeholder={t.building} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">{t.floor}</label>
                    <InputText id="sectionId" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder={t.floor} />
                </div>
                <div className="field col-12">
                    <label htmlFor="sectionId">{t.apartment}</label>
                    <InputText id="sectionId" value={form.appartment} onChange={(e) => setForm({ ...form, appartment: e.target.value })} placeholder={t.apartment} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">{t.visitDate}</label>
                    <Calendar id="sectionId" value={form.visitDate} onChange={(e) => setForm({ ...form, visitDate: e.target.value })} placeholder={t.visitDate} dateFormat={'dd/mm/yy'} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">{t.visitTime}</label>
                    <Calendar
                        id="sectionId"
                        value={form.visitTime}
                        onChange={(e) => {
                            setForm({ ...form, visitTime: e.target.value });
                        }}
                        timeOnly
                        hourFormat={'12'}
                        placeholder={t.visitTime}
                    />
                </div>
                <div className="field col-12">
                    <label htmlFor="description">{t.description}</label>
                    <InputTextarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t.description} />
                </div>
                <div className="field col-12">
                    <label htmlFor="files">{t.files}</label>
                    <CustomFileUpload id={'files'} files={form.files} multiple setFiles={(files) => setForm({ ...form, files: files })} />
                </div>

                <div className="field col-12 md:col-6 mt-4 ml-auto">
                    <Button
                        type={'submit'}
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
                                t.edit
                            )
                        }
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}
