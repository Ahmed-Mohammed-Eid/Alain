'use client';
import React, { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function ContractsList({ lang }) {
    // ROUTER
    const router = useRouter();

    // STATE
    const [contracts, setContracts] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [contractIdToDelete, setContractIdToDelete] = React.useState(null);
    const [selectedItem, setSelectedItem] = React.useState(null);

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
    const deleteHandler = async () => {
        const token = localStorage.getItem('token');

        await axios
            .delete(`${process.env.API_URL}/remove/contract?contractId=${contractIdToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((_) => {
                toast.success(lang === 'en' ? 'Contract deleted successfully.' : 'تم حذف العقد بنجاح.');
                setVisible(false);
                getContracts();
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || (lang === 'en' ? 'An error occurred while deleting the contract.' : 'حدث خطأ ما أثناء حذف العقد.'));
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

    const footerContent = (
        <div>
            <Button label={lang === 'en' ? 'No' : 'لا'} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button
                label={lang === 'en' ? 'Yes' : 'نعم'}
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
                <Column field="contractDate" header={lang === 'en' ? 'Contract Date' : 'تاريخ العقد'} sortable filter body={(rowData) => formatDate(rowData.contractDate)} />
                <Column field="contractAmount" header={lang === 'en' ? 'Contract Amount' : 'قيمة العقد'} sortable filter body={(rowData) => formatCurrency(rowData.contractAmount)} />
                <Column field="contractStartDate" header={lang === 'en' ? 'Start Date' : 'تاريخ البداية'} sortable filter body={(rowData) => formatDate(rowData.contractStartDate)} />
                <Column field="contractEndDate" header={lang === 'en' ? 'End Date' : 'تاريخ النهاية'} sortable filter body={(rowData) => formatDate(rowData.contractEndDate)} />
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
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => {
                                        router.push(`/${lang}/contracts/${rowData._id}`);
                                    }}
                                >
                                    {lang === 'en' ? 'Edit' : 'تعديل'}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                        setVisible(true);
                                        setContractIdToDelete(rowData._id);
                                    }}
                                >
                                    {lang === 'en' ? 'Delete' : 'حذف'}
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>

            <Dialog
                header={lang === 'en' ? 'Delete Contract' : 'حذف العقد'}
                visible={visible}
                position={'top'}
                style={{ width: '90%', maxWidth: '650px' }}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <p className="m-0">{lang === 'en' ? 'Are you sure you want to delete this contract?' : 'هل أنت متأكد من حذف العقد؟'}</p>
            </Dialog>

            <Dialog onHide={() => setSelectedItem(null)} visible={!!selectedItem} header={lang === 'en' ? 'Contract Details' : 'تفاصيل العقد'} style={{ width: '50vw' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <div className={'grid'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Client Name' : 'اسم العميل'}</h5>
                        <p>{selectedItem?.clientName}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}</h5>
                        <p>{selectedItem?.clientPhone}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'ID Number' : 'رقم الهوية'}</h5>
                        <p>{selectedItem?.clientIdNumber}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Address' : 'العنوان'}</h5>
                        <p>{selectedItem?.clientAddress}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Contract Amount' : 'قيمة العقد'}</h5>
                        <p>{selectedItem?.contractAmount && formatCurrency(selectedItem.contractAmount)}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Contract Duration' : 'مدة العقد'}</h5>
                        <p>
                            {selectedItem?.contractDuration} {lang === 'en' ? 'Years' : 'سنوات'}
                        </p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Contract Date' : 'تاريخ العقد'}</h5>
                        <p>{selectedItem?.contractDate && formatDate(selectedItem.contractDate)}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Start Date' : 'تاريخ البداية'}</h5>
                        <p>{selectedItem?.contractStartDate && formatDate(selectedItem.contractStartDate)}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'End Date' : 'تاريخ النهاية'}</h5>
                        <p>{selectedItem?.contractEndDate && formatDate(selectedItem.contractEndDate)}</p>
                    </div>
                    <div className={'col-12'}>
                        <h5>{lang === 'en' ? 'Installments' : 'الأقساط'}</h5>
                        <DataTable value={selectedItem?.installments} className="mt-2">
                            <Column field="date" header={lang === 'en' ? 'Date' : 'التاريخ'} body={(rowData) => formatDate(rowData.date)} />
                            <Column field="price" header={lang === 'en' ? 'Amount' : 'المبلغ'} body={(rowData) => formatCurrency(rowData.price)} />
                            <Column field="paymentType" header={lang === 'en' ? 'Payment Type' : 'طريقة الدفع'} />
                            <Column field="reason" header={lang === 'en' ? 'Reason' : 'السبب'} />
                        </DataTable>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
