import styles from "./testimonialSection.module.css";

const TestimonialSection = () => {
    return (
        <section className={styles.testimonialSection}>
            <h2 className={styles.subtitle}>WHAT OTHERS SAY?</h2>
            <h1 className={styles.title}>Don’t take our word. Take theirs!</h1>

            <div className={styles.imageContainer}>
                <div className={styles.placeholder}></div>
                <div className={styles.placeholder}></div>
                <div className={styles.placeholder}></div>
                <div className={styles.placeholder}></div>
                <div className={styles.placeholder}></div>
                <div className={styles.placeholder}></div>

            </div>

            <div className={styles.testimonials}>
                {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.top}>


                            <p className={styles.role}>MARKETER</p>
                            <p className={styles.date}>7 days ago</p>
                        </div>
                        <p className={styles.text}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                        <div className={styles.profile}>
                            <div className={styles.avatar}></div>
                            <div>
                                <p className={styles.name}>Maria Reed, Alex Backer</p>
                                <p className={styles.company}>CEO of TikTok, CTO of Facebook</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className={styles.footerText}>Over 500+ Happy Users</p>
        </section>
    );
};

export default TestimonialSection;
