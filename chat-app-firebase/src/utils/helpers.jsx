/**
 * Fonction utilitaire pour attendre un certain temps
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Debounce - Limite l'exécution d'une fonction
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle - Limite la fréquence d'exécution d'une fonction
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Copier du texte dans le presse-papiers
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Générer un ID unique
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Vérifier si un objet est vide
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Supprimer les propriétés undefined d'un objet
 */
export const removeUndefined = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
};

/**
 * Grouper un tableau par une clé
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Supprimer les doublons d'un tableau
 */
export const unique = (array) => {
  return [...new Set(array)];
};

/**
 * Mélanger un tableau aléatoirement
 */
export const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Vérifier si c'est un environnement de développement
 */
export const isDevelopment = () => {
  return import.meta.env.MODE === 'development';
};

/**
 * Vérifier si c'est un environnement de production
 */
export const isProduction = () => {
  return import.meta.env.MODE === 'production';
};

/**
 * Logger en mode développement seulement
 */
export const devLog = (...args) => {
  if (isDevelopment()) {
    console.log(...args);
  }
};

/**
 * Formater un nombre avec des espaces
 */
export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

/**
 * Calculer le pourcentage
 */
export const percentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Limiter une valeur entre min et max
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Vérifier si le navigateur supporte une fonctionnalité
 */
export const isSupported = (feature) => {
  const features = {
    clipboard: !!navigator.clipboard,
    notification: 'Notification' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webRTC: 'RTCPeerConnection' in window
  };
  return features[feature] || false;
};

/**
 * Obtenir les paramètres de l'URL
 */
export const getUrlParams = () => {
  return Object.fromEntries(new URLSearchParams(window.location.search));
};

/**
 * Scroll vers un élément avec animation
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

/**
 * Vérifier si l'utilisateur est sur mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Obtenir la taille de l'écran
 */
export const getScreenSize = () => {
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  return 'xl';
};