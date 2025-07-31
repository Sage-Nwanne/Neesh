import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  variant = 'primary',
  size = 'medium',
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
