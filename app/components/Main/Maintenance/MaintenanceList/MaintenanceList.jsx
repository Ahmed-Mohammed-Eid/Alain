'use client';
import React, { useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

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
            statusChangeError: 'An error occurred while changing visit status.',
            assign: 'Assign',
            assigned: 'Assigned',
            assignTo: 'Assign To Agent',
            selectAgent: 'Select Agent',
            assignSuccess: 'Maintenance assigned successfully',
            assignError: 'Error assigning maintenance',
            fetchAgentsError: 'Error fetching agents',
            noAgents: 'No agents available'
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
            statusChangeError: 'حدث خطأ ما أثناء تغيير حالة المعاينة.',
            assign: 'تعيين',
            assigned: 'تم التعيين',
            assignTo: 'تعيين إلى وكيل',
            selectAgent: 'اختر وكيل',
            assignSuccess: 'تم تعيين الصيانة بنجاح',
            assignError: 'خطأ في تعيين الصيانة',
            fetchAgentsError: 'خطأ في جلب الوكلاء',
            noAgents: 'لا يوجد وكلاء متاحين'
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
    const [agents, setAgents] = React.useState([]);
    const [assignDialogVisible, setAssignDialogVisible] = React.useState(false);
    const [selectedAgent, setSelectedAgent] = React.useState(null);
    const [maintenanceToAssign, setMaintenanceToAssign] = React.useState(null);

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
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`${process.env.API_URL}/delete/maintenance/request`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    maintenanceId: maintenancesIdToDelete
                }
            });

            toast.success(t.deleteSuccess);
            setVisible(false);
            setMaintenancesIdToDelete(null);
            getMaintenances();
        } catch (err) {
            toast.error(err.response?.data?.message || t.deleteError);
        }
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

    // Add this new function to handle status updates
    const updateMaintenanceStatus = async (maintenanceId) => {
        const token = localStorage.getItem('token');

        try {
            await axios.put(
                `${process.env.API_URL}/update/maintenance/status`,
                {
                    maintenanceId: maintenanceId,
                    isVisited: true
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(t.statusChangeSuccess);
            setSelectedMaintenance(null);
            getMaintenances();
        } catch (err) {
            toast.error(err?.response?.data?.message || t.statusChangeError);
        }
    };

    // Add this function to fetch agents
    const getAgents = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${process.env.API_URL}/agents`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAgents(response.data?.agents || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || t.fetchAgentsError);
        }
    };

    // Add this function to handle assignment
    const assignMaintenance = async () => {
        if (!selectedAgent || !maintenanceToAssign) return;

        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `${process.env.API_URL}/assign/maintenance/order`,
                {
                    maintenanceId: maintenanceToAssign._id,
                    agentId: selectedAgent
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(t.assignSuccess);
            setAssignDialogVisible(false);
            setSelectedAgent(null);
            setMaintenanceToAssign(null);
            getMaintenances();
        } catch (error) {
            toast.error(error?.response?.data?.message || t.assignError);
        }
    };

    // Add useEffect to fetch agents when component mounts
    useEffect(() => {
        getAgents();
    }, []);

    return (
        <>
            <DataTable
                value={maintenances || []}
                style={{ width: '100%' }}
                dir={isRTL ? 'rtl' : 'ltr'}
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
                            <div className="flex justify-center gap-2 whitespace-nowrap">
                                <button
                                    className="btn btn-sm btn-info min-w-[60px] no-wrap"
                                    onClick={() => {
                                        setSelectedItem(rowData);
                                    }}
                                >
                                    {t.view}
                                </button>
                                <button
                                    disabled={rowData?.isVisited}
                                    className={`btn btn-sm min-w-[100px] no-wrap ${rowData?.isVisited ? 'btn-disabled' : 'btn-primary'}`}
                                    onClick={() => {
                                        setSelectedMaintenance(rowData);
                                    }}
                                >
                                    {rowData?.isVisited ? t.visited : t.completeVisit}
                                </button>
                                <button
                                    className="btn btn-sm btn-warning min-w-[60px] no-wrap"
                                    onClick={() => {
                                        router.push(`/maintenance/${rowData._id}`);
                                    }}
                                >
                                    {t.edit}
                                </button>
                                <button
                                    className={`btn btn-sm btn-success min-w-[60px] no-wrap`}
                                    // className={`btn btn-sm btn-success min-w-[60px] no-wrap ${rowData?.agentId ? 'btn-disabled' : ''}`}
                                    // disabled={rowData?.agentId}
                                    onClick={() => {
                                        setMaintenanceToAssign(rowData);
                                        setAssignDialogVisible(true);
                                    }}
                                >
                                    {rowData?.agentId ? t.assigned : t.assign}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger min-w-[60px] no-wrap"
                                    onClick={() => {
                                        setMaintenancesIdToDelete(rowData._id);
                                        setVisible(true);
                                    }}
                                >
                                    {t.delete}
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog header="Delete Maintenances" visible={visible} position={'top'} style={{ width: '50vw', direction: isRTL ? 'rtl' : 'ltr' }} onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <p className="m-0">{t.deleteConfirm}</p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button label={t.cancel} onClick={() => setVisible(false)} className="p-button-outlined p-button-danger min-w-[100px]" />
                    <Button label={t.confirm} onClick={deleteHandler} className="p-button-danger min-w-[100px]" />
                </div>
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
                        <div className={'flex justify-end gap-2'} dir={isRTL ? 'rtl' : 'ltr'}>
                            <Button label={t.cancel} onClick={() => setSelectedMaintenance(null)} className="p-button-outlined p-button-danger min-w-[100px]" />
                            <Button label={t.confirm} onClick={() => updateMaintenanceStatus(selectedMaintenance?._id)} className="p-button-success min-w-[100px]" />
                        </div>
                    );
                }}
            >
                <p>{t.changeStatusConfirm}</p>
            </Dialog>
            <Dialog
                visible={assignDialogVisible}
                onHide={() => {
                    setAssignDialogVisible(false);
                    setSelectedAgent(null);
                    setMaintenanceToAssign(null);
                }}
                header={t.assignTo}
                style={{ width: '50vw', direction: isRTL ? 'rtl' : 'ltr' }}
            >
                <div className="flex flex-column gap-4">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="agent">{t.selectAgent}</label>
                        <Dropdown id="agent" value={selectedAgent} onChange={(e) => setSelectedAgent(e.value)} options={agents} optionLabel="name" optionValue="_id" placeholder={t.selectAgent} className="w-full" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            label={t.cancel}
                            onClick={() => {
                                setAssignDialogVisible(false);
                                setSelectedAgent(null);
                                setMaintenanceToAssign(null);
                            }}
                            className="p-button-outlined p-button-danger min-w-[100px]"
                        />
                        <Button label={t.confirm} onClick={assignMaintenance} className="p-button-success min-w-[100px]" disabled={!selectedAgent} />
                    </div>
                </div>
            </Dialog>
        </>
    );
}
