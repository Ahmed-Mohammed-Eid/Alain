import EditMedia from '../../../../components/Main/Media/EditMedia/EditMedia';

export default async function EditMediaPage({ params: { lang, id } }) {
    return <EditMedia mediaId={id} lang={lang} />;
}
