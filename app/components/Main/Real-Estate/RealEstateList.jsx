'use client';
import React, { useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function RealEstateList({ lang }) {
    // ROUTER
    const router = useRouter();

    // STATE
    const [realEstates, setRealEstates] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [realEstateIdToDelete, setRealEstateIdToDelete] = React.useState(null);
    const [selectedItem, setSelectedItem] = React.useState(null);

    // GET THE REAL ESTATES FROM THE API
    function getRealEstates() {
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/realestates`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res.data.realestates);
                setRealEstates(res.data?.realestates || []);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || (lang === 'en' ? 'An error occurred while fetching the data.' : 'حدث خطأ ما أثناء جلب البيانات.'));
            });
    }

    // EFFECT TO GET THE REAL ESTATES
    useEffect(() => {
        getRealEstates();
    }, []);

    // DELETE HANDLER
    const deleteHandler = async () => {
        const token = localStorage.getItem('token');

        await axios
            .delete(`${process.env.API_URL}/delete/realestate`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    realestateId: realEstateIdToDelete
                }
            })
            .then((_) => {
                toast.success(lang === 'en' ? 'Real estate deleted successfully.' : 'تم حذف العقار بنجاح.');
                setVisible(false);
                getRealEstates();
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || (lang === 'en' ? 'An error occurred while deleting the real estate.' : 'حدث خطأ ما أثناء حذف العقار.'));
            });
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
                value={realEstates}
                style={{ width: '100%' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={lang === 'en' ? 'No real estates found.' : 'لا يوجد عقارات.'}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <Column field="title" header={lang === 'en' ? 'Real Estate Name' : 'اسم العقار'} sortable filter />
                <Column field="autoNumber" header={lang === 'en' ? 'Auto Number' : 'الرقم التلقائي'} sortable filter />
                <Column field="realestateNumber" header={lang === 'en' ? 'Real Estate Number' : 'رقم العقار'} sortable filter />
                <Column field="address" header={lang === 'en' ? 'Address' : 'العنوان'} sortable filter />
                <Column field="unitsNumber.appartments" header={lang === 'en' ? 'Apartments Count' : 'عدد الشقق'} sortable filter body={(rowData) => rowData.unitsNumber?.appartments || 0} />
                <Column field="unitsNumber.shops" header={lang === 'en' ? 'Shops Count' : 'عدد المحلات'} sortable filter body={(rowData) => rowData.unitsNumber?.shops || 0} />
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
                                        router.push(`/real-estate/${rowData._id}`);
                                    }}
                                >
                                    {lang === 'en' ? 'Edit' : 'تعديل'}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                        setVisible(true);
                                        setRealEstateIdToDelete(rowData._id);
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
                header={lang === 'en' ? 'Delete Real Estate' : 'حذف العقار'}
                visible={visible}
                position={'top'}
                style={{ width: '90%', maxWidth: '650px' }}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <p className="m-0">{lang === 'en' ? 'Are you sure you want to delete this real estate?' : 'هل أنت متأكد من حذف العقار؟'}</p>
            </Dialog>

            <Dialog onHide={() => setSelectedItem(null)} visible={!!selectedItem} header={lang === 'en' ? 'Real Estate Details' : 'تفاصيل العقار'} style={{ width: '50vw' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <div className={'grid'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Real Estate Name' : 'اسم العقار'}</h5>
                        <p>{selectedItem?.title}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Auto Number' : 'الرقم التلقائي'}</h5>
                        <p>{selectedItem?.autoNumber}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Real Estate Number' : 'رقم العقار'}</h5>
                        <p>{selectedItem?.realestateNumber}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Apartments Count' : 'عدد الشقق'}</h5>
                        <p>{selectedItem?.unitsNumber?.appartments || 0}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Shops Count' : 'عدد المحلات'}</h5>
                        <p>{selectedItem?.unitsNumber?.shops || 0}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Address' : 'العنوان'}</h5>
                        <p>{selectedItem?.address}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Total Units' : 'عدد الوحدات الكلي'}</h5>
                        <p>{selectedItem?.units?.length || 0}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Created At' : 'تاريخ الإنشاء'}</h5>
                        <p>{new Date(selectedItem?.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG')}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>{lang === 'en' ? 'Last Update' : 'آخر تحديث'}</h5>
                        <p>{new Date(selectedItem?.updatedAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG')}</p>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
