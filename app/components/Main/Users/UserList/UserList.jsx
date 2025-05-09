'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
// import styles from './UserList.module.scss'; // Assuming SCSS module if custom styles are needed

const UserList = ({ lang }) => {
    const isRTL = lang === 'ar';

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const router = useRouter();

    const fetchUsers = useCallback(async () => {
        const authToken = localStorage.getItem('token');
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/all/users`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response.data && response.data.success) {
                setUsers(response.data.users);
            } else {
                toast.error(isRTL ? 'فشل في جلب المستخدمين.' : 'Failed to fetch users.');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error(error.response?.data?.message || (isRTL ? 'حدث خطأ أثناء جلب المستخدمين.' : 'An error occurred while fetching users.'));
        } finally {
            setLoading(false);
        }
    }, [isRTL]); // Added isRTL to dependency array as it's used in toast messages

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.isActive ? (isRTL ? 'نشط' : 'Active') : isRTL ? 'غير نشط' : 'Inactive'} severity={rowData.isActive ? 'success' : 'danger'} />;
    };

    const handleEdit = (userId) => {
        router.push(`/${lang}/users/edit/${userId}`);
    };

    const handleDelete = (userId) => {
        confirmDialog({
            message: isRTL ? 'هل أنت متأكد أنك تريد حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?',
            header: isRTL ? 'تأكيد الحذف' : 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: isRTL ? 'تأكيد' : 'Confirm',
            rejectLabel: isRTL ? 'إلغاء' : 'Cancel',
            accept: async () => {
                const authToken = localStorage.getItem('token');
                setActionLoading(true);
                try {
                    await axios.delete(`${process.env.API_URL}/delete/user?userId=${userId}`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    });
                    toast.success(isRTL ? 'تم حذف المستخدم بنجاح!' : 'User deleted successfully!');
                    fetchUsers(); // Refresh the list
                } catch (error) {
                    console.error('Error deleting user:', error);
                    toast.error(error.response?.data?.message || (isRTL ? 'حدث خطأ أثناء حذف المستخدم.' : 'An error occurred while deleting the user.'));
                } finally {
                    setActionLoading(false);
                }
            },
            reject: () => {
                // Optional: handle reject
            }
        });
    };

    const handleChangeStatus = (userId, currentStatus) => {
        const newStatus = !currentStatus;
        confirmDialog({
            message: `${isRTL ? 'هل أنت متأكد أنك تريد تغيير الحالة إلى ' : 'Are you sure you want to change the status to '}${newStatus ? (isRTL ? 'نشط' : 'Active') : isRTL ? 'غير نشط' : 'Inactive'}؟`,
            header: isRTL ? 'تأكيد تغيير الحالة' : 'Confirm Status Change',
            icon: 'pi pi-info-circle',
            acceptLabel: isRTL ? 'تأكيد' : 'Confirm',
            rejectLabel: isRTL ? 'إلغاء' : 'Cancel',
            accept: async () => {
                const authToken = localStorage.getItem('token');
                setActionLoading(true);
                try {
                    await axios.post(
                        `${process.env.API_URL}/set/user/status`,
                        { userId, status: newStatus },
                        {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    toast.success(isRTL ? 'تم تغيير حالة المستخدم بنجاح!' : 'User status changed successfully!');
                    fetchUsers(); // Refresh the list
                } catch (error) {
                    console.error('Error changing user status:', error);
                    toast.error(error.response?.data?.message || (isRTL ? 'حدث خطأ أثناء تغيير حالة المستخدم.' : 'An error occurred while changing user status.'));
                } finally {
                    setActionLoading(false);
                }
            },
            reject: () => {
                // Optional: handle reject
            }
        });
    };

    const actionsBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => handleEdit(rowData._id)} tooltip={isRTL ? 'تعديل' : 'Edit'} tooltipOptions={{ position: 'top' }} disabled={actionLoading} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-mr-2" onClick={() => handleDelete(rowData._id)} tooltip={isRTL ? 'حذف' : 'Delete'} tooltipOptions={{ position: 'top' }} disabled={actionLoading} />
                <Button
                    icon={rowData.isActive ? 'pi pi-lock' : 'pi pi-unlock'}
                    className={`p-button-rounded ${rowData.isActive ? 'p-button-warning' : 'p-button-info'}`}
                    onClick={() => handleChangeStatus(rowData._id, rowData.isActive)}
                    tooltip={rowData.isActive ? (isRTL ? 'تعيين كغير نشط' : 'Set Inactive') : isRTL ? 'تعيين كنشط' : 'Set Active'}
                    tooltipOptions={{ position: 'top' }}
                    disabled={actionLoading}
                />
            </div>
        );
    };

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={isRTL ? 'ابحث عن المستخدمين...' : 'Search users...'} />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className={'card mb-0'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Toaster />
            <ConfirmDialog />
            <DataTable
                value={users}
                loading={loading || actionLoading}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                emptyMessage={isRTL ? 'لم يتم العثور على مستخدمين.' : 'No users found.'}
                dataKey="_id"
                responsiveLayout="scroll"
                globalFilter={globalFilterValue}
                header={header}
            >
                <Column field="name" header={isRTL ? 'الاسم' : 'Name'} sortable filter filterPlaceholder={isRTL ? 'البحث بالاسم' : 'Search by name'} />
                <Column field="username" header={isRTL ? 'اسم المستخدم' : 'Username'} sortable filter filterPlaceholder={isRTL ? 'البحث باسم المستخدم' : 'Search by username'} />
                <Column field="role" header={isRTL ? 'الدور' : 'Role'} sortable filter filterPlaceholder={isRTL ? 'البحث بالدور' : 'Search by role'} />
                <Column
                    field="isActive"
                    header={isRTL ? 'الحالة' : 'Status'}
                    body={statusBodyTemplate}
                    sortable
                    filter
                    filterElement={(options) => <Tag value={options.value ? (isRTL ? 'نشط' : 'Active') : isRTL ? 'غير نشط' : 'Inactive'} severity={options.value ? 'success' : 'danger'} />}
                />
                <Column field="createdAt" header={isRTL ? 'تاريخ الإنشاء' : 'Created At'} body={(rowData) => formatDate(rowData.createdAt)} sortable />
                <Column field="updatedAt" header={isRTL ? 'تاريخ التحديث' : 'Updated At'} body={(rowData) => formatDate(rowData.updatedAt)} sortable />
                <Column header={isRTL ? 'الإجراءات' : 'Actions'} body={actionsBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
            </DataTable>
        </div>
    );
};

export default UserList;
