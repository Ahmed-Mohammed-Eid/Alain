'use client';
import React, { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function MarketingList({ lang }) {
    // STATE
    const [marketingRequests, setMarketingRequests] = React.useState([]);
    const [selectedRequest, setSelectedRequest] = React.useState(null);
    const [visible, setVisible] = React.useState(false);
    const [notes, setNotes] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [visibleClientDetails, setVisibleClientDetails] = React.useState({
        visible: false,
        clientId: null
    });

    // GET THE MARKETING REQUESTS FROM THE API
    function getMarketingRequests() {
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/marketing/requests`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                setMarketingRequests(res.data?.marketingRequests || []);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || (lang === 'en' ? 'An error occurred while fetching the data.' : 'حدث خطأ ما أثناء جلب البيانات.'));
            });
    }

    // UPDATE HANDLER
    const updateHandler = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);

        await axios
            .put(
                `${process.env.API_URL}/update/marketing/request`,
                {
                    requestId: selectedRequest._id,
                    notes: notes
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((_) => {
                toast.success(lang === 'en' ? 'Request updated successfully.' : 'تم تحديث الطلب بنجاح.');
                setVisible(false);
                getMarketingRequests();
                setNotes('');
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || (lang === 'en' ? 'An error occurred while updating the request.' : 'حدث خطأ ما أثناء تحديث الطلب.'));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // EFFECT TO GET THE MARKETING REQUESTS
    useEffect(() => {
        getMarketingRequests();
    }, []);

    // CLIENT NAME TEMPLATE # TO OPEN IN A DIALOG THE CLIENT DETAILS WHEN CLICKING ON THE CLIENT NAME
    const clientNameTemplate = (rowData) => {
        // return <Button label={rowData.clientName} onClick={() => setVisibleClientDetails({ visible: true, data: rowData })} className="p-button-text p-button-sm" icon="pi pi-eye" />;
        return (
            <div className="flex align-items-center gap-2 cursor-pointer" onClick={() => setVisibleClientDetails({ visible: true, data: rowData })}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-dialog-header-maximize-icon" aria-hidden="true" data-pc-section="maximizableicon">
                    <g clip-path="url(#pr_icon_clip_1)">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14ZM9.77805 7.42192C9.89013 7.534 10.0415 7.59788 10.2 7.59995C10.3585 7.59788 10.5099 7.534 10.622 7.42192C10.7341 7.30985 10.798 7.15844 10.8 6.99995V3.94242C10.8066 3.90505 10.8096 3.86689 10.8089 3.82843C10.8079 3.77159 10.7988 3.7157 10.7824 3.6623C10.756 3.55552 10.701 3.45698 10.622 3.37798C10.5099 3.2659 10.3585 3.20202 10.2 3.19995H7.00002C6.84089 3.19995 6.68828 3.26317 6.57576 3.37569C6.46324 3.48821 6.40002 3.64082 6.40002 3.79995C6.40002 3.95908 6.46324 4.11169 6.57576 4.22422C6.68828 4.33674 6.84089 4.39995 7.00002 4.39995H8.80006L6.19997 7.00005C6.10158 7.11005 6.04718 7.25246 6.04718 7.40005C6.04718 7.54763 6.10158 7.69004 6.19997 7.80005C6.30202 7.91645 6.44561 7.98824 6.59997 8.00005C6.75432 7.98824 6.89791 7.91645 6.99997 7.80005L9.60002 5.26841V6.99995C9.6021 7.15844 9.66598 7.30985 9.77805 7.42192ZM1.4 14H3.8C4.17066 13.9979 4.52553 13.8498 4.78763 13.5877C5.04973 13.3256 5.1979 12.9707 5.2 12.6V10.2C5.1979 9.82939 5.04973 9.47452 4.78763 9.21242C4.52553 8.95032 4.17066 8.80215 3.8 8.80005H1.4C1.02934 8.80215 0.674468 8.95032 0.412371 9.21242C0.150274 9.47452 0.00210008 9.82939 0 10.2V12.6C0.00210008 12.9707 0.150274 13.3256 0.412371 13.5877C0.674468 13.8498 1.02934 13.9979 1.4 14ZM1.25858 10.0586C1.29609 10.0211 1.34696 10 1.4 10H3.8C3.85304 10 3.90391 10.0211 3.94142 10.0586C3.97893 10.0961 4 10.147 4 10.2V12.6C4 12.6531 3.97893 12.704 3.94142 12.7415C3.90391 12.779 3.85304 12.8 3.8 12.8H1.4C1.34696 12.8 1.29609 12.779 1.25858 12.7415C1.22107 12.704 1.2 12.6531 1.2 12.6V10.2C1.2 10.147 1.22107 10.0961 1.25858 10.0586Z"
                            fill="var(--primary-color)"
                        ></path>
                    </g>
                    <defs>
                        <clipPath id="pr_icon_clip_1">
                            <rect width="14" height="14" fill="white"></rect>
                        </clipPath>
                    </defs>
                </svg>
                <span
                    style={{
                        color: 'var(--primary-color)',
                        fontWeight: '700'
                    }}
                >
                    {rowData.clientName}
                </span>
            </div>
        );
    };

    // STATUS TEMPLATE
    const statusTemplate = (rowData) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-700',
            done: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700'
        };

        return (
            <span className={`px-2 py-1 rounded ${statusColors[rowData.requestStatus] || statusColors.pending}`}>
                {lang === 'en' ? rowData.requestStatus : rowData.requestStatus === 'pending' ? 'قيد الانتظار' : rowData.requestStatus === 'done' ? 'تم' : 'ملغي'}
            </span>
        );
    };

    return (
        <>
            <DataTable value={marketingRequests} paginator rows={10} rowsPerPageOptions={[5, 10, 20]} emptyMessage={lang === 'en' ? 'No marketing requests found.' : 'لا يوجد طلبات تسويق.'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <Column field="clientName" header={lang === 'en' ? 'Client Name' : 'اسم العميل'} sortable filter body={clientNameTemplate} />
                <Column field="clientPhone" header={lang === 'en' ? 'Phone' : 'رقم الهاتف'} sortable filter />
                <Column field="realestateType" header={lang === 'en' ? 'Property Type' : 'نوع العقار'} sortable filter />
                <Column field="address" header={lang === 'en' ? 'Address' : 'العنوان'} sortable filter />
                <Column field="requestType" header={lang === 'en' ? 'Request Type' : 'نوع الطلب'} sortable filter />
                <Column field="requestStatus" header={lang === 'en' ? 'Status' : 'الحالة'} body={statusTemplate} sortable filter />
                <Column
                    header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                    body={(rowData) => (
                        <Button
                            label={lang === 'en' ? 'Update' : 'تحديث'}
                            icon="pi pi-pencil"
                            className="p-button-text p-button-sm"
                            onClick={() => {
                                setSelectedRequest(rowData);
                                setNotes(rowData.notes || '');
                                setVisible(true);
                            }}
                        />
                    )}
                />
            </DataTable>

            <Dialog
                header={lang === 'en' ? 'Update Request' : 'تحديث الطلب'}
                visible={visible}
                style={{ width: '50vw' }}
                onHide={() => {
                    setVisible(false);
                    setNotes('');
                }}
                footer={
                    <div>
                        <Button label={lang === 'en' ? 'Cancel' : 'إلغاء'} onClick={() => setVisible(false)} className="p-button-text" />
                        <Button label={lang === 'en' ? 'Update' : 'تحديث'} onClick={updateHandler} loading={loading} />
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <InputTextarea
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr', textAlign: lang === 'ar' ? 'right' : 'left', width: '100%' }}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={5}
                        placeholder={lang === 'en' ? 'Enter notes...' : 'أدخل الملاحظات...'}
                    />
                </div>
            </Dialog>
            <Dialog
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                style={{ width: '50vw' }}
                header={lang === 'en' ? 'Client Details' : 'بيانات العميل'}
                visible={visibleClientDetails.visible}
                onHide={() => setVisibleClientDetails({ visible: false, clientId: null })}
            >
                <div className="grid formgrid p-fluid">
                    <div className="field col-12 md:col-6">
                        <h5>{lang === 'en' ? 'Client Name' : 'اسم العميل'}:</h5>
                        <p>{visibleClientDetails?.data?.clientName || ''}</p>
                    </div>
                    <div className="field col-12 md:col-6">
                        <h5>{lang === 'en' ? 'Client Phone' : 'رقم الهاتف'}:</h5>
                        <p>{visibleClientDetails?.data?.clientPhone || ''}</p>
                    </div>
                    <div className="field col-12 md:col-6">
                        <h5>{lang === 'en' ? 'Client Address' : 'العنوان'}:</h5>
                        <p>{visibleClientDetails?.data?.address || ''}</p>
                    </div>
                    <div className="field col-12 md:col-6">
                        <h5>{lang === 'en' ? 'Client Realestate Type' : 'نوع العقار'}:</h5>
                        <p>{visibleClientDetails?.data?.realestateType || ''}</p>
                    </div>
                    <div className="field col-12 md:col-6">
                        <h5>{lang === 'en' ? 'Client Request Type' : 'نوع الطلب'}:</h5>
                        <p>{visibleClientDetails?.data?.requestType || ''}</p>
                    </div>
                    <div className="field col-12 md:col-6">
                        <h5>{lang === 'en' ? 'Client Request Status' : 'الحالة'}:</h5>
                        <p>{visibleClientDetails?.data?.requestStatus || ''}</p>
                    </div>
                    <div className="field col-12">
                        <h5>{lang === 'en' ? 'Client Notes' : 'الملاحظات'}:</h5>
                        <p>{visibleClientDetails?.data?.notes || ''}</p>
                    </div>
                    <div className="flex gap-2 col-12">
                        {visibleClientDetails?.data?.images?.map((image, index) => (
                            <img key={index} src={image} alt={`Image ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                        ))}
                    </div>
                </div>
            </Dialog>
        </>
    );
}
