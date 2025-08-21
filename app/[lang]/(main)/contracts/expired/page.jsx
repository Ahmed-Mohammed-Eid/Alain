import ExpiredContractsList from '../../../../components/Main/Contracts/ExpiredContractsList';

export default function DeletedContractsPage({ params: { lang } }) {
    return (
        <div className="card mb-0">
            <ExpiredContractsList lang={lang} />
        </div>
    );
}
