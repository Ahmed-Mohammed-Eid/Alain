import AppConfig from '../../../layout/AppConfig';
import React from 'react';
import { getDictionary } from '../../dictionaries/dictionaries';

export const metadata = {
    title: 'EasyDiet - Login',
    description: 'EasyDiet - Login',
};

export default async function SimpleLayout({ children, params: {lang} }) {
    const dictionary = await getDictionary(lang)

    return (
        <React.Fragment>
            {children}
            <AppConfig simple dictionary={dictionary} lang={lang} />
        </React.Fragment>
    );
}
