'use client';
import React, { useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function AssessmentsList({ lang }) {
    //ROUTER
    const router = useRouter();
    const isRTL = lang === 'ar';

    // TRANSLATIONS
    const translations = {
        en: {
            clientName: 'Client Name',
            phoneNumber: 'Phone Number',
            governorate: 'Governorate',
            region: 'Region',
            block: 'Block',
            actions: 'Actions',
            view: 'View',
            visited: 'Visited',
            completeVisit: 'Complete Visit',
            edit: 'Edit',
            delete: 'Delete',
            deleteAssessment: 'Delete Assessment',
            confirmDelete: 'Are you sure you want to delete this assessment?',
            yes: 'Yes',
            no: 'No',
            visitDetails: 'Visit Details',
            street: 'Street',
            alley: 'Alley',
            building: 'Building',
            floor: 'Floor',
            apartment: 'Apartment',
            visitDate: 'Visit Date',
            visitTime: 'Visit Time',
            description: 'Description',
            changeStatus: 'Change Status',
            confirmStatusChange: 'Are you sure you want to change the status of this assessment?',
            confirm: 'Confirm',
            cancel: 'Cancel',
            noAssessments: 'No assessments found.',
            errorFetching: 'An error occurred while fetching data.',
            deleteSuccess: 'Data deleted successfully.',
            deleteError: 'An error occurred while deleting data.',
            statusChangeSuccess: 'Assessment status changed successfully.',
            statusChangeError: 'An error occurred while changing assessment status.'
        },
        ar: {
            clientName: 'اسم العميل',
            phoneNumber: 'رقم العميل',
            governorate: 'المحافظة',
            region: 'المنطقة',
            block: 'القطعة',
            actions: 'الإجراءات',
            view: 'عرض',
            visited: 'تمت الزيارة',
            completeVisit: 'إتمام الزيارة',
            edit: 'تعديل',
            delete: 'حذف',
            deleteAssessment: 'حذف المعاينة',
            confirmDelete: 'هل أنت متأكد من حذف البيانات؟',
            yes: 'نعم',
            no: 'لا',
            visitDetails: 'تفاصيل الزيارة',
            street: 'الشارع',
            alley: 'الزقاق',
            building: 'البناء',
            floor: 'الطابق',
            apartment: 'الشقة',
            visitDate: 'تاريخ الزيارة',
            visitTime: 'وقت الزيارة',
            description: 'الوصف',
            changeStatus: 'تغيير الحالة',
            confirmStatusChange: 'هل أنت متأكد من أنك تريد تغيير حالة هذه المعاينة',
            confirm: 'تأكيد',
            cancel: 'الغاء',
            noAssessments: 'لم يتم العثور على معاينات.',
            errorFetching: 'حدث خطأ ما أثناء جلب البيانات.',
            deleteSuccess: 'تم حذف البيانات بنجاح.',
            deleteError: 'حدث خطأ ما أثناء حذف البيانات.',
            statusChangeSuccess: 'تم تغيير حالة المعاينة بنجاح.',
            statusChangeError: 'حدث خطأ ما أثناء تغيير حالة المعاينة.'
        }
    };

    const t = translations[lang];

    //STATE FOR THE ASSESSMENTS
    const [assessments, setAssessments] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [assessmentsIdToDelete, setAssessmentsIdToDelete] = React.useState(null);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [selectedAssessment, setSelectedAssessment] = React.useState(null);

    // GET THE ASSESSMENTS FROM THE API
    function getAssessments() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/admin/assessments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                // Update the state
                setAssessments(res.data?.visits || []);
                console.log(res.data);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t.errorFetching);
            });
    }

    // EFFECT TO GET THE ASSESSMENTS
    useEffect(() => {
        getAssessments();
    }, []);

    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        await axios
            .delete(`${process.env.API_URL}/delete/assessments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    assessmentsId: assessmentsIdToDelete
                }
            })
            .then((_) => {
                // Show notification
                toast.success(t.deleteSuccess);
                // Hide the dialog
                setVisible(false);
                // Update the State
                getAssessments();
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
                value={assessments || []}
                style={{ width: '100%' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={t.noAssessments}
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
                                    className="viewButton"
                                    onClick={() => {
                                        setSelectedItem(rowData);
                                    }}
                                >
                                    {t.view}
                                </button>
                                <button
                                    disabled={rowData?.isVisited}
                                    className="action1"
                                    onClick={() => {
                                        setSelectedAssessment(rowData);
                                    }}
                                >
                                    {rowData?.isVisited ? t.visited : t.completeVisit}
                                </button>
                                <button
                                    disabled={rowData?.isVisited}
                                    className="editButton"
                                    onClick={() => {
                                        router.push(`/assessment/${rowData._id}`);
                                    }}
                                >
                                    {t.edit}
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog header={t.deleteAssessment} visible={visible} position={'top'} style={{ width: '90%', maxWidth: '650px' }} onHide={() => setVisible(false)} footer={footerContent} draggable={false} resizable={false}>
                <p className="m-0">{t.confirmDelete}</p>
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
                onHide={() => setSelectedAssessment(null)}
                visible={!!selectedAssessment}
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
                                            `${process.env.API_URL}/update/visit/status`,
                                            {
                                                visitId: selectedAssessment?._id,
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
                                            setSelectedAssessment(null);
                                            getAssessments();
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
                                    setSelectedAssessment(null);
                                }}
                                className={'p-button-danger'}
                            />
                        </div>
                    );
                }}
            >
                <p>{t.confirmStatusChange}</p>
            </Dialog>
        </>
    );
}
