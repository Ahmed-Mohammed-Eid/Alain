'use client';
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import CustomFileUpload from '../Layout/customFileUpload/customFileUpload';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function CreateService({ lang }) {
    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        serviceTitle: '',
        contractedService: false,
        serviceCost: 0,
        files: []
    });

    // TRANSLATIONS
    const translations = {
        ar: {
            title: 'إضافة خدمة جديدة',
            serviceTitle: 'عنوان الخدمة',
            contractedService: 'خدمة متعاقد عليها',
            serviceCost: 'تكلفة الخدمة',
            files: 'الملفات',
            addService: 'إضافة الخدمة',
            fillAllFields: 'يرجى تعبئة جميع الحقول.',
            addSuccess: 'تم إضافة الخدمة بنجاح.',
            addError: 'حدث خطأ أثناء إضافة الخدمة.',
            uploadFiles: 'رفع الملفات',
            uploadFilesHint: 'قم بسحب وإفلات الملفات هنا أو انقر للتصفح'
        },
        en: {
            title: 'Add New Service',
            serviceTitle: 'Service Title',
            contractedService: 'Contracted Service',
            serviceCost: 'Service Cost',
            files: 'Files',
            addService: 'Add Service',
            fillAllFields: 'Please fill all fields.',
            addSuccess: 'Service added successfully.',
            addError: 'Error adding service.',
            uploadFiles: 'Upload Files',
            uploadFilesHint: 'Drag and drop files here or click to browse'
        }
    };

    const t = translations[lang] || translations.ar;
    const direction = lang === 'ar' ? 'rtl' : 'ltr';

    // HANDLERS
    function createService(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');

        if (form.serviceTitle === '' || form.serviceCost === 0) {
            toast.error(t.fillAllFields);
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('serviceTitle', form.serviceTitle);
        formData.append('contractedService', form.contractedService);
        formData.append('serviceCost', form.serviceCost);
        form.files.forEach((file) => {
            formData.append('files', file);
        });

        axios
            .post(`${process.env.API_URL}/create/service`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                toast.success(response.data?.message || t.addSuccess);
                setLoading(false);
                setForm({
                    serviceTitle: '',
                    contractedService: false,
                    serviceCost: 0,
                    files: []
                });
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t.addError);
                setLoading(false);
            });
    }

    return (
        <div className={'card mb-0'} dir={direction}>
            <h1 className={'text-2xl font-bold mb-4 uppercase'}>{t.title}</h1>
            <form className="grid formgrid p-fluid" onSubmit={createService}>
                <div className="field col-12">
                    <label htmlFor="serviceTitle">{t.serviceTitle}</label>
                    <InputText id="serviceTitle" value={form.serviceTitle} onChange={(e) => setForm({ ...form, serviceTitle: e.target.value })} placeholder={t.serviceTitle} />
                </div>

                <div className="field col-12">
                    <div className="flex align-items-center">
                        <Checkbox inputId="contractedService" checked={form.contractedService} onChange={(e) => setForm({ ...form, contractedService: e.checked })} />
                        <label htmlFor="contractedService" className="ml-2">
                            {t.contractedService}
                        </label>
                    </div>
                </div>

                <div className="field col-12">
                    <label htmlFor="serviceCost">{t.serviceCost}</label>
                    <InputNumber id="serviceCost" value={form.serviceCost} onValueChange={(e) => setForm({ ...form, serviceCost: e.value })} mode="currency" currency="KWD" locale={lang === 'ar' ? 'ar-EG' : 'en-US'} />
                </div>

                <div className="field col-12">
                    <label htmlFor="files">{t.files}</label>
                    <CustomFileUpload id={'files'} files={form.files} multiple setFiles={(files) => setForm({ ...form, files: files })} removeThisItem={(file) => setForm({ ...form, files: form.files.filter((f) => f.name !== file.name) })} />
                </div>

                <div className={`field col-12 md:col-6 mt-4 ${direction === 'rtl' ? 'ml-auto' : 'mr-auto'}`}>
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
                                t.addService
                            )
                        }
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}
