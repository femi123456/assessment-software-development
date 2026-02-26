import styles from './Card.module.css';

export default function Card({ title, subtitle, children, footer, className = '' }) {
    return (
        <div className={`${styles.card} ${className}`}>
            {(title || subtitle) && (
                <div className={styles.header}>
                    {title && <h3 className={styles.title}>{title}</h3>}
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
            )}
            <div className={styles.body}>
                {children}
            </div>
            {footer && <div className={styles.footer}>{footer}</div>}
        </div>
    );
}
