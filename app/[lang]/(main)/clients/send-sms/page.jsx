'use client';
import React, { useState, useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const translations = {
    en: {
        selectRealEstate: 'Select Real Estate',
        message: 'Message',
        enterMessage: 'Enter your message',
        sendSMS: 'Send SMS',
        fillFields: 'Please fill all required fields',
        mustLoginRealestate: 'You need to login to view real estates',
        mustLoginSendSMS: 'You need to login to send SMS',
        smsSent: 'SMS sent successfully',
        failedFetchRealestate: 'Failed to fetch real estates',
        failedSendSMS: 'Failed to send SMS'
    },
    ar: {
        selectRealEstate: 'اختر العقار',
        message: 'الرسالة',
        enterMessage: 'أدخل رسالتك',
        sendSMS: 'أرسل الرسالة',
        fillFields: 'يرجى ملء جميع الحقول المطلوبة',
        mustLoginRealestate: 'يجب تسجيل الدخول لعرض العقارات',
        mustLoginSendSMS: 'يجب تسجيل الدخول لإرسال الرسالة',
        smsSent: 'تم إرسال الرسالة بنجاح',
        failedFetchRealestate: 'فشل في استرجاع العقارات',
        failedSendSMS: 'فشل في إرسال الرسالة'
    }
};

function SendSmsPage({ params }) {
    const lang = params?.lang || 'en';
    const isRTL = lang === 'ar';
    const trans = translations[lang];

    const [formData, setFormData] = useState({
        realestateId: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [realestates, setRealestates] = useState([]);
    const [loadingRealestates, setLoadingRealestates] = useState(false);

    useEffect(() => {
        fetchRealestates();
    }, []);

    const fetchRealestates = async () => {
        setLoadingRealestates(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(trans.mustLoginRealestate);
                return;
            }
            const response = await axios.get(`${process.env.API_URL}/realestates`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRealestates(response?.data?.realestates || []);
        } catch (error) {
            toast.error(trans.failedFetchRealestate);
        } finally {
            setLoadingRealestates(false);
        }
    };

    const handleInputChange = (e, isDropdown = false) => {
        const name = isDropdown ? 'realestateId' : e.target.name;
        const value = isDropdown ? e.value : e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const isFormValid = () => {
        return formData.realestateId.trim() !== '' && formData.message.trim() !== '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            toast.error(trans.fillFields);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(trans.mustLoginSendSMS);
                return;
            }
            const response = await axios.post(`${process.env.API_URL}/send/realestate/sms`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success(trans.smsSent);

            // Reset form
            setFormData({
                realestateId: '',
                message: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || trans.failedSendSMS);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <form onSubmit={handleSubmit} className="grid">
                <div className="col-12">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="realestateId">{trans.selectRealEstate}</label>
                        <Dropdown
                            id="realestateId"
                            value={formData.realestateId}
                            onChange={(e) => handleInputChange(e, true)}
                            options={realestates}
                            optionLabel="title"
                            optionValue="_id"
                            placeholder={trans.selectRealEstate}
                            className="w-full"
                            loading={loadingRealestates.toString()}
                        />
                    </div>
                </div>

                <div className="col-12">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="message">{trans.message}</label>
                        <InputTextarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={5} placeholder={trans.enterMessage} className="w-full" />
                    </div>
                </div>

                <div className="col-12">
                    <div className="flex align-items-end h-full">
                        <Button type="submit" label={trans.sendSMS} icon="pi pi-send" loading={loading} disabled={!isFormValid() || loading} className="w-full" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SendSmsPage;
