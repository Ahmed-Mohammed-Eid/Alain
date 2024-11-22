import EditService from '../../../../components/Main/Services/EditService';

export default function EditServicePage({ params: { lang, id } }) {
    return <EditService lang={lang} serviceId={id} />;
}
