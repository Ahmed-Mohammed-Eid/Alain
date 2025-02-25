'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const translations = {
    en: {
        title: 'Clients Behind Due Date',
        clientName: 'Client Name',
        clientIdNumber: 'ID Number',
        clientPhone: 'Phone',
        contractType: 'Contract Type',
        contractAmount: 'Amount',
        contractDate: 'Contract Date',
        startDate: 'Start Date',
        endDate: 'End Date',
        unpaidInstallments: 'Unpaid',
        actions: 'Actions',
        currency: 'EGP',
        noDataFound: 'No data found',
        error: 'An error occurred while fetching data',
        clientDetails: 'Client Details',
        installmentDetails: 'Installment Details',
        clientAddress: 'Address',
        paymentType: 'Payment Type',
        reason: 'Reason',
        price: 'Price',
        date: 'Date',
        status: 'Status',
        paid: 'Paid',
        notPaid: 'Not Paid',
        close: 'Close'
    },
    ar: {
        title: 'العملاء المتأخرين عن السداد',
        clientName: 'اسم العميل',
        clientIdNumber: 'رقم الهوية',
        clientPhone: 'رقم الهاتف',
        contractType: 'نوع العقد',
        contractAmount: 'المبلغ',
        contractDate: 'تاريخ العقد',
        startDate: 'تاريخ البداية',
        endDate: 'تاريخ النهاية',
        unpaidInstallments: 'غير مدفوع',
        actions: 'الإجراءات',
        currency: 'جنيه',
        noDataFound: 'لا توجد بيانات',
        error: 'حدث خطأ أثناء جلب البيانات',
        clientDetails: 'تفاصيل العميل',
        installmentDetails: 'تفاصيل الأقساط',
        clientAddress: 'العنوان',
        paymentType: 'طريقة الدفع',
        reason: 'السبب',
        price: 'المبلغ',
        date: 'التاريخ',
        status: 'الحالة',
        paid: 'مدفوع',
        notPaid: 'غير مدفوع',
        close: 'إغلاق'
    }
};

const ClientsLate = ({ params: { lang } }) => {
    const [loading, setLoading] = useState(true);
    const [contracts, setContracts] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();
    const trans = translations[lang];
    const isRTL = lang === 'ar';

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.API_URL}/clients/behind/due/date`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setContracts(response.data.contracts);
            } catch (error) {
                toast.error(trans.error);
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, [trans]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US');
    };

    const contractDateTemplate = (rowData) => {
        return formatDate(rowData.contractDate);
    };

    const startDateTemplate = (rowData) => {
        return formatDate(rowData.contractStartDate);
    };

    const endDateTemplate = (rowData) => {
        return formatDate(rowData.contractEndDate);
    };

    const installmentsTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Tag value={`${rowData.installments.filter((i) => !i.paid).length} ${trans.unpaidInstallments}`} severity="danger" />
            </div>
        );
    };

    const actionsTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Button
                    icon="pi pi-eye"
                    rounded
                    outlined
                    severity="info"
                    onClick={() => {
                        setSelectedClient(rowData);
                        setDialogVisible(true);
                    }}
                />
            </div>
        );
    };

    const renderClientDetails = () => {
        if (!selectedClient) return null;

        return (
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">{trans.clientDetails}</h2>
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <div className="flex flex-column gap-3">
                                    <div>
                                        <label className="font-bold block mb-1">{trans.clientName}</label>
                                        <span>{selectedClient.clientName}</span>
                                    </div>
                                    <div>
                                        <label className="font-bold block mb-1">{trans.clientIdNumber}</label>
                                        <span>{selectedClient.clientIdNumber}</span>
                                    </div>
                                    <div>
                                        <label className="font-bold block mb-1">{trans.clientPhone}</label>
                                        <span>{selectedClient.clientPhone}</span>
                                    </div>
                                    <div>
                                        <label className="font-bold block mb-1">{trans.clientAddress}</label>
                                        <span>{selectedClient.clientAddress}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="flex flex-column gap-3">
                                    <div>
                                        <label className="font-bold block mb-1">{trans.contractType}</label>
                                        <span>{selectedClient.contractType}</span>
                                    </div>
                                    <div>
                                        <label className="font-bold block mb-1">{trans.contractAmount}</label>
                                        <span>
                                            {selectedClient.contractAmount} {trans.currency}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="font-bold block mb-1">{trans.contractDate}</label>
                                        <span>{formatDate(selectedClient.contractDate)}</span>
                                    </div>
                                    <div>
                                        <label className="font-bold block mb-1">{trans.startDate}</label>
                                        <span>{formatDate(selectedClient.contractStartDate)}</span>
                                    </div>
                                    <div>
                                        <label className="font-bold block mb-1">{trans.endDate}</label>
                                        <span>{formatDate(selectedClient.contractEndDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">{trans.installmentDetails}</h2>
                        <DataTable value={selectedClient.installments} className="p-datatable-gridlines" showGridlines stripedRows sortField="date" sortOrder={1}>
                            <Column field="date" header={trans.date} body={(rowData) => formatDate(rowData.date)} sortable />
                            <Column field="price" header={trans.price} body={(rowData) => `${rowData.price} ${trans.currency}`} sortable />
                            <Column field="paymentType" header={trans.paymentType} sortable />
                            <Column field="reason" header={trans.reason} sortable />
                            <Column field="paid" header={trans.status} body={(rowData) => <Tag value={rowData.paid ? trans.paid : trans.notPaid} severity={rowData.paid ? 'success' : 'danger'} />} sortable />
                        </DataTable>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="card" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <div className="grid">
                    <div className="col-12">
                        <div className="flex flex-column gap-2">
                            <div className="flex align-items-center justify-content-between mb-3">
                                <h1 className="m-0 text-900 font-bold text-xl">{trans.title}</h1>
                            </div>
                            <DataTable
                                value={contracts}
                                loading={loading}
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                emptyMessage={trans.noDataFound}
                                className="p-datatable-gridlines"
                                sortMode="multiple"
                                removableSort
                                resizableColumns
                                stripedRows
                                showGridlines
                            >
                                <Column field="clientName" header={trans.clientName} sortable />
                                <Column field="clientIdNumber" header={trans.clientIdNumber} sortable />
                                <Column field="clientPhone" header={trans.clientPhone} sortable />
                                <Column field="contractType" header={trans.contractType} sortable />
                                <Column field="contractAmount" header={trans.contractAmount} sortable body={(rowData) => `${rowData.contractAmount} ${trans.currency}`} />
                                <Column field="contractDate" header={trans.contractDate} sortable body={contractDateTemplate} />
                                <Column field="contractStartDate" header={trans.startDate} sortable body={startDateTemplate} />
                                <Column field="contractEndDate" header={trans.endDate} sortable body={endDateTemplate} />
                                <Column header={trans.unpaidInstallments} body={installmentsTemplate} />
                                <Column header={trans.actions} body={actionsTemplate} style={{ width: '100px' }} />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                visible={dialogVisible}
                style={{ width: '90vw', maxWidth: '1200px' }}
                onHide={() => setDialogVisible(false)}
                header={trans.clientDetails}
                footer={
                    <div className="flex justify-content-end">
                        <Button label={trans.close} icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-text" />
                    </div>
                }
                maximizable
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {renderClientDetails()}
            </Dialog>
        </>
    );
};

export default ClientsLate;
