import AssessmentsList from '../../../components/Main/Assessments/AssessmentsList/AssessmentsList';

export default function Assessments({ params: { lang } }) {
    return (
        <div className={'card mb-0'}>
            <AssessmentsList lang={lang} />
        </div>
    );
}
