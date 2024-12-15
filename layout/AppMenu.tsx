/* eslint-disable @next/next/no-img-element */

import React, { ReactNode } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';

type ChildContainerProps = {
    children: ReactNode;
    dictionary: any;
    lang: string;
};

const AppMenu = ({ dictionary, lang }: ChildContainerProps) => {
    const model: AppMenuItem[] = [
        {
            label: dictionary.sidebar.home.title,
            items: [{ label: dictionary.sidebar.home.dashboard, icon: 'pi pi-fw pi-home', to: `/${lang}/` }]
        },
        // {
        //     label: lang === 'en' ? 'Sections' : 'الأقسام',
        //     items: [
        //         { label: lang === 'en' ? 'Sections List' : 'قائمة الأقسام', icon: 'pi pi-fw pi-list', to: `/${lang}/sections` },
        //         { label: lang === 'en' ? 'Add Section' : 'إضافة قسم', icon: 'pi pi-fw pi-plus', to: `/${lang}/sections/create` }
        //     ]
        // },
        // {
        //     label: lang === 'en' ? 'Files' : 'الملفات',
        //     items: [
        //         { label: lang === 'en' ? 'Files List' : 'قائمة الملفات', icon: 'pi pi-fw pi-list', to: `/${lang}/media` },
        //         { label: lang === 'en' ? 'Add File' : 'إضافة ملف', icon: 'pi pi-fw pi-plus', to: `/${lang}/media/create` }
        //     ]
        // },
        {
            label: lang === 'en' ? 'Maintenance' : 'الصيانة',
            items: [{ label: lang === 'en' ? 'Maintenance List' : 'قائمة الصيانات', icon: 'pi pi-fw pi-list', to: `/${lang}/maintenance` }]
        },
        {
            // Real-Estate
            label: lang === 'en' ? 'Real-Estate' : 'العقارات',
            items: [
                { label: lang === 'en' ? 'Real-Estate List' : 'قائمة العقارات', icon: 'pi pi-fw pi-list', to: `/${lang}/real-estate` },
                { label: lang === 'en' ? 'Add Real-Estate' : 'إضافة عقار', icon: 'pi pi-fw pi-plus', to: `/${lang}/real-estate/create` }
            ]
        },
        {
            label: lang === 'en' ? 'Units' : 'الوحدات',
            items: [{ label: lang === 'en' ? 'Units List' : 'قائمة الوحدات', icon: 'pi pi-fw pi-list', to: `/${lang}/units` }]
        },
        {
            label: lang === 'en' ? 'Services' : 'الخدمات',
            items: [
                { label: lang === 'en' ? 'Services List' : 'قائمة الخدمات', icon: 'pi pi-fw pi-list', to: `/${lang}/services` },
                { label: lang === 'en' ? 'Add Service' : 'إضافة خدمة', icon: 'pi pi-fw pi-plus', to: `/${lang}/services/create` }
            ]
        },
        {
            label: lang === 'en' ? 'Contracts' : 'العقود',
            items: [
                { label: lang === 'en' ? 'Contracts List' : 'قائمة العقود', icon: 'pi pi-fw pi-list', to: `/${lang}/contracts` },
                { label: lang === 'en' ? 'Add Contract' : 'إضافة عقد', icon: 'pi pi-fw pi-plus', to: `/${lang}/contracts/create` }
            ]
        },
        {
            label: lang === 'en' ? 'Marketing' : 'التسويق',
            items: [{ label: lang === 'en' ? 'Marketing List' : 'قائمة التسويق', icon: 'pi pi-fw pi-list', to: `/${lang}/marketing` }]
        },
        {
            label: lang === 'en' ? 'Transactions' : 'المعاملات',
            items: [{ label: lang === 'en' ? 'Transactions List' : 'قائمة المعاملات', icon: 'pi pi-fw pi-list', to: `/${lang}/transactions` }]
        },
        // {
        //     label: lang === 'en' ? 'Reports' : 'التقارير',
        //     icon: 'pi pi-fw pi-chart-bar',
        //     items: [{ label: lang === 'en' ? 'Reports List' : 'قائمة التقارير', icon: 'pi pi-fw pi-list', to: `/${lang}/reports` }]
        // },
        {
            label: dictionary.sidebar.settings.title,
            items: [
                {
                    label: dictionary.sidebar.settings.logout,
                    icon: lang === 'en' ? 'pi pi-sign-out' : 'pi pi-sign-in',
                    to: '/auth/login',
                    command: () => {
                        // Clear local storage
                        localStorage.clear();
                        // Clear Cookies
                        document.cookie.split(';').forEach((c) => {
                            document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
                        });
                        // Redirect to login page
                        window.location.href = '/auth/login';
                    }
                }
            ]
        }
    ];

    return (
        <MenuProvider dictionary={dictionary} lang={lang}>
            <ul className="layout-menu" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem lang={lang} item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
