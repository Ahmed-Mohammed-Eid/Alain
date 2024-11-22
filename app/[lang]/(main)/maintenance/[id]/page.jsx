import EditMaintenances from '../../../../components/Main/Maintenance/EditMaintenance/EditMaintenance';

export default function MaintenanceEDIT({ params }) {
    // DYNAMIC ROUTE
    const { id, lang } = params;

    return (
        <>
            <EditMaintenances maintenancesId={id} lang={lang} />
        </>
    );
}
