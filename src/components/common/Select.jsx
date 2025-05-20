import styles from './Select.module.css';

const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  required = false,
  error
}) => {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`${styles.select} ${error ? styles.selectError : ''}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default Select;