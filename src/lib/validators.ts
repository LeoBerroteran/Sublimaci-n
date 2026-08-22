// Validation patterns and advanced sanity checks for human names, email, and password

export interface ValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Validates whether a string is a plausible human name or last name.
 * Detects keyboard smashing, random gibberish, non-alphabetic characters,
 * impossible consonant chains, and excessive character repetition.
 */
export function validateHumanName(value: string, fieldLabel: 'nombre' | 'apellido'): ValidationResult {
  const trimmed = value.trim();

  // 1. Mandatory presence check
  if (!trimmed) {
    return { valid: false, message: `El ${fieldLabel} es obligatorio` };
  }

  // 2. Length range check
  if (trimmed.length < 2) {
    return { valid: false, message: `El ${fieldLabel} debe tener al menos 2 letras` };
  }
  if (trimmed.length > 35) {
    return { valid: false, message: `El ${fieldLabel} no puede tener más de 35 caracteres` };
  }

  // 3. Strict alphabetic character check (letters, accents, ñ, ü, single spaces)
  const lettersOnlyRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
  if (!lettersOnlyRegex.test(trimmed)) {
    return {
      valid: false,
      message: `El ${fieldLabel} solo puede contener letras (sin números ni caracteres especiales)`,
    };
  }

  // 4. Excessive consecutive repeated characters (e.g. "aaaa", "zzzz", "ffff")
  if (/(.)\1{2,}/i.test(trimmed)) {
    return {
      valid: false,
      message: `El ${fieldLabel} contiene demasiadas letras idénticas seguidas`,
    };
  }

  // 5. Inspect individual words (e.g. for compound names like "María José" or "De La Cruz")
  const words = trimmed.split(/\s+/);
  for (const word of words) {
    // Single letter words are only valid if standard prepositions/connectors
    if (word.length === 1 && !/^[ydeaoYDEAO]$/i.test(word)) {
      return {
        valid: false,
        message: `La parte "${word}" en el ${fieldLabel} es demasiado corta`,
      };
    }

    // Must contain at least one vowel
    const hasVowels = /[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]/.test(word);
    if (!hasVowels && word.length > 1) {
      return {
        valid: false,
        message: `El ${fieldLabel} "${word}" no es válido (debe contener vocales)`,
      };
    }

    // 4 or more consecutive consonants is a clear sign of keyboard mash (e.g. "fskjd", "mncx", "dfgh")
    const tooManyConsonants = /[bcdfghjklmnñpqrstvwxyzBCDFGHJKLMNÑPQRSTVWXYZ]{4,}/i.test(word);
    if (tooManyConsonants) {
      return {
        valid: false,
        message: `El ${fieldLabel} "${word}" no parece un nombre real (demasiadas consonantes seguidas)`,
      };
    }

    // A single word in a name cannot be absurdly long
    if (word.length > 18) {
      return {
        valid: false,
        message: `El ${fieldLabel} contiene una palabra anormalmente larga`,
      };
    }
  }

  return { valid: true, message: '' };
}

export function validateName(name: string): ValidationResult {
  return validateHumanName(name, 'nombre');
}

export function validateLastName(lastName: string): ValidationResult {
  const trimmed = lastName ? lastName.trim() : '';
  if (!trimmed) {
    return { valid: false, message: 'El apellido es obligatorio' };
  }
  return validateHumanName(trimmed, 'apellido');
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email ? email.trim() : '';
  if (!trimmed) {
    return { valid: false, message: 'El correo electrónico es obligatorio' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Formato de correo electrónico inválido' };
  }
  return { valid: true, message: '' };
}

export const validations = {
  password: {
    criteria: [
      { pattern: /.{8,}/, label: 'Mínimo 8 caracteres' },
      { pattern: /[A-Z]/, label: 'Una letra mayúscula' },
      { pattern: /[a-z]/, label: 'Una letra minúscula' },
      { pattern: /\d/, label: 'Un número' },
      { pattern: /[@$!%*?&#+\-_.]/, label: 'Un carácter especial (@$!%*?&#+-_.)' },
    ],
  },
};

export function validatePassword(password: string): ValidationResult {
  if (!password || password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&#+\-_.]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    return { valid: false, message: 'La contraseña debe incluir mayúscula, minúscula, número y carácter especial' };
  }

  return { valid: true, message: '' };
}
