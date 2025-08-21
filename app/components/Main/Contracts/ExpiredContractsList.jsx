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
import { OverlayPanel } from 'primereact/overlaypanel';

export default function ExpiredContractsList({ lang }) {
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

    // GET THE EXPIRED CONTRACTS FROM THE API
    function getExpiredContracts() {
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/expired/contracts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                // The API returns expiredContracts array, we need to adapt it to our component structure
                const expiredContracts = res.data?.expiredContracts || [];
                // Transform the data to match the expected structure
                const transformedData = expiredContracts.map(contract => ({
                    ...contract,
                    // Add client info at the root level for easier access
                    clientName: contract.clientName,
                    clientPhone: contract.clientPhone,
                    clientAddress: contract.clientAddress,
                    username: contract.clientId?.username || '',
                    contractsIds: [contract] // Since these are individual contracts, we put each one in an array
                }));
                setContracts(transformedData);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || (lang === 'en' ? 'An error occurred while fetching the data.' : 'حدث خطأ ما أثناء جلب البيانات.'));
            });
    }

    // EFFECT TO GET THE EXPIRED CONTRACTS
    useEffect(() => {
        getExpiredContracts();
    }, []);

    // ADD PAYMENT HANDLER (for expired contracts that might be restored)
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
                await getExpiredContracts();
                // REUPDATE THE SELECTED ITEM OBJECT
                setSelectedItem(null);
                setExpandedRows(null);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || (lang === 'en' ? 'An error occurred while adding the payment.' : 'حدث خطأ ما أثناء إضافة الدفعة.'));
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
        contracts.forEach((contract) => (_expandedRows[`${contract._id}`] = true));
        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };

    const allowExpansion = (rowData) => {
        return rowData?.installments && rowData?.installments?.length > 0;
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
                                                        clientId: data.clientId?._id || data.clientId,
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
            <DataTable
                value={contracts}
                style={{ width: '100%' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={lang === 'en' ? 'No expired contracts found.' : 'لا يوجد عقود محذوفة.'}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <Column field="clientName" header={lang === 'en' ? 'Client Name' : 'اسم العميل'} sortable filter />
                <Column field="clientPhone" header={lang === 'en' ? 'Phone Number' : 'رقم الهاتف'} sortable filter />
                <Column
                    field="clientAddress"
                    header={lang === 'en' ? 'Client Address' : 'عنوان العميل'}
                    sortable
                    filter
                    body={(rowData) => {
                        const isString = typeof rowData.clientAddress === 'string';
                        if (isString) {
                            return <span>{rowData.clientAddress}</span>;
                        }
                        return (
                            <span>
                                {rowData.clientAddress?.Governorate} - {rowData.clientAddress?.region} - {rowData.clientAddress?.block} - {rowData.clientAddress?.street} - {rowData.clientAddress?.building} - {rowData.clientAddress?.apartment}
                            </span>
                        );
                    }}
                />
                <Column
                    field="contractType"
                    header={lang === 'en' ? 'Contract Type' : 'نوع العقد'}
                    sortable
                    filter
                    body={(rowData) => {
                        return <Badge value={rowData.contractType} />;
                    }}
                />
                <Column
                    field="contractAmount"
                    header={lang === 'en' ? 'Amount' : 'المبلغ'}
                    sortable
                    filter
                    body={(rowData) => {
                        return <span>{formatCurrency(rowData.contractAmount)}</span>;
                    }}
                />
                <Column
                    field="contractStatus"
                    header={lang === 'en' ? 'Status' : 'الحالة'}
                    sortable
                    filter
                    body={(rowData) => {
                        return rowData.contractStatus === 'valid' ? (
                            <Badge value={lang === 'en' ? 'Valid' : 'ساري'} style={{ backgroundColor: 'green' }} />
                        ) : (
                            <Badge value={lang === 'en' ? 'Expired' : 'منتهي'} style={{ backgroundColor: 'red' }} />
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

            <Dialog maximizable onHide={() => setSelectedItem(null)} visible={!!selectedItem} header={lang === 'en' ? 'Expired Contract Details' : 'تفاصيل العقد المحذوف'} style={{ width: '90vw' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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
                        <p>
                            {typeof selectedItem?.clientAddress === 'string' ? (
                                <span>{selectedItem?.clientAddress}</span>
                            ) : (
                                <>
                                    {selectedItem?.clientAddress?.Governorate} - {selectedItem?.clientAddress?.region} - {selectedItem?.clientAddress?.block} - {selectedItem?.clientAddress?.street} - {selectedItem?.clientAddress?.building} -{' '}
                                    {selectedItem?.clientAddress?.apartment}
                                </>
                            )}
                        </p>
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Contract Type' : 'نوع العقد'}</h5>
                        <p>{selectedItem?.contractType}</p>
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Contract Amount' : 'مبلغ العقد'}</h5>
                        <p>{formatCurrency(selectedItem?.contractAmount)}</p>
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Contract Duration' : 'مدة العقد'}</h5>
                        <p>
                            {selectedItem?.contractDuration} {lang === 'en' ? 'Years' : 'سنوات'}
                        </p>
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Contract Start Date' : 'تاريخ بدء العقد'}</h5>
                        <p>{formatDate(selectedItem?.contractStartDate)}</p>
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Contract End Date' : 'تاريخ انتهاء العقد'}</h5>
                        <p>{formatDate(selectedItem?.contractEndDate)}</p>
                    </div>

                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Status' : 'الحالة'}</h5>
                        <p>
                            {selectedItem?.contractStatus === 'valid' ? (
                                <Badge value={lang === 'en' ? 'Valid' : 'ساري'} style={{ backgroundColor: 'green' }} />
                            ) : (
                                <Badge value={lang === 'en' ? 'Expired' : 'منتهي'} style={{ backgroundColor: 'red' }} />
                            )}
                        </p>
                    </div>
                </div>
                <div className="grid card mt-2">
                    <div className={'col-12'}>
                        <h5>{lang === 'en' ? 'Installments' : 'الأقساط'}</h5>
                        <div className="flex justify-content-end gap-2 mb-3">
                            <Button icon="pi pi-plus" label={lang === 'en' ? 'Expand All' : 'توسيع الكل'} onClick={expandAll} text />
                            <Button icon="pi pi-minus" label={lang === 'en' ? 'Collapse All' : 'طي الكل'} onClick={collapseAll} text />
                        </div>
                        <DataTable
                            value={[selectedItem]} // Since we're showing details for one contract
                            expandedRows={expandedRows}
                            onRowToggle={(e) => setExpandedRows(e.data)}
                            rowExpansionTemplate={installmentRowExpansionTemplate}
                            dataKey="_id"
                        >
                            <Column expander={allowExpansion} style={{ width: '5rem' }} />
                            <Column field="contractDate" header={lang === 'en' ? 'Date' : 'التاريخ'} body={(rowData) => formatDate(rowData?.contractDate)} sortable />
                            <Column field="contractAmount" header={lang === 'en' ? 'Amount' : 'المبلغ'} body={(rowData) => formatCurrency(rowData?.contractAmount)} sortable />
                            <Column
                                header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                                style={{ width: '20%' }}
                                body={(rowData) => {
                                    return (
                                        <div className="flex justify-center gap-2">
                                            <span>{lang === 'en' ? 'No actions available' : 'لا توجد إجراءات'}</span>
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
