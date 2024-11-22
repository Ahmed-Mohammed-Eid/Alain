import MaintenanceList from '../../../components/Main/Maintenance/MaintenanceList/MaintenanceList';
export default function Maintenance({ params: { lang } }) {
    return (
        <div className={'card mb-0'}>
            <MaintenanceList lang={lang} />
        </div>
    );
}
