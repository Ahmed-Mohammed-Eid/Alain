import EditAssessments from '../../../../components/Main/Assessments/EditAssessment/EditAssessment';

export default function AssessmentEdit({ params: { lang, id } }) {
    return <EditAssessments assessmentsId={id} lang={lang} />;
}
