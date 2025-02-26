'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import toast from 'react-hot-toast';

const translations = {
    en: {
        title: 'Messages History',
        clientName: 'Client Name',
        clientPhone: 'Phone',
        message: 'Message',
        createdAt: 'Date',
        dateFrom: 'From',
        dateTo: 'To',
        search: 'Search',
        noDataFound: 'No messages found',
        error: 'An error occurred while fetching data'
    },
    ar: {
        title: 'سجل الرسائل',
        clientName: 'اسم العميل',
        clientPhone: 'رقم الهاتف',
        message: 'الرسالة',
        createdAt: 'التاريخ',
        dateFrom: 'من',
        dateTo: 'إلى',
        search: 'بحث',
        noDataFound: 'لا توجد رسائل',
        error: 'حدث خطأ أثناء جلب البيانات'
    }
};

const MessagesHistory = ({ params: { lang } }) => {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [dateFrom, setDateFrom] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    });
    const [dateTo, setDateTo] = useState(new Date());
    const trans = translations[lang];
    const isRTL = lang === 'ar';

    const fetchMessages = async (from, to) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            let url = `${process.env.API_URL}/msg/history`;
            if (from && to) {
                const fromStr = from.toLocaleDateString('en-US');
                const toStr = to.toLocaleDateString('en-US');
                url += `?dateFrom=${fromStr}&dateTo=${toStr}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessages(response.data.messages);
        } catch (error) {
            toast.error(trans.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages(dateFrom, dateTo);
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const dateTemplate = (rowData) => {
        return formatDate(rowData.createdAt);
    };

    const messageTemplate = (rowData) => {
        return <div style={{ whiteSpace: 'pre-wrap' }}>{rowData.message}</div>;
    };

    const handleSearch = () => {
        if (dateFrom && dateTo) {
            fetchMessages(dateFrom, dateTo);
        }
    };

    return (
        <div className="card" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <div className="grid">
                <div className="col-12">
                    <div className="flex flex-column gap-2">
                        <div className="flex align-items-center justify-content-between mb-3">
                            <h1 className="m-0 text-900 font-bold text-xl">{trans.title}</h1>
                        </div>

                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-4">
                                <label className="block text-900 font-medium mb-2">{trans.dateFrom}</label>
                                <Calendar value={dateFrom} onChange={(e) => setDateFrom(e.value)} showIcon placeholder={trans.dateFrom} className="w-full" />
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <label className="block text-900 font-medium mb-2">{trans.dateTo}</label>
                                <Calendar value={dateTo} onChange={(e) => setDateTo(e.value)} showIcon placeholder={trans.dateTo} className="w-full" />
                            </div>
                            <div className="col-12 md:col-6 lg:col-4">
                                <label className="block text-900 font-medium mb-2">&nbsp;</label>
                                <Button label={trans.search} icon="pi pi-search" onClick={handleSearch} disabled={!dateFrom || !dateTo} className="w-full" />
                            </div>
                        </div>

                        <DataTable
                            value={messages}
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
                            <Column field="clientPhone" header={trans.clientPhone} sortable />
                            <Column field="message" header={trans.message} body={messageTemplate} />
                            <Column field="createdAt" header={trans.createdAt} body={dateTemplate} sortable />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesHistory;
