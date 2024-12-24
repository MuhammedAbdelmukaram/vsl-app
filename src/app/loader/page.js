import React from 'react';
import styles from './loader.module.css';

const Page = () => {
    return (
        <div className={styles.loader}>
            <div className={styles.ring}></div>
        </div>
    );
};

export default Page;
