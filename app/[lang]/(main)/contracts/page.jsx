import ContractsList from '../../../components/Main/Contracts/ContractsList';

export default function ContractsPage({ params: { lang } }) {
    return (
        <div className="card mb-0">
            <ContractsList lang={lang} />
        </div>
    );
}
