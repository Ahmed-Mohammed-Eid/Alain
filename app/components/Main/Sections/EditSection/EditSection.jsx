'use client';
import React, { useState, useEffect } from 'react';
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function EditSection({ sectionId, lang }) {
    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        sectionTitle: '',
        files: []
    });

    // TRANSLATIONS
    const t = {
        title: lang === 'en' ? 'Edit Section' : 'تعديل القسم',
        sectionName: lang === 'en' ? 'Section Name' : 'اسم القسم',
        sectionImage: lang === 'en' ? 'Section Image' : 'صورة القسم',
        editSection: lang === 'en' ? 'Edit Section' : 'تعديل القسم',
        fillFields: lang === 'en' ? 'Please enter section title.' : 'من فضلك أدخل عنوان القسم.',
        success: lang === 'en' ? 'Section edited successfully.' : 'تم تعديل القسم بنجاح.',
        error: lang === 'en' ? 'An error occurred.' : 'حدث خطأ ما.',
        getSectionError: lang === 'en' ? 'An error occurred while getting the section.' : 'حدث خطأ أثناء جلب القسم.'
    };

    function getSection(id) {
        // GET THE TOKEN FROM THE COOKIES
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/section?sectionId=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                const section = res.data.section;
                setForm({
                    sectionTitle: section.title,
                    files: []
                });
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t.getSectionError);
            });
    }

    // EFFECT TO SET THE FORM VALUES
    useEffect(() => {
        getSection(sectionId);
    }, [sectionId]);

    // HANDLERS
    function editSection(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE FORM
        if (!form.sectionTitle) {
            toast.error(t.fillFields);
            return;
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // APPEND THE TITLE
        formData.append('sectionTitle', form.sectionTitle);
        formData.append('sectionId', sectionId);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append('files', form.files[i]);
        }

        // SEND THE REQUEST
        axios
            .put(`${process.env.API_URL}/edit/section`, formData, {
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
            <form className="grid formgrid p-fluid" onSubmit={editSection}>
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
                                t.editSection
                            )
                        }
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}
