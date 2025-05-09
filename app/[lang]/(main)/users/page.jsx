import UserList from '../../../components/Main/Users/UserList/UserList.jsx';

export default function UsersPage({ params: { lang } }) {
    return (
        <div className={'card mb-0'}>
            <UserList lang={lang} />
        </div>
    );
}