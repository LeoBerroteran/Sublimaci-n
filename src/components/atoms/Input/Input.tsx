import React, { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={`${styles.container} ${className}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label} {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          {...props}
        />
        <div className={styles.errorSlot} aria-live="polite">
          {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
