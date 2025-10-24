/**
 * Valider une adresse email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valider un mot de passe
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Valider un mot de passe fort
 */
export const isStrongPassword = (password) => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

/**
 * Obtenir la force d'un mot de passe (0-4)
 */
export const getPasswordStrength = (password) => {
  if (!password) return 0;
  
  let strength = 0;
  
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&#]/.test(password)) strength++;
  
  return Math.min(strength, 4);
};

/**
 * Obtenir le libellé de la force du mot de passe
 */
export const getPasswordStrengthLabel = (strength) => {
  const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  return labels[strength] || 'Très faible';
};

/**
 * Obtenir la couleur de la force du mot de passe
 */
export const getPasswordStrengthColor = (strength) => {
  const colors = ['#EF4444', '#F59E0B', '#FCD34D', '#10B981', '#059669'];
  return colors[strength] || '#EF4444';
};

/**
 * Valider un numéro de téléphone (format international)
 */
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

/**
 * Valider un nom d'utilisateur
 */
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Valider une URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valider un fichier image
 */
export const isValidImageFile = (file) => {
  if (!file) return false;
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024;
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};

/**
 * Nettoyer et valider un message
 */
export const sanitizeMessage = (message) => {
  if (!message || typeof message !== 'string') return '';
  
  let cleaned = message.trim();
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  const maxLength = 1000;
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }
  
  return cleaned;
};

/**
 * Vérifier si un message contient des liens
 */
export const containsUrl = (message) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(message);
};

/**
 * Vérifier si un message est vide
 */
export const isEmptyMessage = (message) => {
  return !message || message.trim().length === 0;
};

/**
 * Valider la taille d'un fichier
 */
export const isValidFileSize = (file, maxSizeMB = 5) => {
  if (!file) return false;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Obtenir les erreurs de validation d'un formulaire
 */
export const getFormErrors = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !value) {
      errors[field] = `${fieldRules.label || 'Ce champ'} est requis`;
    } else if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = 'Email invalide';
    } else if (fieldRules.password && !isValidPassword(value)) {
      errors[field] = 'Le mot de passe doit contenir au moins 6 caractères';
    } else if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `Minimum ${fieldRules.minLength} caractères`;
    } else if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `Maximum ${fieldRules.maxLength} caractères`;
    } else if (fieldRules.match && value !== values[fieldRules.match]) {
      errors[field] = 'Les mots de passe ne correspondent pas';
    }
  });
  
  return errors;
};