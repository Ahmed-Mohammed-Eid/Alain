'use client';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import toast from 'react-hot-toast';
import axios from 'axios';

const CreateMarketingRequest = ({ params }) => {
    const lang = params?.lang || 'en'; // Default to Arabic since the inputs are in Arabic
    const translations = {
        en: {
            title: 'Create Marketing Request',
            clientName: 'Client Name',
            clientNamePlaceholder: 'Enter client name in Arabic',
            clientPhone: 'Client Phone',
            clientPhonePlaceholder: 'Enter phone number',
            realestateType: 'Real Estate Type',
            realestateTypePlaceholder: 'Enter real estate type in Arabic',
            address: 'Address',
            addressPlaceholder: 'Enter address in Arabic',
            requestType: 'Request Type',
            requestTypePlaceholder: 'Select request type',
            files: 'Upload Files',
            createRequest: 'Create Request',
            required: 'This field is required',
            success: 'Marketing request created successfully',
            error: 'Failed to create marketing request',
            fillRequired: 'Please fill in all required fields'
        },
        ar: {
            title: 'إنشاء طلب تسويق',
            clientName: 'اسم العميل',
            clientNamePlaceholder: 'أدخل اسم العميل',
            clientPhone: 'رقم الهاتف',
            clientPhonePlaceholder: 'أدخل رقم الهاتف',
            realestateType: 'نوع العقار',
            realestateTypePlaceholder: 'أدخل نوع العقار',
            address: 'العنوان',
            addressPlaceholder: 'أدخل العنوان',
            requestType: 'نوع الطلب',
            requestTypePlaceholder: 'اختر نوع الطلب',
            files: 'رفع الملفات',
            createRequest: 'إنشاء الطلب',
            required: 'هذا الحقل مطلوب',
            success: 'تم إنشاء طلب التسويق بنجاح',
            error: 'فشل في إنشاء طلب التسويق',
            fillRequired: 'يرجى ملء جميع الحقول المطلوبة'
        }
    }[lang];

    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        realestateType: '',
        address: '',
        requestType: '',
        files: []
    });

    // Form validation state
    const [submitted, setSubmitted] = useState(false);

    // Request types options
    const requestTypes = [
        { label: 'بيع', value: 'بيع' },
        { label: 'شراء', value: 'شراء' },
        { label: 'ادارة املاك', value: 'ادارة املاك' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        // Validation check
        if (!formData.clientName || !formData.clientPhone || !formData.realestateType || !formData.address || !formData.requestType) {
            toast.error(translations.fillRequired);
            return;
        }

        setLoading(true);
        try {
            // get the token from local storage
            const token = localStorage.getItem('token');

            // Create FormData instance
            const submitData = new FormData();
            submitData.append('clientName', formData.clientName);
            submitData.append('clientPhone', formData.clientPhone);
            submitData.append('realestateType', formData.realestateType);
            submitData.append('address', formData.address);
            submitData.append('requestType', formData.requestType);

            // Append files
            formData.files.forEach((file) => {
                submitData.append('files', file);
            });

            const res = await axios.post(`${process.env.API_URL}/admin/create/marketing/request`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success(translations.success);

            // Reset form
            setFormData({
                clientName: '',
                clientPhone: '',
                realestateType: '',
                address: '',
                requestType: '',
                files: []
            });
            setSubmitted(false);

            // Redirect to marketing requests page
            window.location.href = '/marketing';
        } catch (error) {
            toast.error(error.message || translations.error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (value, field) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const onFileUpload = (event) => {
        const files = Array.from(event.files);
        setFormData((prev) => ({ ...prev, files: [...prev.files, ...files] }));
    };

    const onFileRemove = (file) => {
        const updatedFiles = formData.files.filter((f) => f !== file);
        setFormData((prev) => ({ ...prev, files: updatedFiles }));
    };

    return (
        <div className="card" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="text-xl font-bold mb-4">{translations.title}</h2>
            <form onSubmit={handleSubmit} className="flex flex-column gap-4">
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <label htmlFor="clientName" className="block text-900 font-medium mb-2">
                            {translations.clientName}
                        </label>
                        <InputText
                            id="clientName"
                            value={formData.clientName}
                            onChange={(e) => handleInputChange(e.target.value, 'clientName')}
                            placeholder={translations.clientNamePlaceholder}
                            className={classNames('w-full', {
                                'p-invalid': submitted && !formData.clientName
                            })}
                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        />
                        {submitted && !formData.clientName && <small className="p-error">{translations.required}</small>}
                    </div>

                    <div className="col-12 md:col-6">
                        <label htmlFor="clientPhone" className="block text-900 font-medium mb-2">
                            {translations.clientPhone}
                        </label>
                        <InputText
                            id="clientPhone"
                            value={formData.clientPhone}
                            onChange={(e) => handleInputChange(e.target.value, 'clientPhone')}
                            placeholder={translations.clientPhonePlaceholder}
                            className={classNames('w-full', {
                                'p-invalid': submitted && !formData.clientPhone
                            })}
                            keyfilter="num"
                        />
                        {submitted && !formData.clientPhone && <small className="p-error">{translations.required}</small>}
                    </div>

                    <div className="col-12 md:col-6">
                        <label htmlFor="realestateType" className="block text-900 font-medium mb-2">
                            {translations.realestateType}
                        </label>
                        <InputText
                            id="realestateType"
                            value={formData.realestateType}
                            onChange={(e) => handleInputChange(e.target.value, 'realestateType')}
                            placeholder={translations.realestateTypePlaceholder}
                            className={classNames('w-full', {
                                'p-invalid': submitted && !formData.realestateType
                            })}
                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        />
                        {submitted && !formData.realestateType && <small className="p-error">{translations.required}</small>}
                    </div>

                    <div className="col-12 md:col-6">
                        <label htmlFor="requestType" className="block text-900 font-medium mb-2">
                            {translations.requestType}
                        </label>
                        <Dropdown
                            id="requestType"
                            value={formData.requestType}
                            onChange={(e) => handleInputChange(e.value, 'requestType')}
                            options={requestTypes}
                            placeholder={translations.requestTypePlaceholder}
                            className={classNames('w-full', {
                                'p-invalid': submitted && !formData.requestType
                            })}
                        />
                        {submitted && !formData.requestType && <small className="p-error">{translations.required}</small>}
                    </div>

                    <div className="col-12">
                        <label htmlFor="address" className="block text-900 font-medium mb-2">
                            {translations.address}
                        </label>
                        <InputText
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange(e.target.value, 'address')}
                            placeholder={translations.addressPlaceholder}
                            className={classNames('w-full', {
                                'p-invalid': submitted && !formData.address
                            })}
                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        />
                        {submitted && !formData.address && <small className="p-error">{translations.required}</small>}
                    </div>

                    <div className="col-12">
                        <label className="block text-900 font-medium mb-2">{translations.files}</label>
                        <FileUpload name="files" multiple accept="image/*,application/pdf" maxFileSize={10000000} onSelect={onFileUpload} onRemove={onFileRemove} emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>} />
                    </div>
                </div>

                <Button type="submit" label={translations.createRequest} icon="pi pi-plus" loading={loading} className="w-auto mt-4" />
            </form>
        </div>
    );
};

export default CreateMarketingRequest;
