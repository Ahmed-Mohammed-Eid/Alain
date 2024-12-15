'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';

export default function TransactionsList({ lang }) {
    const days_to_get = 7;
    const [transactions, setTransactions] = useState([]);
    const [dateFrom, setDateFrom] = useState(new Date(new Date() - days_to_get * 24 * 60 * 60 * 1000));
    const [dateTo, setDateTo] = useState(new Date());

    // get all transactions
    function getTransactions() {
        const token = localStorage.getItem('token');

        if (!dateFrom || !dateTo) {
            toast.error(lang === 'en' ? 'Please select date from and date to' : 'يرجى اختيار تاريخ من وتاريخ إلى');
            return;
        }

        axios
            .get(`${process.env.API_URL}/transactions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    dateFrom: dateFrom,
                    dateTo: dateTo
                }
            })
            .then((res) => {
                setTransactions(res.data?.transactions || []);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Something went wrong');
            });
    }

    useEffect(() => {
        if (dateFrom && dateTo) {
            getTransactions();
        }
    }, [dateFrom, dateTo]);

    return (
        <>
            <div className="card mb-2">
                <h4 className="uppercase">{lang === 'en' ? 'Transactions' : 'المعاملات'}</h4>
                <hr />

                <div className="grid formdrid p-fluid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="dateFrom">{lang === 'en' ? 'Date From' : 'من تاريخ'}</label>
                        <Calendar value={dateFrom} onChange={(e) => setDateFrom(e.value)} placeholder={lang === 'en' ? 'Select Date From' : 'اختر تاريخ من'} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="dateTo">{lang === 'en' ? 'Date To' : 'إلى تاريخ'}</label>
                        <Calendar value={dateTo} onChange={(e) => setDateTo(e.value)} placeholder={lang === 'en' ? 'Select Date To' : 'اختر تاريخ إلى'} />
                    </div>
                </div>
            </div>
            <div className="card">
                {transactions.length > 0 ? (
                    <DataTable value={transactions} className="p-datatable-gridlines" rows={10} rowsPerPageOptions={[10, 20, 50]} emptyMessage={lang === 'en' ? 'No Transactions Found' : 'لا يوجد معاملات'}>
                        {/* NAME */}
                        <Column field="clientId.clientName" header={lang === 'en' ? 'Name' : 'الاسم'} />
                        {/* PHONE */}
                        <Column field="clientId.clientPhone" header={lang === 'en' ? 'Phone' : 'الهاتف'} />
                        {/* amountPaid */}
                        <Column field="amountPaid" header={lang === 'en' ? 'Amount Paid' : 'المبلغ المدفوع'} />
                        {/* amountRemaining */}
                        <Column field="paymentId" header={lang === 'en' ? 'Payment ID' : 'رقم الدفع'} />
                        {/* paidBy */}
                        <Column
                            field="paidBy"
                            header={lang === 'en' ? 'Paid By' : 'تم الدفع بواسطة'}
                            body={(rowData) => {
                                if (rowData.paidBy === 'admin') {
                                    return <Badge value={lang === 'en' ? 'Admin' : 'المسؤول'} severity="info" />;
                                } else if (rowData.paidBy === 'user') {
                                    return <Badge value={lang === 'en' ? 'User' : 'المستخدم'} severity="success" />;
                                } else if (rowData.paidBy === 'client') {
                                    return <Badge value={lang === 'en' ? 'Client' : 'العميل'} severity="warning" />;
                                } else if (rowData.paidBy === 'cashier') {
                                    return <Badge value={lang === 'en' ? 'Cashier' : 'المحاسب'} severity="danger" />;
                                } else if (rowData.paidBy === 'bank') {
                                    return <Badge value={lang === 'en' ? 'Bank' : 'البنك'} severity="primary" />;
                                }
                            }}
                        />
                        {/* paidAt */}
                        <Column
                            field="createdAt"
                            header={lang === 'en' ? 'Paid At' : 'تم الدفع بتاريخ'}
                            body={(row) => <span>{new Date(row.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', { day: '2-digit', month: 'long', year: 'numeric' })}</span>}
                        />
                    </DataTable>
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <h4 className="text-center">{lang === 'en' ? 'No Transactions Found' : 'لا يوجد معاملات'}</h4>
                    </div>
                )}
            </div>
        </>
    );
}
