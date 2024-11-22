// COMPONENTS
import EditSection from '../../../../components/Main/Sections/EditSection/EditSection';

export default async function EditSectionPage({ params: { lang, id } }) {
    // DYNAMIC ROUTE

    return <EditSection sectionId={id} lang={lang} />;
}
