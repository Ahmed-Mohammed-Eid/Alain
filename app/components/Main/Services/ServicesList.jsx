'use client';
import React, { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Image from 'next/image';
import isValidImageUrl from '../../../../helpers/isValidImageUrl';

export default function ServicesList({ lang }) {
    // ROUTER
    const router = useRouter();

    // STATE
    const [services, setServices] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [serviceIdToDelete, setServiceIdToDelete] = React.useState(null);
    const [selectedItem, setSelectedItem] = React.useState(null);

    // TRANSLATIONS
    const translations = {
        ar: {
            image: 'الصورة',
            serviceTitle: 'عنوان الخدمة',
            contractedService: 'خدمة متعاقد عليها',
            serviceCost: 'تكلفة الخدمة',
            actions: 'الإجراءات',
            view: 'عرض',
            edit: 'تعديل',
            delete: 'حذف',
            deleteService: 'حذف الخدمة',
            deleteConfirm: 'هل أنت متأكد من حذف هذه الخدمة؟',
            yes: 'نعم',
            no: 'لا',
            serviceDetails: 'تفاصيل الخدمة',
            createdAt: 'تاريخ الإنشاء',
            lastUpdate: 'آخر تحديث',
            files: 'الملفات',
            noServices: 'لا توجد خدمات.',
            deleteSuccess: 'تم حذف الخدمة بنجاح.',
            deleteError: 'حدث خطأ أثناء حذف الخدمة.',
            fetchError: 'حدث خطأ أثناء جلب البيانات.'
        },
        en: {
            image: 'Image',
            serviceTitle: 'Service Title',
            contractedService: 'Contracted Service',
            serviceCost: 'Service Cost',
            actions: 'Actions',
            view: 'View',
            edit: 'Edit',
            delete: 'Delete',
            deleteService: 'Delete Service',
            deleteConfirm: 'Are you sure you want to delete this service?',
            yes: 'Yes',
            no: 'No',
            serviceDetails: 'Service Details',
            createdAt: 'Created At',
            lastUpdate: 'Last Update',
            files: 'Files',
            noServices: 'No services found.',
            deleteSuccess: 'Service deleted successfully.',
            deleteError: 'Error deleting service.',
            fetchError: 'Error fetching data.'
        }
    };

    const t = translations[lang] || translations.ar;

    // GET THE SERVICES FROM THE API
    function getServices() {
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/all/services`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                setServices(res.data?.services || []);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t.fetchError);
            });
    }

    // EFFECT TO GET THE SERVICES
    useEffect(() => {
        getServices();
    }, []);

    // DELETE HANDLER
    const deleteHandler = async () => {
        const token = localStorage.getItem('token');

        await axios
            .delete(`${process.env.API_URL}/delete/service`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    serviceId: serviceIdToDelete
                }
            })
            .then((_) => {
                toast.success(t.deleteSuccess);
                setVisible(false);
                getServices();
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || t.deleteError);
            });
    };

    const footerContent = (
        <div>
            <Button label={t.no} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button
                label={t.yes}
                icon="pi pi-check"
                onClick={deleteHandler}
                style={{
                    backgroundColor: '#dc3545',
                    color: '#fff'
                }}
                autoFocus
            />
        </div>
    );

    return (
        <>
            <DataTable
                value={services}
                style={{ width: '100%' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={t.noServices}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                {/* image */}
                <Column
                    field="image"
                    header={t.image}
                    body={(rowData) => {
                        return (
                            <Image
                                src={isValidImageUrl(rowData?.image) ? rowData?.image : '/assets/404.png'}
                                alt="service"
                                width={50}
                                height={50}
                                key={rowData?.image}
                                style={{
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    width: '50px',
                                    height: '50px',
                                    margin: 'auto',
                                    border: '1px solid #ccc'
                                }}
                            />
                        );
                    }}
                />

                <Column field="serviceTitle" header={t.serviceTitle} sortable filter />
                <Column field="contractedService" header={t.contractedService} sortable filter body={(rowData) => (rowData.contractedService ? '✓' : '✗')} />
                <Column
                    field="serviceCost"
                    header={t.serviceCost}
                    sortable
                    filter
                    body={(rowData) => {
                        return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
                            style: 'currency',
                            currency: 'KWD'
                        }).format(rowData.serviceCost);
                    }}
                />
                <Column
                    field={'_id'}
                    header={t.actions}
                    style={{ width: '20%' }}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => {
                                        setSelectedItem(rowData);
                                    }}
                                >
                                    {t.view}
                                </button>
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => {
                                        router.push(`/services/${rowData._id}`);
                                    }}
                                >
                                    {t.edit}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                        setVisible(true);
                                        setServiceIdToDelete(rowData._id);
                                    }}
                                >
                                    {t.delete}
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>

            <Dialog
                header={t.deleteService}
                visible={visible}
                position={'top'}
                style={{ width: '90%', maxWidth: '650px' }}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <p className="m-0">{t.deleteConfirm}</p>
            </Dialog>

            <Dialog onHide={() => setSelectedItem(null)} visible={!!selectedItem} header={t.serviceDetails} style={{ width: '50vw' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <div className={'grid'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.serviceTitle}</h5>
                        <p>{selectedItem?.serviceTitle}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.contractedService}</h5>
                        <p>{selectedItem?.contractedService ? '✓' : '✗'}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.serviceCost}</h5>
                        <p>
                            {selectedItem?.serviceCost &&
                                new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
                                    style: 'currency',
                                    currency: 'KWD'
                                }).format(selectedItem.serviceCost)}
                        </p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.createdAt}</h5>
                        <p>{selectedItem?.createdAt && new Date(selectedItem.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG')}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.lastUpdate}</h5>
                        <p>{selectedItem?.updatedAt && new Date(selectedItem.updatedAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG')}</p>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
