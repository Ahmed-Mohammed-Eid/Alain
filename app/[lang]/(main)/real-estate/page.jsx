import RealEstateList from '../../../components/Main/Real-Estate/RealEstateList';

export default function RealEstatePage({ params: { lang } }) {
    return (
        <div className="card mb-0">
            <RealEstateList lang={lang} />
        </div>
    );
}
