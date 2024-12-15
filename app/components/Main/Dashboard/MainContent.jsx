import Image from 'next/image';
import classes from './MainContent.module.scss';

export default function MainContent() {
    return (
        <div className="flex flex-column align-items-center justify-content-center h-screen card mb-0 ">
            <h1>We Are working on it, please wait</h1>
            <div className={classes.imageContainer}>
                <Image src="/assets/development.png" alt="loading" width={500} height={500} responsive />
            </div>
        </div>
    );
}
