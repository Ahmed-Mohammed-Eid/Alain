import ContractsEditForm from '../../../../components/Main/Contracts/ContractsEditForm';

export default function ContractsEditPage({ params: { lang, id } }) {
    return <ContractsEditForm lang={lang} contractId={id} />;
}
