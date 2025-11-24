export default function Modal({ id, isOpen, onClose, title, children, footer, size = 'md', className = '', ...props }) {
    const sizes = {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        full: 'max-w-full',
    };

    const handleClose = (e) => {
        if (onClose) {
            if (typeof onClose === 'function') {
                onClose(e);
            } else {
                onClose();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <input 
                type="checkbox" 
                id={id} 
                className="modal-toggle" 
                checked={isOpen} 
                onChange={(e) => {
                    if (!e.target.checked && onClose) {
                        handleClose(e);
                    }
                }} 
            />
            <div className="modal" role="dialog">
                <div className={`modal-box ${sizes[size]} ${className}`.trim()} {...props}>
                    {title && <h3 className="mb-4 text-lg font-bold">{title}</h3>}
                    <div>{children}</div>
                    {footer && <div className="modal-action">{footer}</div>}
                </div>
                <label className="modal-backdrop" htmlFor={id} onClick={handleClose}>
                    Close
                </label>
            </div>
        </>
    );
}
