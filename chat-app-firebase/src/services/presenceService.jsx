import { ref, onDisconnect, set, serverTimestamp } from 'firebase/database';
import { doc, setDoc, serverTimestamp as firestoreTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Initialiser la présence d'un utilisateur
 * Cette fonction doit être appelée quand l'utilisateur se connecte
 */
export const initializePresence = async (userId) => {
  if (!userId) return;

  try {
    const presenceRef = doc(db, 'presence', userId);
    
    // Définir l'utilisateur comme en ligne
    await setDoc(presenceRef, {
      isOnline: true,
      lastSeen: firestoreTimestamp()
    });

    // Mettre à jour la présence régulièrement
    const updateInterval = setInterval(async () => {
      try {
        await setDoc(presenceRef, {
          isOnline: true,
          lastSeen: firestoreTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error('Erreur mise à jour présence:', error);
      }
    }, 60000); // Toutes les 60 secondes

    // Nettoyer l'intervalle lors de la déconnexion
    window.addEventListener('beforeunload', () => {
      clearInterval(updateInterval);
      setUserOffline(userId);
    });

    return updateInterval;
  } catch (error) {
    console.error('Erreur initialisation présence:', error);
  }
};

/**
 * Mettre l'utilisateur hors ligne
 */
export const setUserOffline = async (userId) => {
  if (!userId) return;

  try {
    const presenceRef = doc(db, 'presence', userId);
    await setDoc(presenceRef, {
      isOnline: false,
      lastSeen: firestoreTimestamp()
    });
  } catch (error) {
    console.error('Erreur mise hors ligne:', error);
  }
};

/**
 * Écouter la présence d'un utilisateur spécifique
 */
export const listenToUserPresence = (userId, callback) => {
  const presenceRef = doc(db, 'presence', userId);
  
  return onSnapshot(presenceRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback({ isOnline: false, lastSeen: null });
    }
  });
};

/**
 * Vérifier si un utilisateur est en ligne
 */
export const isUserOnline = async (userId) => {
  try {
    const presenceRef = doc(db, 'presence', userId);
    const presenceSnap = await getDoc(presenceRef);
    
    if (presenceSnap.exists()) {
      return presenceSnap.data().isOnline || false;
    }
    return false;
  } catch (error) {
    console.error('Erreur vérification présence:', error);
    return false;
  }
};