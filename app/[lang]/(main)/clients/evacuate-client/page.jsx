'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const translations = {
    en: {
        selectRealEstate: 'Select Real Estate',
        selectUnit: 'Select Unit',
        evacuateClient: 'Evacuate Client',
        fillFields: 'Please fill all required fields',
        mustLoginRealestate: 'You need to login to view real estates',
        mustLoginEvacuate: 'You need to login to evacuate client',
        evacuateSuccess: 'Client evacuated successfully',
        failedFetchRealestate: 'Failed to fetch real estates',
        failedFetchUnits: 'Failed to fetch units',
        failedEvacuate: 'Failed to evacuate client'
    },
    ar: {
        selectRealEstate: 'اختر العقار',
        selectUnit: 'اختر الوحدة',
        evacuateClient: 'إخلاء العميل',
        fillFields: 'يرجى ملء جميع الحقول المطلوبة',
        mustLoginRealestate: 'يجب تسجيل الدخول لعرض العقارات',
        mustLoginEvacuate: 'يجب تسجيل الدخول لإخلاء العميل',
        evacuateSuccess: 'تم إخلاء العميل بنجاح',
        failedFetchRealestate: 'فشل في استرجاع العقارات',
        failedFetchUnits: 'فشل في استرجاع الوحدات',
        failedEvacuate: 'فشل في إخلاء العميل'
    }
};

function EvacuateClientPage({ params }) {
    const lang = params?.lang || 'en';
    const isRTL = lang === 'ar';
    const trans = translations[lang];

    const [formData, setFormData] = useState({
        realestateId: '',
        unitId: ''
    });
    const [loading, setLoading] = useState(false);
    const [realestates, setRealestates] = useState([]);
    const [units, setUnits] = useState([]);
    const [loadingRealestates, setLoadingRealestates] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);

    useEffect(() => {
        fetchRealestates();
    }, []);

    useEffect(() => {
        if (formData.realestateId) {
            fetchUnits(formData.realestateId);
        } else {
            setUnits([]);
        }
    }, [formData.realestateId]);

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

    const fetchUnits = async (realestateId) => {
        setLoadingUnits(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error(trans.mustLoginRealestate);
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

            // Transform units data from the API response
            const unitsData = response.data.realestate.units.map((unit) => ({
                _id: unit._id,
                title: `${unit.unitType}${unit.floorNumber ? ` - Floor ${unit.floorNumber}` : ''}${unit.unitNumber ? ` - Unit ${unit.unitNumber}` : ''}`
            }));

            setUnits(unitsData);
        } catch (error) {
            toast.error(trans.failedFetchUnits);
        } finally {
            setLoadingUnits(false);
        }
    };

    const handleInputChange = (e, field) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: e.value,
            ...(field === 'realestateId' ? { unitId: '' } : {}) // Reset unitId when realestateId changes
        }));
    };

    const isFormValid = () => {
        return formData.realestateId.trim() !== '' && formData.unitId.trim() !== '';
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
                toast.error(trans.mustLoginEvacuate);
                return;
            }
            await axios.post(
                `${process.env.API_URL}/evacuate/client`,
                {
                    unitId: formData.unitId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success(trans.evacuateSuccess);

            // Reset form
            setFormData({
                realestateId: '',
                unitId: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || trans.failedEvacuate);
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
                            onChange={(e) => handleInputChange(e, 'realestateId')}
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
                        <label htmlFor="unitId">{trans.selectUnit}</label>
                        <Dropdown
                            id="unitId"
                            value={formData.unitId}
                            onChange={(e) => handleInputChange(e, 'unitId')}
                            options={units}
                            optionLabel="title"
                            optionValue="_id"
                            placeholder={trans.selectUnit}
                            className="w-full"
                            loading={loadingUnits.toString()}
                            disabled={!formData.realestateId}
                        />
                    </div>
                </div>

                <div className="col-12">
                    <div className="flex align-items-end h-full">
                        <Button type="submit" label={trans.evacuateClient} icon="pi pi-sign-out" loading={loading} disabled={!isFormValid() || loading} className="w-full" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EvacuateClientPage;
