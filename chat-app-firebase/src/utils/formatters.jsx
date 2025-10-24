import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formater un timestamp en temps relatif (ex: "il y a 5 minutes")
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';

  try {
    // Convertir le timestamp Firestore en Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: fr
    });
  } catch (error) {
    console.error('Erreur formatage temps relatif:', error);
    return '';
  }
};

/**
 * Formater une date complète (ex: "12 janvier 2025 à 14:30")
 */
export const formatFullDate = (timestamp) => {
  if (!timestamp) return '';

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr });
  } catch (error) {
    console.error('Erreur formatage date complète:', error);
    return '';
  }
};

/**
 * Formater l'heure seulement (ex: "14:30")
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'HH:mm');
  } catch (error) {
    console.error('Erreur formatage heure:', error);
    return '';
  }
};

/**
 * Formater la date pour les messages (ex: "Aujourd'hui", "Hier", ou "12 janvier")
 */
export const formatMessageDate = (timestamp) => {
  if (!timestamp) return '';

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'd MMMM', { locale: fr });
    }
  } catch (error) {
    console.error('Erreur formatage date message:', error);
    return '';
  }
};

/**
 * Formater le dernier message d'une conversation
 */
export const formatLastMessageTime = (timestamp) => {
  if (!timestamp) return '';

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'd MMM', { locale: fr });
    }
  } catch (error) {
    console.error('Erreur formatage dernier message:', error);
    return '';
  }
};

/**
 * Tronquer un texte long
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formater un numéro de téléphone
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Exemple simple pour numéros français
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  }
  
  return phoneNumber;
};

/**
 * Capitaliser la première lettre
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Obtenir les initiales d'un nom
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Générer une couleur aléatoire basée sur un ID
 */
export const getColorFromId = (id) => {
  if (!id) return '#6B7280';
  
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'
  ];
  
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};