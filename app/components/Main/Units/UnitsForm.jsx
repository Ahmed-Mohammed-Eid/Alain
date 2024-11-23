'use client';

import axios from 'axios';

import { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { toast } from 'react-hot-toast';

export default function UnitsForm({ lang }) {
    // STATE
    const [realEstateOptions, setRealEstateOptions] = useState([]);
    const [units, setUnits] = useState({
        apartments: [],
        shops: []
    });
    const [allUnits, setAllUnits] = useState([]);
    const [realestateId, setRealestateId] = useState(null);
    // GET THE UNITS DETAILS HANDLER
    const getUnitsDetailsHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        const response = await axios.get(`${process.env.API_URL}/units/details?realestateId=${realestateId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const units = response.data?.units || [];
        const apartmentsObjectsArray = units.filter((unit) => unit.unitType === 'شقه');
        const shopsObjectsArray = units.filter((unit) => unit.unitType === 'محل');

        setUnits({
            apartments: apartmentsObjectsArray,
            shops: shopsObjectsArray
        });
    };

    // GET THE REAL ESTATE OPTIONS HANDLER
    const getRealEstateOptionsHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        const response = await axios.get(`${process.env.API_URL}/realestates`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // SET THE REAL ESTATE OPTIONS
        setRealEstateOptions(response.data?.realestates || []);
    };

    // HANDLE THE UNITS TOTAL AND ADD THE TOTAL WITH THE UNITS AND EMPTY UNITS FOR THE NEW REAL ESTATE
    const handleUnitsTotal = () => {
        // GET THE SELECTED REAL ESTATE UNITS TOTAL units.shops
        const realEstate = realEstateOptions.find((realEstate) => realEstate._id === realestateId);
        const apartmentsTotal = realEstate?.unitsNumber?.appartments || 0;
        const shopsTotal = realEstate?.unitsNumber?.shops || 0;

        // Limit apartments and shops to their respective totals
        const finalApartments = units.apartments.slice(0, apartmentsTotal);
        const finalShops = units.shops.slice(0, shopsTotal);

        const newApartmentsToCreate = Math.max(0, apartmentsTotal - finalApartments.length);
        const newShopsToCreate = Math.max(0, shopsTotal - finalShops.length);

        // ADD OBJECTS TO THE ALL UNITS STATE
        setAllUnits([
            ...finalApartments,
            ...Array.from({ length: newApartmentsToCreate }, (_, index) => ({
                unitType: 'شقه',
                floorNumber: '',
                unitNumber: '',
                autoNumber: ''
            })),
            ...finalShops,
            ...Array.from({ length: newShopsToCreate }, (_, index) => ({
                unitType: 'محل',
                floorNumber: '',
                unitNumber: '',
                autoNumber: ''
            }))
        ]);
    };

    // HANDLE THE UNIT TYPE CHANGE
    const handleUnitTypeChange = (e, index) => {
        const newUnits = [...allUnits];
        newUnits[index].unitType = e.value;
        setAllUnits(newUnits);
    };

    // HANDLE THE FLOOR NUMBER CHANGE
    const handleFloorNumberChange = (e, index) => {
        const newUnits = [...allUnits];
        newUnits[index].floorNumber = e.value;
        setAllUnits(newUnits);
    };

    // HANDLE THE UNIT NUMBER CHANGE
    const handleUnitNumberChange = (e, index) => {
        const newUnits = [...allUnits];
        newUnits[index].unitNumber = e.value;
        setAllUnits(newUnits);
    };

    // HANDLE THE AUTO NUMBER CHANGE
    const handleAutoNumberChange = (e, index) => {
        const newUnits = [...allUnits];
        newUnits[index].autoNumber = e.value;
        setAllUnits(newUnits);
    };

    // HANDLE THE SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        // GET THE TOKEN
        const token = localStorage.getItem('token');

        // LOOP THROUGH THE UNITS AND MAKE THE SUBMIT ARRAY
        const submitUnits = allUnits.map((unit) => {
            return {
                unitType: unit.unitType,
                floorNumber: unit.floorNumber,
                unitNumber: unit.unitNumber,
                autoNumber: unit.autoNumber
            };
        });
        axios
            .post(
                `${process.env.API_URL}/create/units`,
                {
                    realestateId,
                    units: submitUnits
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            .then((res) => {
                console.log(res);
                toast.success(lang === 'en' ? 'Units created successfully' : 'تم إنشاء الوحدات بنجاح');
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.response?.data?.message || lang === 'en' ? 'Failed to create units' : 'فشل إنشاء الوحدات');
            });
    };

    useEffect(() => {
        getRealEstateOptionsHandler();
    }, []);

    useEffect(() => {
        if (realestateId) {
            getUnitsDetailsHandler();
        }
    }, [realestateId]);

    useEffect(() => {
        if (realestateId) {
            handleUnitsTotal();
        }
    }, [units]);

    return (
        <form onSubmit={handleSubmit} dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <div className="card mb-2">
                <h1>{lang === 'en' ? 'Manage Units' : 'إدارة الوحدات'}</h1>
                <hr />

                <div className="form formgrid p-fluid">
                    <div className="field col-12">
                        <label htmlFor="realestateId">{lang === 'en' ? 'Real-Estate' : 'العقار'}</label>
                        <Dropdown
                            filter
                            optionLabel="title"
                            optionValue="_id"
                            id="realestateId"
                            options={realEstateOptions}
                            value={realestateId}
                            onChange={(e) => setRealestateId(e.value)}
                            placeholder={lang === 'en' ? 'Select Real-Estate' : 'اختر العقار'}
                        />
                    </div>
                </div>
            </div>
            <div className="card mb-0">
                <h2>{lang === 'en' ? 'Units List' : 'قائمة الوحدات'}</h2>
                <hr />
                <div className="grid formgrid p-fluid">
                    {allUnits.map((unit, index) => (
                        <div key={'D' + index} className="card p-4 grid formgrid p-fluid col-12 mx-0 ">
                            <div className="field col-12 md:col-3" key={'DT' + index}>
                                <label htmlFor="unitType">{lang === 'en' ? 'Unit Type' : 'نوع الوحدة'}</label>
                                <Dropdown id="unitType" options={['شقه', 'محل']} onChange={(e) => handleUnitTypeChange(e, index)} value={unit.unitType} disabled />
                            </div>
                            <div className="field col-12 md:col-3" key={'IF' + index}>
                                <label htmlFor="floorNumber">{lang === 'en' ? 'Floor Number' : 'رقم الطابق'}</label>
                                <InputNumber id="floorNumber" onChange={(e) => handleFloorNumberChange(e, index)} value={unit.floorNumber} />
                            </div>
                            <div className="field col-12 md:col-3" key={'IU' + index}>
                                <label htmlFor="unitNumber">{lang === 'en' ? 'Unit Number' : 'رقم الوحدة'}</label>
                                <InputNumber id="unitNumber" onChange={(e) => handleUnitNumberChange(e, index)} value={unit.unitNumber} />
                            </div>
                            <div className="field col-12 md:col-3" key={'IA' + index}>
                                <label htmlFor="autoNumber">{lang === 'en' ? 'Auto Number' : 'الرقم الآلي للوحدة'}</label>
                                <InputNumber id="autoNumber" onChange={(e) => handleAutoNumberChange(e, index)} value={unit.autoNumber} />
                            </div>
                        </div>
                    ))}
                    <div className="field col-12 mt-4">
                        <Button type="submit" label={lang === 'en' ? 'Save' : 'حفظ'} icon="pi pi-save" />
                    </div>
                </div>
            </div>
        </form>
    );
}
