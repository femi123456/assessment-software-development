import styles from './Input.module.css';

export default function Input({ label, helperText, error, className, ...props }) {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
                {...props}
            />
            {error && <p className={styles.errorText}>{error}</p>}
            {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
        </div>
    );
}
