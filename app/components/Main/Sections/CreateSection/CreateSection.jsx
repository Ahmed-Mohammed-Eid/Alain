'use client';
import React, { useState } from 'react';
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function CreateSection({ lang }) {
    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        sectionTitle: '',
        files: []
    });

    // TRANSLATIONS
    const t = {
        title: lang === 'en' ? 'Add Section' : 'إضافة قسم',
        sectionName: lang === 'en' ? 'Section Name' : 'اسم القسم',
        sectionImage: lang === 'en' ? 'Section Image' : 'صورة القسم',
        createSection: lang === 'en' ? 'Create Section' : 'إنشاء القسم',
        fillFields: lang === 'en' ? 'Please fill all fields.' : 'من فضلك املأ جميع الحقول.',
        success: lang === 'en' ? 'Section created successfully.' : 'تم إنشاء القسم بنجاح.',
        error: lang === 'en' ? 'An error occurred.' : 'حدث خطأ ما.'
    };

    // HANDLERS
    function createSection(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE FORM
        if (!form.sectionTitle || !form.files || form.files.length < 1) {
            toast.error(t.fillFields);
            return;
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // APPEND THE TITLE
        formData.append('sectionTitle', form.sectionTitle);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append('files', form.files[i]);
        }

        // SEND THE REQUEST
        axios
            .post(`${process.env.API_URL}/create/section`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                toast.success(response.data?.message || t.success);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t.error);
                setLoading(false);
            });
    }

    return (
        <div className={'card mb-0'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <h1 className={'text-2xl font-bold mb-4 uppercase'}>{t.title}</h1>
            <form className="grid formgrid p-fluid" onSubmit={createSection}>
                <div className="field col-12">
                    <label htmlFor="sectionTitle">{t.sectionName}</label>
                    <InputText id="sectionTitle" type="text" placeholder={t.sectionName} value={form.sectionTitle} onChange={(e) => setForm({ ...form, sectionTitle: e.target.value })} />
                </div>
                <div className="col-12 mb-2 lg:mb-2">
                    <label className={'mb-2 block'} htmlFor="male-image">
                        {t.sectionImage}
                    </label>
                    <CustomFileUpload
                        setFiles={(files) => {
                            setForm({ ...form, files });
                        }}
                        removeThisItem={(index) => {
                            // ITEMS COPY
                            const items = [...(form?.files || [])];
                            // FILTER THE ITEMS
                            const newItems = items.filter((item, i) => {
                                return i !== index;
                            });
                            // SET THE STATE
                            setForm({ ...form, files: newItems });
                        }}
                    />
                </div>
                <div className={`field col-12 md:col-6 mt-4 ${lang === 'ar' ? 'mr-auto' : 'ml-auto'}`}>
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
                                t.createSection
                            )
                        }
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}
