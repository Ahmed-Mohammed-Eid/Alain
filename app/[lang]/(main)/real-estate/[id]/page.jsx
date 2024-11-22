import EditRealEstate from '../../../../components/Main/Real-Estate/EditRealEstate';

export default function EditRealEstatePage({ params: { lang, id } }) {
    return <EditRealEstate lang={lang} realEstateId={id} />;
}
