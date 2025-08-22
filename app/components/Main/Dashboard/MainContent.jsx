import Image from 'next/image';
import classes from './MainContent.module.scss';

export default function MainContent() {
    return (
        <div className="flex flex-column align-items-center justify-content-center h-screen card mb-0 ">
            <div className={classes.imageContainer}>
                <Image src="/assets/logo-transparent.png" alt="loading" width={360} height={360} responsive />
            </div>
        </div>
    );
}
