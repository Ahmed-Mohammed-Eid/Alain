import ServicesList from '../../../components/Main/Services/ServicesList';

export default function ServicesPage({ params: { lang } }) {
    return (
        <div className="card mb-0">
            <ServicesList lang={lang} />
        </div>
    );
}
