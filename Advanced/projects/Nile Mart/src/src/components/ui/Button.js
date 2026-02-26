export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    className,
    disabled,
    ...props
}) {
    return (
        <button
            className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${className || ''}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <i className="ri-loader-4-line ri-spin"></i>}
            {icon && !loading && <i className={icon}></i>}
            {children}
        </button>
    );
}
