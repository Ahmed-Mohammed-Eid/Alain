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

const CreateUser = ({ params }) => {
    const lang = params.lang;
    const translations = {
        en: {
            title: 'Create New User',
            employeeName: 'Employee Name',
            employeeNamePlaceholder: 'Enter employee name',
            username: 'Username',
            usernamePlaceholder: 'Enter username',
            role: 'Role',
            rolePlaceholder: 'Select a role',
            services: 'Services',
            servicesPlaceholder: 'Select services',
            accountDetails: 'Account Details',
            password: 'Password',
            passwordPlaceholder: 'Enter password',
            confirmPassword: 'Confirm Password',
            confirmPasswordPlaceholder: 'Re-enter password',
            createUser: 'Create User',
            required: 'This field is required',
            passwordMismatch: 'Passwords do not match',
            success: 'User created successfully',
            error: 'Failed to create user',
            fillRequired: 'Please fill in all required fields'
        },
        ar: {
            title: 'إنشاء مستخدم جديد',
            employeeName: 'اسم الموظف',
            employeeNamePlaceholder: 'أدخل اسم الموظف',
            username: 'اسم المستخدم',
            usernamePlaceholder: 'أدخل اسم المستخدم',
            role: 'الدور',
            rolePlaceholder: 'اختر الدور',
            services: 'الخدمات',
            servicesPlaceholder: 'اختر الخدمات',
            accountDetails: 'تفاصيل الحساب',
            password: 'كلمة المرور',
            passwordPlaceholder: 'أدخل كلمة المرور',
            confirmPassword: 'تأكيد كلمة المرور',
            confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
            createUser: 'إنشاء مستخدم',
            required: 'هذا الحقل مطلوب',
            passwordMismatch: 'كلمات المرور غير متطابقة',
            success: 'تم إنشاء المستخدم بنجاح',
            error: 'فشل في إنشاء المستخدم',
            fillRequired: 'يرجى ملء جميع الحقول المطلوبة'
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        // Validation check
        if (!formData.employeeName || !formData.username || !formData.role || !formData.password) {
            toast.error(translations.fillRequired);
            return;
        }

        setLoading(true);
        try {
            // get the token from local storage
            const token = localStorage.getItem('token');

            // Validate password match
            if (formData.password !== formData.confirmPassword) {
                toast.error(translations.passwordMismatch);
                return;
            }

            const { confirmPassword, ...submitData } = formData;

            const res = await axios.post(`${process.env.API_URL}/create/user`, submitData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success(translations.success);

            // // Redirect after success
            // setTimeout(() => {
            //     router.push('/users');
            // }, 1500);
        } catch (error) {
            toast.error(error.message);
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
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const services = res.data?.services || [];
            setServices(services);
        } catch (error) {
            console.error(error);
            toast.error(error?.message || translations.error);
        }
    };

    useEffect(() => {
        getServices();
    }, []);

    return (
        <div className="card">
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
                                className={classNames('w-full', {
                                    'p-invalid': submitted && !formData.password
                                })}
                                feedback={false}
                                inputStyle={{ width: '100%' }}
                            />
                            {submitted && !formData.password && <small className="p-error">{translations.required}</small>}
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
                                    'p-invalid': submitted && (!formData.confirmPassword || formData.password !== formData.confirmPassword)
                                })}
                                feedback={false}
                                inputStyle={{ width: '100%' }}
                            />
                            {submitted && !formData.confirmPassword && <small className="p-error">{translations.required}</small>}
                            {submitted && formData.confirmPassword && formData.password !== formData.confirmPassword && <small className="p-error">{translations.passwordMismatch}</small>}
                        </div>
                    </div>
                </div>

                <Button type="submit" label={translations.createUser} icon="pi pi-user-plus" loading={loading} className="w-auto mt-4" />
            </form>
        </div>
    );
};

export default CreateUser;
