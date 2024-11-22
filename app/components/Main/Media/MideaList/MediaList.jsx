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

export default function MediaList({ lang }) {
    //ROUTER
    const router = useRouter();

    //STATE FOR THE MEDIA
    const [media, setMedia] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [mediaIdToDelete, setMediaIdToDelete] = React.useState(null);

    // TRANSLATIONS
    const translations = {
        en: {
            noMedia: 'No media found.',
            image: 'Image',
            name: 'Name',
            type: 'Type',
            link: 'Link',
            sectionId: 'Section ID',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete',
            deleteMedia: 'Delete Media',
            deleteConfirm: 'Are you sure you want to delete this media?',
            deleteSuccess: 'Media deleted successfully.',
            deleteError: 'An error occurred while deleting the media.',
            fetchError: 'An error occurred while fetching media.',
            imageType: 'Image',
            videoType: 'Video',
            fileType: 'File'
        },
        ar: {
            noMedia: 'لم يتم العثور على وسائط.',
            image: 'الصورة',
            name: 'الاسم',
            type: 'النوع',
            link: 'الرابط',
            sectionId: 'معرف القسم',
            actions: 'الإجراءات',
            edit: 'تعديل',
            delete: 'حذف',
            deleteMedia: 'حذف الوسائط',
            deleteConfirm: 'هل أنت متأكد من حذف الوسائط؟',
            deleteSuccess: 'تم حذف الوسائط بنجاح.',
            deleteError: 'حدث خطأ ما أثناء حذف الوسائط.',
            fetchError: 'حدث خطأ ما أثناء جلب الوسائط.',
            imageType: 'صورة',
            videoType: 'فيديو',
            fileType: 'ملف'
        }
    };

    const t = translations[lang];
    const isRTL = lang === 'ar';

    // GET THE MEDIA FROM THE API
    function getMedia() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios
            .get(`${process.env.API_URL}/get/all/media`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                // Update the state
                setMedia(res.data?.media || []);
                console.log(res.data);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t.fetchError);
            });
    }

    // EFFECT TO GET THE MEDIA
    useEffect(() => {
        getMedia();
    }, []);

    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        await axios
            .delete(`${process.env.API_URL}/delete/media`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    mediaId: mediaIdToDelete
                }
            })
            .then((_) => {
                // Show notification
                toast.success(t.deleteSuccess);
                // Hide the dialog
                setVisible(false);
                // Update the State
                getMedia();
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || t.deleteError);
            });
    };

    const footerContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button
                label="Yes"
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
                value={media || []}
                style={{ width: '100%', direction: isRTL ? 'rtl' : 'ltr' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={t.noMedia}
            >
                <Column
                    field="mediaPath"
                    header={t.image}
                    width="100px"
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center">
                                <Image
                                    src={rowData?.mediaType === 'image' ? rowData?.mediaPath : '/not-found.jpg'}
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

                <Column field="title" header={t.name} sortable filter />

                <Column
                    field="mediaType"
                    header={t.type}
                    sortable
                    filter
                    body={(rowData) => {
                        return <div>{rowData?.mediaType === 'image' ? t.imageType : rowData?.mediaType === 'video' ? t.videoType : t.fileType}</div>;
                    }}
                />

                <Column
                    field="mediaPath"
                    header={t.link}
                    sortable
                    filter
                    body={(rowData) => {
                        return (
                            <Image
                                src="/link.svg"
                                alt="link"
                                width={18}
                                height={18}
                                className={isRTL ? 'mr-4' : 'ml-4'}
                                onClick={() => {
                                    window.open(rowData?.mediaPath, '_blank');
                                }}
                                style={{
                                    userSelect: 'none',
                                    cursor: 'pointer',
                                    color: '#007bff'
                                }}
                            />
                        );
                    }}
                />

                <Column field="sectionId.title" header={t.sectionId} sortable filter />

                <Column
                    field={'_id'}
                    header={t.actions}
                    style={{ width: '20%' }}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => {
                                        router.push(`/media/${rowData._id}`);
                                    }}
                                >
                                    {t.edit}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                        setVisible(true);
                                        setMediaIdToDelete(rowData._id);
                                    }}
                                >
                                    {t.delete}
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog header={t.deleteMedia} visible={visible} position={'top'} style={{ width: '90%', maxWidth: '650px', direction: isRTL ? 'rtl' : 'ltr' }} onHide={() => setVisible(false)} footer={footerContent} draggable={false} resizable={false}>
                <p className="m-0">{t.deleteConfirm}</p>
            </Dialog>
        </>
    );
}
