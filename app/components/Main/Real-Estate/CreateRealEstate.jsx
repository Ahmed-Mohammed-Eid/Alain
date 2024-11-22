'use client';
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function CreateRealEstate({ lang }) {
    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        title: '',
        autoNumber: '',
        realestateNumber: '',
        address: '',
        appartments: 0,
        shops: 0
    });

    // TRANSLATIONS
    const translations = {
        ar: {
            title: 'إضافة عقار جديد',
            propertyName: 'اسم العقار',
            autoNumber: 'الرقم الآلي',
            propertyNumber: 'رقم العقار',
            address: 'العنوان',
            apartmentsCount: 'عدد الشقق',
            shopsCount: 'عدد المحلات',
            addProperty: 'إضافة العقار',
            fillAllFields: 'يرجى تعبئة جميع الحقول.',
            addSuccess: 'تم إضافة العقار بنجاح.',
            addError: 'حدث خطأ أثناء إضافة العقار.'
        },
        en: {
            title: 'Add New Property',
            propertyName: 'Property Name',
            autoNumber: 'Auto Number',
            propertyNumber: 'Property Number',
            address: 'Address',
            apartmentsCount: 'Apartments Count',
            shopsCount: 'Shops Count',
            addProperty: 'Add Property',
            fillAllFields: 'Please fill all fields.',
            addSuccess: 'Property added successfully.',
            addError: 'Error adding property.'
        }
    };

    const t = translations[lang] || translations.ar;
    const direction = lang === 'ar' ? 'rtl' : 'ltr';

    // HANDLERS
    function createRealEstate(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE FORM
        if (form.title === '' || form.autoNumber === '' || form.realestateNumber === '' || form.address === '' || form.appartments === 0 || form.shops === 0) {
            toast.error(t.fillAllFields);
            return;
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // SEND THE REQUEST
        axios
            .post(
                `${process.env.API_URL}/create/realestate`,
                {
                    title: form.title,
                    autoNumber: form.autoNumber,
                    realestateNumber: form.realestateNumber,
                    address: form.address,
                    appartments: form.appartments,
                    shops: form.shops
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                toast.success(response.data?.message || t.addSuccess);
                setLoading(false);
                // Reset form after successful submission
                setForm({
                    title: '',
                    autoNumber: '',
                    realestateNumber: '',
                    address: '',
                    appartments: 0,
                    shops: 0
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
            <form className="grid formgrid p-fluid" onSubmit={createRealEstate}>
                <div className="field col-12">
                    <label htmlFor="title">{t.propertyName}</label>
                    <InputText id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t.propertyName} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="autoNumber">{t.autoNumber}</label>
                    <InputText id="autoNumber" value={form.autoNumber} onChange={(e) => setForm({ ...form, autoNumber: e.target.value })} placeholder={t.autoNumber} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="realestateNumber">{t.propertyNumber}</label>
                    <InputText id="realestateNumber" value={form.realestateNumber} onChange={(e) => setForm({ ...form, realestateNumber: e.target.value })} placeholder={t.propertyNumber} />
                </div>
                <div className="field col-12">
                    <label htmlFor="address">{t.address}</label>
                    <InputText id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder={t.address} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="appartments">{t.apartmentsCount}</label>
                    <InputNumber id="appartments" value={form.appartments} onValueChange={(e) => setForm({ ...form, appartments: e.value })} placeholder={t.apartmentsCount} min={0} />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="shops">{t.shopsCount}</label>
                    <InputNumber id="shops" value={form.shops} onValueChange={(e) => setForm({ ...form, shops: e.value })} placeholder={t.shopsCount} min={0} />
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
                                t.addProperty
                            )
                        }
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
}
