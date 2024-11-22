'use client';
import React, { useState, useEffect } from 'react';
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';

export default function EditMedia({ mediaId, lang }) {
    // LOADING STATE
    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState([]);

    // STATE
    const [form, setForm] = useState({
        mediaTitle: '',
        mediaType: '',
        files: [],
        sectionId: ''
    });

    // TRANSLATIONS
    const translations = {
        en: {
            editFile: 'Edit File',
            fileName: 'File Name',
            fileNamePlaceholder: 'Enter file name',
            fileType: 'File Type',
            fileTypePlaceholder: 'Choose file type',
            section: 'Section',
            sectionPlaceholder: 'Choose section',
            file: 'File',
            editMedia: 'Edit Media',
            video: 'Video',
            image: 'Image',
            document: 'Document',
            pleaseEnterName: 'Please enter the name.',
            fileEditedSuccess: 'File edited successfully.',
            errorEditingFile: 'An error occurred while editing the file.',
            errorFetchingSections: 'An error occurred while fetching sections.',
            errorFetchingFile: 'An error occurred while fetching file data.'
        },
        ar: {
            editFile: 'تعديل الملف',
            fileName: 'اسم الملف',
            fileNamePlaceholder: 'اسم الملف',
            fileType: 'نوع الملف',
            fileTypePlaceholder: 'اختر نوع الملف',
            section: 'القسم',
            sectionPlaceholder: 'اختر القسم',
            file: 'الملف',
            editMedia: 'تعديل الملف',
            video: 'فيديو',
            image: 'صورة',
            document: 'ملف',
            pleaseEnterName: 'من فضلك قم بتعبئة الاسم.',
            fileEditedSuccess: 'تم تعديل الملف بنجاح.',
            errorEditingFile: 'حدث خطأ أثناء تعديل الملف.',
            errorFetchingSections: 'حدث خطأ أثناء جلب الأقسام.',
            errorFetchingFile: 'حدث خطأ أثناء جلب بيانات الملف.'
        }
    };

    const t = translations[lang];
    const isRTL = lang === 'ar';

    // HANDLERS
    function editMedia(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE FORM
        if (!form.mediaTitle) {
            toast.error(t.pleaseEnterName);
            return;
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);

        // APPEND THE TITLE
        formData.append('title', form.mediaTitle);
        formData.append('sectionId', form.sectionId);
        formData.append('mediaType', form.mediaType);
        formData.append('mediaId', mediaId);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append('files', form.files[i]);
        }

        // SEND THE REQUEST
        axios
            .put(`${process.env.API_URL}/edit/media`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                toast.success(response.data?.message || t.fileEditedSuccess);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t.errorEditingFile);
                setLoading(false);
            });
    }

    // GET SECTIONS HANDLER
    function getSections() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/sections`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                // LOOP THROUGH THE SECTIONS AND CREATE A NEW ARRAY WITH THE LABEL FROM TITLE AND THE VALUE FROM _ID
                const sectionsList = response.data?.sections?.map((section) => {
                    return {
                        label: section.title,
                        value: section._id
                    };
                });
                setSections(sectionsList || []);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t.errorFetchingSections);
            });
    }

    // GET THE MEDIA FROM THE DATABASE
    function getMedia(id) {
        // GET THE TOKEN FROM THE COOKIES
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/get/media?mediaId=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                const media = res.data?.media;
                setForm({
                    mediaTitle: media.title,
                    mediaType: media.mediaType,
                    files: [],
                    sectionId: media.sectionId
                });
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || t.errorFetchingFile);
            });
    }

    // EFFECT TO GET THE SECTIONS
    useEffect(() => {
        getSections();
        getMedia(mediaId);
    }, [mediaId]);

    return (
        <div className={'card mb-0'} dir={isRTL ? 'rtl' : 'ltr'}>
            <h1 className={'text-2xl font-bold mb-4 uppercase'}>{t.editFile}</h1>
            <form className="grid formgrid p-fluid" onSubmit={editMedia}>
                <div className="field col-12">
                    <label htmlFor="mediaTitle">{t.fileName}</label>
                    <InputText id="mediaTitle" type="text" placeholder={t.fileNamePlaceholder} value={form.mediaTitle} autoComplete={'off'} onChange={(e) => setForm({ ...form, mediaTitle: e.target.value })} />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="mediaType">{t.fileType}</label>
                    <Dropdown
                        id="mediaType"
                        placeholder={t.fileTypePlaceholder}
                        value={form.mediaType}
                        onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                        options={[
                            { label: t.video, value: 'video' },
                            { label: t.image, value: 'image' },
                            { label: t.document, value: 'document' }
                        ]}
                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">{t.section}</label>
                    <Dropdown id="sectionId" placeholder={t.sectionPlaceholder} value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} options={sections || []} />
                </div>

                <div className="col-12 mb-2 lg:mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
                    <label className={'mb-2 block'} htmlFor="male-image">
                        {t.file}
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
                                t.editMedia
                            )
                        }
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}
