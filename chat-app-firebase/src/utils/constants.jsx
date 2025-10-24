// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CHAT: '/chat',
  PROFILE: '/profile',
  NOT_FOUND: '*'
};

// ============================================
// MESSAGES
// ============================================

export const MESSAGE_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
};

export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_MESSAGES_DISPLAY = 50;

// ============================================
// AUTHENTIFICATION
// ============================================

export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  PHONE: 'phone',
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  GITHUB: 'github',
  ANONYMOUS: 'anonymous'
};

export const PASSWORD_MIN_LENGTH = 6;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

// ============================================
// FICHIERS ET IMAGES
// ============================================

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes
export const MAX_FILE_SIZE_MB = 5;

// ============================================
// PRÉSENCE
// ============================================

export const PRESENCE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away'
};

export const PRESENCE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// ============================================
// UI
// ============================================

export const TOAST_DURATION = 3000; // 3 secondes
export const ANIMATION_DURATION = 300; // 300ms

export const AVATAR_COLORS = [
  '#EF4444', // Rouge
  '#F59E0B', // Orange
  '#10B981', // Vert
  '#3B82F6', // Bleu
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Rose
  '#14B8A6'  // Teal
];

// ============================================
// PAGINATION
// ============================================

export const ITEMS_PER_PAGE = 20;
export const USERS_PER_PAGE = 10;

// ============================================
// MESSAGES D'ERREUR
// ============================================

export const ERROR_MESSAGES = {
  NETWORK: 'Erreur de connexion réseau',
  UNAUTHORIZED: 'Vous devez être connecté pour effectuer cette action',
  PERMISSION_DENIED: 'Vous n\'avez pas la permission d\'effectuer cette action',
  NOT_FOUND: 'Ressource introuvable',
  SERVER_ERROR: 'Une erreur serveur est survenue',
  INVALID_INPUT: 'Données invalides',
  FILE_TOO_LARGE: `La taille du fichier ne doit pas dépasser ${MAX_FILE_SIZE_MB}MB`,
  INVALID_FILE_TYPE: 'Type de fichier non supporté',
  EMAIL_NOT_VERIFIED: 'Veuillez vérifier votre email avant de continuer'
};

// ============================================
// MESSAGES DE SUCCÈS
// ============================================

export const SUCCESS_MESSAGES = {
  LOGIN: 'Connexion réussie',
  REGISTER: 'Inscription réussie ! Vérifiez votre email',
  LOGOUT: 'Déconnexion réussie',
  MESSAGE_SENT: 'Message envoyé',
  MESSAGE_DELETED: 'Message supprimé',
  PROFILE_UPDATED: 'Profil mis à jour',
  PHOTO_UPLOADED: 'Photo de profil mise à jour',
  PHOTO_DELETED: 'Photo de profil supprimée'
};

// ============================================
// PLACEHOLDERS
// ============================================

export const PLACEHOLDERS = {
  EMAIL: 'exemple@email.com',
  PASSWORD: '••••••••',
  USERNAME: 'Nom d\'utilisateur',
  MESSAGE: 'Tapez votre message...',
  PHONE: '+33 6 12 34 56 78',
  SEARCH: 'Rechercher...'
};

// ============================================
// CONFIGURATIONS
// ============================================

export const APP_CONFIG = {
  NAME: 'Chat App',
  VERSION: '1.0.0',
  DESCRIPTION: 'Application de chat en ligne sécurisée',
  SUPPORT_EMAIL: 'support@chatapp.com'
};

// ============================================
// DÉLAIS
// ============================================

export const DEBOUNCE_DELAY = 300; // ms
export const THROTTLE_DELAY = 1000; // ms
export const AUTO_SAVE_DELAY = 2000; // ms

// ============================================
// FORMATS DE DATE
// ============================================

export const DATE_FORMATS = {
  FULL: "d MMMM yyyy 'à' HH:mm",
  DATE_ONLY: 'd MMMM yyyy',
  TIME_ONLY: 'HH:mm',
  SHORT: 'd MMM'
};

// ============================================
// CODES D'ERREUR FIREBASE
// ============================================

export const FIREBASE_ERROR_CODES = {
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  INVALID_EMAIL: 'auth/invalid-email',
  WEAK_PASSWORD: 'auth/weak-password',
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  POPUP_CLOSED: 'auth/popup-closed-by-user',
  ACCOUNT_EXISTS: 'auth/account-exists-with-different-credential'
};