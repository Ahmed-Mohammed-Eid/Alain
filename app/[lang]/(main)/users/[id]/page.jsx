'use client';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

const UpdateUser = ({ params }) => {
    const lang = params.lang;
    const isRTL = lang === 'ar';
    const userId = params.id;
    const translations = {
        en: {
            title: 'Update User',
            employeeName: 'Employee Name',
            employeeNamePlaceholder: 'Enter employee name',
            username: 'Username',
            usernamePlaceholder: 'Enter username',
            role: 'Role',
            rolePlaceholder: 'Select a role',
            services: 'Services',
            servicesPlaceholder: 'Select services',
            accountDetails: 'Account Details',
            password: 'Password (leave blank to keep current)',
            passwordPlaceholder: 'Enter new password',
            confirmPassword: 'Confirm New Password',
            confirmPasswordPlaceholder: 'Re-enter new password',
            updateUser: 'Update User',
            required: 'This field is required',
            passwordMismatch: 'Passwords do not match',
            success: 'User updated successfully',
            error: 'Failed to update user',
            fillRequired: 'Please fill in all required fields',
            loadingUser: 'Loading user data...'
        },
        ar: {
            title: 'تحديث المستخدم',
            employeeName: 'اسم الموظف',
            employeeNamePlaceholder: 'أدخل اسم الموظف',
            username: 'اسم المستخدم',
            usernamePlaceholder: 'أدخل اسم المستخدم',
            role: 'الدور',
            rolePlaceholder: 'اختر الدور',
            services: 'الخدمات',
            servicesPlaceholder: 'اختر الخدمات',
            accountDetails: 'تفاصيل الحساب',
            password: 'كلمة المرور (اتركها فارغة للاحتفاظ بالحاليه)',
            passwordPlaceholder: 'أدخل كلمة المرور الجديدة',
            confirmPassword: 'تأكيد كلمة المرور الجديدة',
            confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور الجديدة',
            updateUser: 'تحديث المستخدم',
            required: 'هذا الحقل مطلوب',
            passwordMismatch: 'كلمات المرور غير متطابقة',
            success: 'تم تحديث المستخدم بنجاح',
            error: 'فشل في تحديث المستخدم',
            fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
            loadingUser: 'جاري تحميل بيانات المستخدم...'
        }
    }[lang];
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        employeeName: '',
        username: '',
        role: '',
        servicesIds: [],
        password: '',
        confirmPassword: ''
    });

    // Form validation state
    const [submitted, setSubmitted] = useState(false);

    // Available roles
    const roles = [
        { label: 'Agent', value: 'agent' },
        { label: 'Admin', value: 'admin' }
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;
            setLoading(true);
            toast.loading(translations.loadingUser);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${process.env.API_URL}/system/user/details?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const userData = res.data?.user;
                if (userData) {
                    setFormData({
                        employeeName: userData.name || '',
                        username: userData.username || '',
                        role: userData.role || '',
                        servicesIds: userData.servicesIds || [],
                        password: '', // Password should be empty initially for update
                        confirmPassword: ''
                    });
                } else {
                    toast.error(translations.error);
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || error.message || translations.error);
            } finally {
                setLoading(false);
                toast.dismiss();
            }
        };
        fetchUserData();
    }, [userId, lang]); // Added lang to dependencies in case translations are needed in fetch

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        // Validation check (excluding password if not being changed)
        if (!formData.employeeName || !formData.username || !formData.role) {
            toast.error(translations.fillRequired);
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error(translations.passwordMismatch);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { confirmPassword, ...submitData } = formData;

            const payload = { ...submitData, userId };

            await axios.put(`${process.env.API_URL}/update/user/details`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success(translations.success);
            // Optionally redirect or clear form
            router.push(`/${lang}/users`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message || translations.error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e, field) => {
        const value = e.target?.value ?? e;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // GET ALL SERVICES HANDLER
    const getServices = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.API_URL}/all/services`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const fetchedServices = res.data?.services || [];
            setServices(fetchedServices);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message || 'Failed to load services');
        }
    };

    useEffect(() => {
        getServices();
    }, []);

    return (
        <div className="card" dir={isRTL ? 'rtl' : 'ltr'}>
            <h2 className="text-xl font-bold mb-4">{translations.title}</h2>
            <form onSubmit={handleSubmit} className="flex flex-column gap-4">
                <div className="grid">
                    <div className="col-12">
                        <label htmlFor="employeeName" className="block text-900 font-medium mb-2">
                            {translations.employeeName}
                        </label>
                        <InputText
                            id="employeeName"
                            value={formData.employeeName}
                            onChange={(e) => handleInputChange(e.target.value, 'employeeName')}
                            placeholder={translations.employeeNamePlaceholder}
                            className={classNames('w-full', {
                                'p-invalid': submitted && !formData.employeeName
                            })}
                        />
                        {submitted && !formData.employeeName && <small className="p-error">{translations.required}</small>}
                    </div>

                    <div className="col-12 md:col-6">
                        <label htmlFor="role" className="block text-900 font-medium mb-2">
                            {translations.role}
                        </label>
                        <Dropdown
                            id="role"
                            value={formData.role}
                            onChange={(e) => handleInputChange(e.value, 'role')}
                            options={roles}
                            optionLabel="label"
                            placeholder={translations.rolePlaceholder}
                            className={classNames('w-full', {
                                'p-invalid': submitted && !formData.role
                            })}
                        />
                        {submitted && !formData.role && <small className="p-error">{translations.required}</small>}
                    </div>

                    <div className="col-12 md:col-6">
                        <label htmlFor="services" className="block text-900 font-medium mb-2">
                            {translations.services}
                        </label>
                        <MultiSelect
                            id="services"
                            value={formData.servicesIds}
                            onChange={(e) => handleInputChange(e.value, 'servicesIds')}
                            options={services}
                            optionLabel="serviceTitle"
                            optionValue="_id"
                            placeholder={translations.servicesPlaceholder}
                            className="w-full"
                            display="chip"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-4">{translations.accountDetails}</h3>
                    <div className="grid">
                        <div className="col-12">
                            <label htmlFor="username" className="block text-900 font-medium mb-2">
                                {translations.username}
                            </label>
                            <InputText
                                id="username"
                                value={formData.username}
                                onChange={(e) => handleInputChange(e.target.value, 'username')}
                                placeholder={translations.usernamePlaceholder}
                                className={classNames('w-full', {
                                    'p-invalid': submitted && !formData.username
                                })}
                            />
                            {submitted && !formData.username && <small className="p-error">{translations.required}</small>}
                        </div>
                        <div className="col-12 md:col-6">
                            <label htmlFor="password" className="block text-900 font-medium mb-2">
                                {translations.password}
                            </label>
                            <Password
                                id="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange(e.target.value, 'password')}
                                toggleMask
                                placeholder={translations.passwordPlaceholder}
                                className={classNames('w-full', { // No p-invalid for optional password on initial load
                                    'p-invalid': submitted && formData.password && formData.password !== formData.confirmPassword
                                })}
                                feedback={false}
                                inputStyle={{ width: '100%' }}
                            />
                            {/* No required validation for password itself, only if confirmPassword doesn't match */}
                        </div>

                        <div className="col-12 md:col-6">
                            <label htmlFor="confirmPassword" className="block text-900 font-medium mb-2">
                                {translations.confirmPassword}
                            </label>
                            <Password
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange(e.target.value, 'confirmPassword')}
                                toggleMask
                                placeholder={translations.confirmPasswordPlaceholder}
                                className={classNames('w-full', {
                                    'p-invalid': submitted && formData.password && formData.password !== formData.confirmPassword
                                })}
                                feedback={false}
                                inputStyle={{ width: '100%' }}
                                disabled={!formData.password} // Disable if password field is empty
                            />
                            {submitted && formData.password && formData.password !== formData.confirmPassword && <small className="p-error">{translations.passwordMismatch}</small>}
                        </div>
                    </div>
                </div>

                <Button type="submit" label={translations.updateUser} icon="pi pi-user-edit" loading={loading} className="w-auto mt-4" />
            </form>
        </div>
    );
};

export default UpdateUser;