'use client';
import React, { useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function MaintenanceList({ lang }) {
    // RTL Check
    const isRTL = lang === 'ar';

    // Translations
    const t = {
        en: {
            clientName: 'Client Name',
            phoneNumber: 'Phone Number',
            governorate: 'Governorate',
            region: 'Region',
            block: 'Block',
            street: 'Street',
            alley: 'Alley',
            building: 'Building',
            floor: 'Floor',
            apartment: 'Apartment',
            visitDate: 'Visit Date',
            visitTime: 'Visit Time',
            description: 'Description',
            actions: 'Actions',
            view: 'View',
            visited: 'Visited',
            completeVisit: 'Complete Visit',
            edit: 'Edit',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete this data?',
            visitDetails: 'Visit Details',
            changeStatus: 'Change Status',
            confirm: 'Confirm',
            cancel: 'Cancel',
            changeStatusConfirm: 'Are you sure you want to change the status of this visit?',
            noMaintenances: 'No maintenances found.',
            deleteSuccess: 'Data deleted successfully.',
            deleteError: 'An error occurred while deleting data.',
            fetchError: 'An error occurred while fetching data.',
            statusChangeSuccess: 'Visit status changed successfully.',
            statusChangeError: 'An error occurred while changing visit status.'
        },
        ar: {
            clientName: 'اسم العميل',
            phoneNumber: 'رقم العميل',
            governorate: 'المحافظة',
            region: 'المنطقة',
            block: 'القطعة',
            street: 'الشارع',
            alley: 'الزقاق',
            building: 'البناء',
            floor: 'الطابق',
            apartment: 'الشقة',
            visitDate: 'تاريخ الزيارة',
            visitTime: 'وقت الزيارة',
            description: 'الوصف',
            actions: 'الإجراءات',
            view: 'عرض',
            visited: 'تمت الزيارة',
            completeVisit: 'إتمام الزيارة',
            edit: 'تعديل',
            delete: 'حذف',
            deleteConfirm: 'هل أنت متأكد من حذف البيانات؟',
            visitDetails: 'تفاصيل الزيارة',
            changeStatus: 'تغيير الحالة',
            confirm: 'تأكيد',
            cancel: 'الغاء',
            changeStatusConfirm: 'هل أنت متأكد من أنك تريد تغيير حالة هذه الزيارة',
            noMaintenances: 'لم يتم العثور على معاينات.',
            deleteSuccess: 'تم حذف البيانات بنجاح.',
            deleteError: 'حدث خطأ ما أثناء حذف البيانات.',
            fetchError: 'حدث خطأ ما أثناء جلب البيانات.',
            statusChangeSuccess: 'تم تغيير حالة المعاينة بنجاح.',
            statusChangeError: 'حدث خطأ ما أثناء تغيير حالة المعاينة.'
        }
    }[lang];

    //ROUTER
    const router = useRouter();

    //STATE FOR THE MAINTENANCES
    const [maintenances, setMaintenances] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [maintenancesIdToDelete, setMaintenancesIdToDelete] = React.useState(null);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [selectedMaintenance, setSelectedMaintenance] = React.useState(null);

    // GET THE MAINTENANCES FROM THE API
    function getMaintenances() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/admin/maintenances`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                // Update the state
                setMaintenances(res.data?.maintenances || []);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t.fetchError);
            });
    }

    // EFFECT TO GET THE MAINTENANCES
    useEffect(() => {
        getMaintenances();
    }, []);

    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        await axios
            .delete(`${process.env.API_URL}/delete/maintenances`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    maintenancesId: maintenancesIdToDelete
                }
            })
            .then((_) => {
                // Show notification
                toast.success(t.deleteSuccess);
                // Hide the dialog
                setVisible(false);
                // Update the State
                getMaintenances();
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || t.deleteError);
            });
    };

    const footerContent = (
        <div>
            <Button label={t.cancel} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button
                label={t.confirm}
                icon="pi pi-check"
                onClick={() => {
                    deleteHandler();
                }}
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
                value={maintenances || []}
                style={{ width: '100%' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={t.noMaintenances}
            >
                <Column field="clientName" header={t.clientName} sortable filter />
                <Column field="phoneNumber" header={t.phoneNumber} sortable filter />
                <Column field={'governorate'} header={t.governorate} sortable filter />
                <Column field={'region'} header={t.region} sortable filter />
                <Column field={'block'} header={t.block} sortable filter />

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
                                    disabled={rowData?.isVisited}
                                    className={`btn btn-sm ${rowData?.isVisited ? 'btn-disabled' : 'btn-primary'}`}
                                    onClick={() => {
                                        setSelectedMaintenance(rowData);
                                    }}
                                >
                                    {rowData?.isVisited ? t.visited : t.completeVisit}
                                </button>
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => {
                                        router.push(`/maintenance/${rowData._id}`);
                                    }}
                                >
                                    {t.edit}
                                </button>
                                {/*<button*/}
                                {/*    className="deleteButton"*/}
                                {/*    onClick={() => {*/}
                                {/*        setVisible(true);*/}
                                {/*        setMaintenancesIdToDelete(rowData._id);*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    {t.delete}*/}
                                {/*</button>*/}
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog header="Delete Maintenances" visible={visible} position={'top'} style={{ width: '90%', maxWidth: '650px' }} onHide={() => setVisible(false)} footer={footerContent} draggable={false} resizable={false}>
                <p className="m-0">{t.deleteConfirm}</p>
            </Dialog>
            <Dialog onHide={() => setSelectedItem(null)} visible={!!selectedItem} header={t.visitDetails} style={{ width: '50vw' }}>
                <div className={'grid'} dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.clientName}</h5>
                        <p>{selectedItem?.clientName}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.phoneNumber}</h5>
                        <p>{selectedItem?.phoneNumber}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.governorate}</h5>
                        <p>{selectedItem?.governorate}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.region}</h5>
                        <p>{selectedItem?.region}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.block}</h5>
                        <p>{selectedItem?.block}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.street}</h5>
                        <p>{selectedItem?.street}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.alley}</h5>
                        <p>{selectedItem?.alley}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.building}</h5>
                        <p>{selectedItem?.building}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.floor}</h5>
                        <p>{selectedItem?.floor}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.apartment}</h5>
                        <p>{selectedItem?.appartment}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.visitDate}</h5>
                        <p>{new Date(selectedItem?.visitDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{t.visitTime}</h5>
                        <p>{selectedItem?.visitTime}</p>
                    </div>
                    <div className={'col-12'}>
                        <h5>{t.description}</h5>
                        <p>{selectedItem?.description}</p>
                    </div>
                </div>
            </Dialog>
            <Dialog
                onHide={() => setSelectedMaintenance(null)}
                visible={!!selectedMaintenance}
                header={t.changeStatus}
                style={{ width: '50vw', direction: isRTL ? 'rtl' : 'ltr' }}
                footer={() => {
                    return (
                        <div className={'flex justify-between'} dir={isRTL ? 'rtl' : 'ltr'}>
                            <Button
                                label={t.confirm}
                                onClick={() => {
                                    axios
                                        .put(
                                            `${process.env.API_URL}/update/maintenance/status`,
                                            {
                                                visitId: selectedMaintenance?._id,
                                                isVisited: true
                                            },
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                                }
                                            }
                                        )
                                        .then((res) => {
                                            toast.success(t.statusChangeSuccess);
                                            setSelectedMaintenance(null);
                                            getMaintenances();
                                        })
                                        .catch((err) => {
                                            toast.error(err?.response?.data?.message || t.statusChangeError);
                                        });
                                }}
                                className={'p-button-success'}
                            />
                            <Button
                                label={t.cancel}
                                onClick={() => {
                                    setSelectedMaintenance(null);
                                }}
                                className={'p-button-danger'}
                            />
                        </div>
                    );
                }}
            >
                <p>{t.changeStatusConfirm}</p>
            </Dialog>
        </>
    );
}
