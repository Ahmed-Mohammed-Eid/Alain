import MarketingList from '../../../components/Main/Marketing/MarketingList';

export default function MarketingPage({ params: { lang } }) {
    return (
        <div className="card mb-0">
            <MarketingList lang={lang} />
        </div>
    );
}
