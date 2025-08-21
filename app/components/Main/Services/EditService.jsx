'use client';
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import CustomFileUpload from '../Layout/customFileUpload/customFileUpload';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function EditService({ serviceId, lang }) {
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
            title: 'تعديل الخدمة',
            serviceTitle: 'عنوان الخدمة',
            contractedService: 'خدمة متعاقد عليها',
            serviceCost: 'تكلفة الخدمة',
            files: 'الملفات',
            editService: 'تعديل الخدمة',
            fillAllFields: 'يرجى تعبئة جميع الحقول.',
            enterServiceCost: 'يرجى إدخال تكلفة الخدمة.',
            editSuccess: 'تم تعديل الخدمة بنجاح.',
            editError: 'حدث خطأ أثناء تعديل الخدمة.',
            fetchError: 'حدث خطأ أثناء جلب بيانات الخدمة.',
            uploadFiles: 'رفع الملفات',
            uploadFilesHint: 'قم بسحب وإفلات الملفات هنا أو انقر للتصفح'
        },
        en: {
            title: 'Edit Service',
            serviceTitle: 'Service Title',
            contractedService: 'Contracted Service',
            serviceCost: 'Service Cost',
            files: 'Files',
            editService: 'Edit Service',
            fillAllFields: 'Please fill all fields.',
            enterServiceCost: 'Please enter the service cost.',
            editSuccess: 'Service edited successfully.',
            editError: 'Error editing service.',
            fetchError: 'Error fetching service data.',
            uploadFiles: 'Upload Files',
            uploadFilesHint: 'Drag and drop files here or click to browse'
        }
    };

    const t = translations[lang] || translations.ar;
    const direction = lang === 'ar' ? 'rtl' : 'ltr';

    // GET THE SERVICE DATA FROM THE DATABASE
    function getService(id) {
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/service/details?serviceId=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                const service = res.data?.service;
                setForm({
                    serviceTitle: service?.serviceTitle,
                    contractedService: service?.contractedService,
                    serviceCost: service?.serviceCost,
                    files: service?.files || []
                });
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || t.fetchError);
            });
    }

    // HANDLERS
    function editService(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');

        if (form.serviceTitle === '') {
            toast.error(t.fillAllFields);
            return;
        }

        if (!form.contractedService && form.serviceCost === 0) {
            toast.error(t.enterServiceCost);
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('serviceId', serviceId);
        formData.append('serviceTitle', form.serviceTitle);
        formData.append('contractedService', form.contractedService);
        formData.append('serviceCost', form.serviceCost);
        form.files.forEach((file) => {
            formData.append('files', file);
        });

        axios
            .put(`${process.env.API_URL}/edit/service`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
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

    // EFFECT TO GET THE SERVICE DATA
    useEffect(() => {
        getService(serviceId);
    }, [serviceId]);

    return (
        <div className={'card mb-0'} dir={direction}>
            <h1 className={'text-2xl font-bold mb-4 uppercase'}>{t.title}</h1>
            <form className="grid formgrid p-fluid" onSubmit={editService}>
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

                <div className={`field col-12 mt-4 ${direction === 'rtl' ? 'ml-auto' : 'mr-auto'}`}>
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
                                t.editService
                            )
                        }
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}
