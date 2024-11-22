import React from 'react';
import ReportsContent from '../../../components/Main/Reports/ReportsContent';

export default function ReportsPage({params: {lang}}) {
    return (
        <ReportsContent lang={lang} />
    );
}