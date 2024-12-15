'use client';
import React, { useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

import { OverlayPanel } from 'primereact/overlaypanel';

export default function ContractsList({ lang }) {
    // ROUTER
    const router = useRouter();

    // STATE
    const [contracts, setContracts] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [expandedRows, setExpandedRows] = React.useState(null);
    const [objectForPayment, setObjectForPayment] = React.useState({
        clientId: '',
        contractId: '',
        amountPaid: '',
        paymentId: '',
        installmentId: '',
        paymentType: ''
    });

    // OVERLAY PANEL
    const overlayPanelRef = useRef(null);

    // GET THE CONTRACTS FROM THE API
    function getContracts() {
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/contracted/clients`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                setContracts(res.data?.clients || []);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || (lang === 'en' ? 'An error occurred while fetching the data.' : 'حدث خطأ ما أثناء جلب البيانات.'));
            });
    }

    // EFFECT TO GET THE CONTRACTS
    useEffect(() => {
        getContracts();
    }, []);

    // DELETE HANDLER
    const deleteHandler = async (contractId) => {
        const token = localStorage.getItem('token');

        await axios
            .delete(`${process.env.API_URL}/remove/contract?contractId=${contractId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(async (_) => {
                toast.success(lang === 'en' ? 'Contract deleted successfully.' : 'تم حذف العقد بنجاح.');
                await getContracts();
                // REUPDATE THE SELECTED ITEM OBJECT
                setSelectedItem(null);
                setExpandedRows(null);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || (lang === 'en' ? 'An error occurred while deleting the contract.' : 'حدث خطأ ما أثناء حذف العقد.'));
            });
    };

    // ADD PAYMENT HANDLER
    const payInstallmentHandler = async () => {
        const token = localStorage.getItem('token');

        // check if the payment id is empty
        if (!objectForPayment.paymentId) {
            toast.error(lang === 'en' ? 'Payment ID is required.' : 'رقم الدفعة مطلوب.');
            return;
        }

        // check if the payment type is empty
        if (!objectForPayment.paymentType) {
            toast.error(lang === 'en' ? 'Payment Type is required.' : 'طريقة الدفع مطلوبة.');
            return;
        }

        // check if the amount paid is empty
        if (!objectForPayment.amountPaid) {
            toast.error(lang === 'en' ? 'Amount Paid is required.' : 'المبلغ المدفوع مطلوب.');
            return;
        }

        // check if the installment id is empty
        if (!objectForPayment.installmentId) {
            toast.error(lang === 'en' ? 'Installment ID is required.' : 'رقم القسط مطلوب.');
            return;
        }

        // check if the client id is empty
        if (!objectForPayment.clientId) {
            toast.error(lang === 'en' ? 'Client ID is required.' : 'رقم العميل مطلوب.');
            return;
        }

        // check if the contract id is empty
        if (!objectForPayment.contractId) {
            toast.error(lang === 'en' ? 'Contract ID is required.' : 'رقم العقد مطلوب.');
            return;
        }

        await axios
            .post(`${process.env.API_URL}/pay/contract/installment`, objectForPayment, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(async (_) => {
                toast.success(lang === 'en' ? 'Payment added successfully.' : 'تم إضافة الدفعة بنجاح.');
                await getContracts();
                // REUPDATE THE SELECTED ITEM OBJECT
                setSelectedItem(null);
                setExpandedRows(null);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || (lang === 'en' ? 'An error occurred while adding the payment.' : 'حدث خطأ ما أثناء إضافة الدفعة.'));
            });
    };

    // Add confirm delete function
    const confirmDelete = (event, contractId) => {
        confirmPopup({
            target: event.currentTarget,
            message: lang === 'en' ? 'Are you sure you want to delete this contract?' : 'هل أنت متأكد من حذف هذا العقد؟',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: lang === 'en' ? 'Yes' : 'نعم',
            rejectLabel: lang === 'en' ? 'No' : 'لا',
            acceptClassName: 'p-button-danger',
            accept: () => deleteHandler(contractId),
            reject: () => {
                toast.current.show({
                    severity: 'info',
                    summary: lang === 'en' ? 'Cancelled' : 'تم الإلغاء',
                    detail: lang === 'en' ? 'Delete action cancelled' : 'تم إلغاء عملية الحذف'
                });
            }
        });
    };

    // Format date for display
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format currency for display
    const formatCurrency = (value) => {
        return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'ar-EG', {
            style: 'currency',
            currency: 'KWD'
        }).format(value);
    };

    const expandAll = () => {
        let _expandedRows = {};
        selectedItem?.contractsIds?.forEach((contract) => (_expandedRows[`${contract._id}`] = true));
        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };

    const allowExpansion = (rowData) => {
        return rowData.installments && rowData.installments.length > 0;
    };

    const installmentRowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>{lang === 'en' ? `Installments for Contract dated ${formatDate(data.contractDate)}` : `الأقساط للعقد بتاريخ ${formatDate(data.contractDate)}`}</h5>
                <DataTable value={data.installments}>
                    <Column field="installmentDate" header={lang === 'en' ? 'Date' : 'التاريخ'} body={(rowData) => formatDate(rowData.date)} sortable />
                    <Column field="price" header={lang === 'en' ? 'Amount' : 'المبلغ'} body={(rowData) => formatCurrency(rowData.price)} sortable />
                    <Column
                        field="paid"
                        header={lang === 'en' ? 'Status' : 'الحالة'}
                        sortable
                        body={(rowData) => (rowData.paid ? <Badge value={lang === 'en' ? 'Paid' : 'مدفوع'} style={{ backgroundColor: 'green' }} /> : <Badge value={lang === 'en' ? 'Unpaid' : 'غير مدفوع'} style={{ backgroundColor: 'orange' }} />)}
                    />
                    <Column field="paymentType" header={lang === 'en' ? 'Payment Type' : 'طريقة الدفع'} sortable />
                    <Column field="reason" header={lang === 'en' ? 'Reason' : 'السبب'} sortable />
                    {/* ACTIONS */}
                    <Column
                        header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                        style={{ width: '20%' }}
                        body={(rowData) => {
                            console.log(rowData);
                            return (
                                <div className="flex justify-center gap-2">
                                    {/* mark as paid */}
                                    {!rowData.paid && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={(e) => {
                                                    overlayPanelRef.current.toggle(e);
                                                    setObjectForPayment({
                                                        clientId: data.clientId,
                                                        contractId: data._id,
                                                        amountPaid: rowData.price,
                                                        paymentId: '',
                                                        installmentId: rowData._id,
                                                        paymentType: rowData.paymentType
                                                    });
                                                }}
                                            >
                                                {lang === 'en' ? 'Mark as Paid' : 'تحديد كمدفوع'}
                                            </button>

                                            <OverlayPanel ref={overlayPanelRef}>
                                                <div className="grid formgrid p-fluid">
                                                    <div className="col-12 mb-2">
                                                        <h5>{lang === 'en' ? 'Payment Type' : 'طريقة الدفع'}</h5>
                                                        <Dropdown
                                                            style={{ width: '100%' }}
                                                            options={['cash', 'card', 'check']}
                                                            value={objectForPayment.paymentType}
                                                            onChange={(e) => {
                                                                setObjectForPayment({
                                                                    ...objectForPayment,
                                                                    paymentType: e.value
                                                                });
                                                            }}
                                                            placeholder={lang === 'en' ? 'Select Payment Type' : 'اختر طريقة الدفع'}
                                                        />
                                                    </div>
                                                    <div className="col-12 mb-2">
                                                        <h5>{lang === 'en' ? 'Payment ID' : 'رقم الدفعة'}</h5>
                                                        <InputText
                                                            style={{ width: '100%' }}
                                                            value={objectForPayment.paymentId}
                                                            onChange={(e) => {
                                                                setObjectForPayment({
                                                                    ...objectForPayment,
                                                                    paymentId: e.target.value
                                                                });
                                                            }}
                                                            placeholder={lang === 'en' ? 'Enter Payment ID' : 'أدخل رقم الدفعة'}
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <Button label={lang === 'en' ? 'Mark as Paid' : 'تحديد كمدفوع'} onClick={payInstallmentHandler} style={{ width: '100%' }} />
                                                    </div>
                                                </div>
                                            </OverlayPanel>
                                        </>
                                    )}
                                </div>
                            );
                        }}
                    />
                </DataTable>
            </div>
        );
    };

    return (
        <>
            <ConfirmPopup />
            <DataTable
                value={contracts}
                style={{ width: '100%' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={lang === 'en' ? 'No contracts found.' : 'لا يوجد عقود.'}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <Column field="clientName" header={lang === 'en' ? 'Client Name' : 'اسم العميل'} sortable filter />
                <Column field="clientPhone" header={lang === 'en' ? 'Phone Number' : 'رقم الهاتف'} sortable filter />
                <Column field="clientAddress" header={lang === 'en' ? 'Client Address' : 'عنوان العميل'} sortable filter />
                <Column
                    field="username"
                    header={lang === 'en' ? 'User Name' : 'اسم المستخدم'}
                    sortable
                    filter
                    body={(rowData) => {
                        return (
                            <Badge
                                value={rowData.username}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    //copy the username to the clipboard
                                    navigator.clipboard.writeText(rowData.username);
                                    toast.success(lang === 'en' ? 'Copied to clipboard.' : 'تم النسخ إلى الحافظة.');
                                }}
                            />
                        );
                    }}
                />
                <Column
                    header={lang === 'en' ? 'Contracts Count' : 'عدد العقود'}
                    sortable
                    filter
                    body={(rowData) => {
                        // return rowData?.contractsIds?.length;
                        return (
                            <p
                                style={{
                                    fontWeight: 'bold'
                                }}
                            >
                                {rowData?.contractsIds?.length}
                            </p>
                        );
                    }}
                />
                <Column
                    field={'_id'}
                    header={lang === 'en' ? 'Actions' : 'الإجراءات'}
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
                                    {lang === 'en' ? 'View' : 'عرض'}
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>

            <Dialog maximizable onHide={() => setSelectedItem(null)} visible={!!selectedItem} header={lang === 'en' ? 'Contract Details' : 'تفاصيل العقد'} style={{ width: '90vw' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <div className={'grid card mt-2'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Client Name' : 'اسم العميل'}</h5>
                        <p>{selectedItem?.clientName}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}</h5>
                        <p>{selectedItem?.clientPhone}</p>
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Address' : 'العنوان'}</h5>
                        <p>{selectedItem?.clientAddress}</p>
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Contract Duration' : 'مدة العقد'}</h5>
                        <p>
                            {selectedItem?.contractDuration} {lang === 'en' ? 'Years' : 'سنوات'}
                        </p>
                    </div>
                </div>
                <div className="grid card mt-2">
                    <div className={'col-12'}>
                        <h5>{lang === 'en' ? 'Contracts' : 'العقود'}</h5>
                        <div className="flex justify-content-end gap-2 mb-3">
                            <Button icon="pi pi-plus" label={lang === 'en' ? 'Expand All' : 'توسيع الكل'} onClick={expandAll} text />
                            <Button icon="pi pi-minus" label={lang === 'en' ? 'Collapse All' : 'طي الكل'} onClick={collapseAll} text />
                        </div>
                        <DataTable
                            // REFRESH THE TABLE
                            onValueChange={(e) => {
                                getContracts();
                            }}
                            value={selectedItem?.contractsIds}
                            expandedRows={expandedRows}
                            onRowToggle={(e) => setExpandedRows(e.data)}
                            rowExpansionTemplate={installmentRowExpansionTemplate}
                            dataKey="_id"
                        >
                            <Column expander={allowExpansion} style={{ width: '5rem' }} />
                            <Column field="contractDate" header={lang === 'en' ? 'Date' : 'التاريخ'} body={(rowData) => formatDate(rowData.contractDate)} sortable />
                            <Column field="contractAmount" header={lang === 'en' ? 'Amount' : 'المبلغ'} body={(rowData) => formatCurrency(rowData.contractAmount)} sortable />
                            <Column
                                header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                                style={{ width: '20%' }}
                                body={(rowData) => {
                                    console.log(rowData);
                                    return (
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => {
                                                    router.push(`/${lang}/contracts/${rowData._id}`);
                                                }}
                                            >
                                                {lang === 'en' ? 'Edit' : 'تعديل'}
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={(e) => confirmDelete(e, rowData._id)}>
                                                {lang === 'en' ? 'Delete' : 'حذف'}
                                            </button>
                                        </div>
                                    );
                                }}
                            />
                        </DataTable>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
