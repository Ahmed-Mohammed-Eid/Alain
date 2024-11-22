'use client';
import React, { useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Image from 'next/image';
import isValidURL from '../../../../../helpers/isValidImageUrl';

export default function SectionsList({ lang }) {
    //ROUTER
    const router = useRouter();

    //STATE FOR THE SECTIONS
    const [sections, setSections] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [detailsVisible, setDetailsVisible] = React.useState(false);
    const [sectionIdToDelete, setSectionIdToDelete] = React.useState(null);
    const [selectedSection, setSelectedSection] = React.useState(null);

    // GET THE SECTIONS FROM THE API
    function getSections() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/sections`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                // Update the state
                setSections(res.data?.sections || []);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'An error occurred while getting the sections.');
            });
    }

    // EFFECT TO GET THE SECTIONS
    useEffect(() => {
        getSections();
    }, []);

    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        await axios
            .delete(`${process.env.API_URL}/delete/section`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    sectionId: sectionIdToDelete
                }
            })
            .then((_) => {
                // Show notification
                toast.success(lang === 'en' ? 'Section Deleted Successfully' : 'تم حذف القسم بنجاح');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getSections();
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || (lang === 'en' ? 'An error occurred while deleting the section.' : 'حدث خطأ أثناء حذف القسم.'));
            });
    };

    const footerContent = (
        <div>
            <Button label={lang === 'en' ? 'No' : 'لا'} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button
                label={lang === 'en' ? 'Yes' : 'نعم'}
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
                value={sections || []}
                style={{ width: '100%' }}
                paginator={true}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={lang === 'en' ? 'No sections found.' : 'لا يوجد أقسام.'}
            >
                <Column
                    field="image"
                    header={lang === 'en' ? 'Image' : 'الصورة'}
                    width="100px"
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center">
                                <Image
                                    src={rowData?.image || '/not-found.jpg'}
                                    alt={rowData?.title}
                                    width={50}
                                    height={50}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        border: '1px solid #ccc'
                                    }}
                                />
                            </div>
                        );
                    }}
                />

                <Column field="title" header={lang === 'en' ? 'Section Name' : 'اسم القسم'} sortable filter style={{ width: '70%' }} />

                <Column
                    field={'_id'}
                    header={lang === 'en' ? 'Actions' : 'الإجراءات'}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => {
                                        setDetailsVisible(true);
                                        setSelectedSection(rowData);
                                    }}
                                >
                                    {lang === 'en' ? 'View Details' : 'عرض التفاصيل'}
                                </button>
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => {
                                        router.push(`/${lang}/sections/${rowData._id}`);
                                    }}
                                >
                                    {lang === 'en' ? 'Edit' : 'تعديل'}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                        setVisible(true);
                                        setSectionIdToDelete(rowData._id);
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
                header={lang === 'en' ? 'Delete Section' : 'حذف القسم'}
                visible={visible}
                position={'top'}
                style={{ width: '90%', maxWidth: '650px' }}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <p className="m-0">{lang === 'en' ? 'Are you sure you want to delete this section?' : 'هل أنت متأكد من حذف القسم؟'}</p>
            </Dialog>

            <Dialog
                header={lang === 'en' ? 'Details' : 'التفاصيل'}
                visible={detailsVisible}
                position={'center'}
                style={{ width: '90%', maxWidth: '650px' }}
                onHide={() => setDetailsVisible(false)}
                draggable={false}
                resizable={false}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <div className={'flex flex-column'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="field col-12 relative">
                        <h4>{lang === 'en' ? 'Section Image' : 'صورة القسم'}</h4>
                        <Image src={selectedSection?.image || '/not-found.jpg'} alt={selectedSection?.title} width={600} height={300} style={{ width: '100%', objectFit: 'contain' }} />
                    </div>
                    <div className="field col-12 relative">
                        <h4>{lang === 'en' ? 'Section Name' : 'اسم القسم'}</h4>
                        <p>{selectedSection?.title}</p>
                    </div>
                    <div className="field col-12">
                        <h4>{lang === 'en' ? 'Files' : 'الملفات'}</h4>
                        <div className="flex flex-row flex-wrap gap-2">
                            {selectedSection?.sectionMedia?.map((file, index) => {
                                return (
                                    <Image
                                        width={100}
                                        height={100}
                                        key={index}
                                        src={isValidURL(file.mediaPath) ? file.mediaPath : '/not-found.jpg'}
                                        alt={file}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
