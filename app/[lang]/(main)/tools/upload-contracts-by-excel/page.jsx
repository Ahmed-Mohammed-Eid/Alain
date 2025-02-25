'use client';

import React, { useState } from 'react';
import CustomFileUpload from '../../../../components/Main/Layout/customFileUpload/customFileUpload';
import { Button } from 'primereact/button';
import { toast } from 'react-hot-toast';

const translations = {
    en: {
        pleaseSelectFile: 'Please select a file',
        uploadSuccess: 'Contracts uploaded successfully',
        uploadError: 'Error uploading contracts',
        title: 'Upload Contracts By Excel',
        excelFile: 'Excel File',
        uploadFile: 'Upload File'
    },
    ar: {
        pleaseSelectFile: 'الرجاء اختيار ملف',
        uploadSuccess: 'تم رفع العقود بنجاح',
        uploadError: 'خطأ في رفع العقود',
        title: 'رفع العقود عبر ملف اكسل',
        excelFile: 'ملف اكسل',
        uploadFile: 'رفع الملف'
    }
};

export default function UploadContractsByExcel({ params: { lang } }) {
    const isRTL = lang === 'ar';

    const [files, setFiles] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!files) {
            toast.error(translations[lang].pleaseSelectFile);
            return;
        }

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('files', files[0]);

        try {
            const response = await fetch(`${process.env.API_URL}/upload/contracts/data`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            toast.success(translations[lang].uploadSuccess);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error(translations[lang].uploadError);
        }
    }

    return (
        <form onSubmit={handleSubmit} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={`card`}>
                <h1 className={'text-2xl mb-5 uppercase'}>{translations[lang].title}</h1>

                <div className={'p-fluid formgrid grid'}>
                    <div className={'field col-12'} dir={'ltr'}>
                        <label htmlFor="files">{translations[lang].excelFile}</label>
                        <CustomFileUpload
                            setFiles={(files) => {
                                setFiles(files);
                            }}
                            multiple={false}
                            accept=".xls,.xlsx"
                        />
                    </div>
                </div>
            </div>
            <div className={'flex justify-center mt-5'}>
                <Button
                    label={translations[lang].uploadFile}
                    icon="pi pi-plus"
                    style={{
                        width: '100%',
                        padding: '1rem'
                    }}
                />
            </div>
        </form>
    );
}
