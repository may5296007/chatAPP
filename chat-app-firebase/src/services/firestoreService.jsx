import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  where
} from 'firebase/firestore';
import { db } from './firebase';

// ============================================
// MESSAGES PUBLICS (CHAT DE GROUPE)
// ============================================

/**
 * Envoyer un message dans le chat public
 */
export const sendPublicMessage = async (senderId, senderName, text, senderPhotoURL = null) => {
  try {
    const messagesRef = collection(db, 'messages');
    await addDoc(messagesRef, {
      senderId,
      senderName,
      senderPhotoURL,
      text,
      timestamp: serverTimestamp(),
      type: 'public'
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur envoi message public:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Écouter les messages publics en temps réel
 */
export const listenToPublicMessages = (callback, messageLimit = 50) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    orderBy('timestamp', 'desc'),
    limit(messageLimit)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    // Inverser pour afficher du plus ancien au plus récent
    callback(messages.reverse());
  }, (error) => {
    console.error('Erreur écoute messages publics:', error);
  });
};

/**
 * Supprimer un message public (uniquement par l'auteur)
 */
export const deletePublicMessage = async (messageId, userId) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    const messageDoc = await getDoc(messageRef);

    if (!messageDoc.exists()) {
      return { success: false, error: 'Message introuvable' };
    }

    const messageData = messageDoc.data();
    if (messageData.senderId !== userId) {
      return { success: false, error: 'Non autorisé' };
    }

    await deleteDoc(messageRef);
    return { success: true };
  } catch (error) {
    console.error('Erreur suppression message:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// MESSAGES PRIVÉS (CHAT 1 À 1)
// ============================================

/**
 * Créer ou récupérer une conversation privée
 */
export const getOrCreateConversation = async (user1Id, user2Id) => {
  try {
    // Créer un ID unique pour la conversation (ordre alphabétique)
    const conversationId = [user1Id, user2Id].sort().join('_');
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationDoc = await getDoc(conversationRef);

    if (!conversationDoc.exists()) {
      // Créer la conversation
      await setDoc(conversationRef, {
        participants: [user1Id, user2Id],
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp()
      });
    }

    return { success: true, conversationId };
  } catch (error) {
    console.error('Erreur création conversation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envoyer un message privé
 */
export const sendPrivateMessage = async (conversationId, senderId, senderName, text, senderPhotoURL = null) => {
  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesRef, {
      senderId,
      senderName,
      senderPhotoURL,
      text,
      timestamp: serverTimestamp(),
      read: false
    });

    // Mettre à jour la date du dernier message
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessageAt: serverTimestamp(),
      lastMessage: text
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur envoi message privé:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Écouter les messages privés en temps réel
 */
export const listenToPrivateMessages = (conversationId, callback, messageLimit = 50) => {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(
    messagesRef,
    orderBy('timestamp', 'desc'),
    limit(messageLimit)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(messages.reverse());
  }, (error) => {
    console.error('Erreur écoute messages privés:', error);
  });
};

/**
 * Récupérer toutes les conversations d'un utilisateur
 */
export const getUserConversations = async (userId) => {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const conversations = [];

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // Trouver l'autre participant
      const otherUserId = data.participants.find(id => id !== userId);
      
      // Récupérer les infos de l'autre utilisateur
      const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
      const otherUser = otherUserDoc.exists() ? otherUserDoc.data() : null;

      conversations.push({
        id: docSnapshot.id,
        ...data,
        otherUser
      });
    }

    return { success: true, conversations };
  } catch (error) {
    console.error('Erreur récupération conversations:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// GESTION DES UTILISATEURS
// ============================================

/**
 * Récupérer tous les utilisateurs (sauf l'utilisateur actuel)
 */
export const getAllUsers = async (currentUserId) => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const users = [];
    snapshot.forEach((doc) => {
      if (doc.id !== currentUserId) {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });

    return { success: true, users };
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Récupérer un utilisateur par son ID
 */
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    return {
      success: true,
      user: { id: userDoc.id, ...userDoc.data() }
    };
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Mettre à jour le profil utilisateur
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// PRÉSENCE DES UTILISATEURS
// ============================================

/**
 * Écouter la présence de tous les utilisateurs
 */
export const listenToUsersPresence = (callback) => {
  const presenceRef = collection(db, 'presence');
  
  return onSnapshot(presenceRef, (snapshot) => {
    const presenceData = {};
    snapshot.forEach((doc) => {
      presenceData[doc.id] = doc.data();
    });
    callback(presenceData);
  }, (error) => {
    console.error('Erreur écoute présence:', error);
  });
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
      callback({ isOnline: false });
    }
  }, (error) => {
    console.error('Erreur écoute présence utilisateur:', error);
  });
};