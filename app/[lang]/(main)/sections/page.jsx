import SectionsList from '../../../components/Main/Sections/SectionsList/SectionsList';

export default function Sections({ params: { lang } }) {
    return (
        <div className={'card mb-0'}>
            <SectionsList lang={lang} />
        </div>
    );
}
