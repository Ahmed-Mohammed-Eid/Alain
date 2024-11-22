import MediaList from '../../../components/Main/Media/MideaList/MediaList';

export default function Media({ params: { lang } }) {
    return (
        <div className={'card mb-0'}>
            <MediaList lang={lang} />
        </div>
    );
}
