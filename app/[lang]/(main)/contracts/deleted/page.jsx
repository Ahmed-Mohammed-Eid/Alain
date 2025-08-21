import DeletedContractsList from '../../../../components/Main/Contracts/DeletedContractsList';

export default function DeletedContractsPage({ params: { lang } }) {
    return (
        <div className="card mb-0">
            <DeletedContractsList lang={lang} />
        </div>
    );
}
