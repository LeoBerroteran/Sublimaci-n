// Validation patterns and anti-gibberish logic for Sublilove

/**
 * Checks if a string looks like random keyboard mashing or gibberish (e.g. "fsuhfdskjdskfhdskjfhdskmncx...")
 */
export function isLikelyGibberish(text: string): { isGibberish: boolean; reason: string } {
  const clean = text.trim();

  if (clean.length < 2) {
    return { isGibberish: true, reason: 'Debe tener al menos 2 caracteres' };
  }

  if (clean.length > 30) {
    return { isGibberish: true, reason: 'No puede exceder los 30 caracteres' };
  }

  // Only allowed characters (letters, accents, ñ, ü, and single spaces)
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(clean)) {
    return { isGibberish: true, reason: 'Solo se permiten letras y espacios (sin números ni símbolos)' };
  }

  const words = clean.split(/\s+/).filter(Boolean);

  for (const word of words) {
    const lowerWord = word.toLowerCase();

    if (lowerWord.length < 2) {
      return { isGibberish: true, reason: 'Cada palabra o nombre debe tener al menos 2 letras' };
    }

    if (lowerWord.length > 18) {
      return { isGibberish: true, reason: 'Ingresa un nombre real (palabra demasiado larga)' };
    }

    // Repeated characters: 3 or more identical characters in a row (e.g. aaa, fff)
    if (/(.)\1{2,}/i.test(lowerWord)) {
      return { isGibberish: true, reason: 'No se permiten caracteres repetidos consecutivamente' };
    }

    // Must contain at least one vowel
    const vowels = lowerWord.match(/[aeiouáéíóúüy]/g);
    if (!vowels || vowels.length === 0) {
      return { isGibberish: true, reason: 'Debe contener vocales válidas' };
    }

    // Vowel ratio check for words with 4+ letters
    if (lowerWord.length >= 4 && vowels.length / lowerWord.length < 0.20) {
      return { isGibberish: true, reason: 'Ingresa un nombre válido (demasiadas consonantes seguidas)' };
    }

    // 4 or more consecutive consonants (e.g. dskj, fhdsk, rtxw)
    if (/[bcdfghjklmnñpqrstvwxz]{4,}/i.test(lowerWord)) {
      return { isGibberish: true, reason: 'Ingresa un nombre válido (combinación de letras no válida)' };
    }

    // 4 or more consecutive vowels (e.g. aeiou)
    if (/[aeiouáéíóúü]{4,}/i.test(lowerWord)) {
      return { isGibberish: true, reason: 'Ingresa un nombre válido (demasiadas vocales seguidas)' };
    }

    // Common keyboard mash sequences
    const mashSequences = [
      'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl',
      'qwer', 'wert', 'erty', 'rtyu', 'tyui', 'yuio', 'uiop',
      'zxcv', 'xcvb', 'cvbn', 'vbnm',
      'qazw', 'wsxe', 'edcr', 'rfvt', 'tgbz',
      'lkjh', 'kjhg', 'jhgf', 'hgfd', 'gfds', 'fdsa',
      'poiuy', 'oiuyt', 'iuytr', 'uytre', 'ytrew', 'trewq',
    ];
    for (const seq of mashSequences) {
      if (lowerWord.includes(seq)) {
        return { isGibberish: true, reason: 'Ingresa un nombre real (no uses secuencias del teclado)' };
      }
    }
  }

  return { isGibberish: false, reason: '' };
}

export const validations = {
  name: {
    message: 'Ingresa un nombre válido (solo letras, 2 a 30 caracteres)',
  },
  lastName: {
    message: 'Ingresa un apellido válido (solo letras, 2 a 30 caracteres)',
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Formato de correo electrónico inválido',
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

export function validateName(name: string): { valid: boolean; message: string } {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return { valid: false, message: 'El nombre es obligatorio' };
  }
  const check = isLikelyGibberish(trimmed);
  if (check.isGibberish) {
    return { valid: false, message: check.reason };
  }
  return { valid: true, message: '' };
}

export function validateLastName(lastName: string): { valid: boolean; message: string } {
  const trimmed = (lastName || '').trim();
  if (!trimmed) {
    return { valid: false, message: 'El apellido es obligatorio' };
  }
  const check = isLikelyGibberish(trimmed);
  if (check.isGibberish) {
    return { valid: false, message: check.reason };
  }
  return { valid: true, message: '' };
}

export function validateEmail(email: string): { valid: boolean; message: string } {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return { valid: false, message: 'El correo electrónico es obligatorio' };
  }
  const valid = validations.email.pattern.test(trimmed);
  return { valid, message: valid ? '' : validations.email.message };
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  const valid = validations.password.pattern.test(password || '');
  return { valid, message: valid ? '' : validations.password.message };
}
