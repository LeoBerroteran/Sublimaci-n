// Validation patterns for registration form
export const validations = {
  name: {
    pattern: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,50}$/,
    message: 'Solo letras y espacios, entre 2 y 50 caracteres',
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Formato de email inválido',
  },
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_.])[A-Za-z\d@$!%*?&#+\-_.]{8,}$/,
    message: 'Mínimo 8 caracteres con mayúscula, minúscula, número y carácter especial',
    criteria: [
      { pattern: /.{8,}/, label: 'Mínimo 8 caracteres' },
      { pattern: /[A-Z]/, label: 'Una letra mayúscula' },
      { pattern: /[a-z]/, label: 'Una letra minúscula' },
      { pattern: /\d/, label: 'Un número' },
      { pattern: /[@$!%*?&#+\-_.]/, label: 'Un carácter especial (@$!%*?&#+-_.)' },
    ],
  },
};

export function validateField(
  fieldName: keyof typeof validations,
  value: string
): { valid: boolean; message: string } {
  const rule = validations[fieldName];
  if (!rule) return { valid: true, message: '' };
  const valid = rule.pattern.test(value);
  return { valid, message: valid ? '' : rule.message };
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  return validateField('password', password);
}
