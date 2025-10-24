import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as firestoreService from '../services/firestoreService';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat doit être utilisé dans un ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  
  // États pour le chat public
  const [publicMessages, setPublicMessages] = useState([]);
  const [loadingPublicMessages, setLoadingPublicMessages] = useState(true);

  // États pour les chats privés
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [loadingPrivateMessages, setLoadingPrivateMessages] = useState(false);

  // État pour la présence des utilisateurs
  const [usersPresence, setUsersPresence] = useState({});

  // État pour la liste des utilisateurs
  const [allUsers, setAllUsers] = useState([]);

  // ============================================
  // ÉCOUTE DES MESSAGES PUBLICS EN TEMPS RÉEL
  // ============================================
  useEffect(() => {
    if (!currentUser) {
      setPublicMessages([]);
      setLoadingPublicMessages(false);
      return;
    }

    setLoadingPublicMessages(true);
    const unsubscribe = firestoreService.listenToPublicMessages((messages) => {
      setPublicMessages(messages);
      setLoadingPublicMessages(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // ============================================
  // ÉCOUTE DE LA PRÉSENCE DES UTILISATEURS
  // ============================================
  useEffect(() => {
    if (!currentUser) {
      setUsersPresence({});
      return;
    }

    const unsubscribe = firestoreService.listenToUsersPresence((presence) => {
      setUsersPresence(presence);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // ============================================
  // CHARGER LES CONVERSATIONS DE L'UTILISATEUR
  // ============================================
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      return;
    }

    const loadConversations = async () => {
      const result = await firestoreService.getUserConversations(currentUser.uid);
      if (result.success) {
        setConversations(result.conversations);
      }
    };

    loadConversations();
  }, [currentUser]);

  // ============================================
  // CHARGER TOUS LES UTILISATEURS
  // ============================================
  useEffect(() => {
    if (!currentUser) {
      setAllUsers([]);
      return;
    }

    const loadUsers = async () => {
      const result = await firestoreService.getAllUsers(currentUser.uid);
      if (result.success) {
        setAllUsers(result.users);
      }
    };

    loadUsers();
  }, [currentUser]);

  // ============================================
  // ÉCOUTE DES MESSAGES PRIVÉS DE LA CONVERSATION ACTIVE
  // ============================================
  useEffect(() => {
    if (!activeConversation) {
      setPrivateMessages([]);
      return;
    }

    setLoadingPrivateMessages(true);
    const unsubscribe = firestoreService.listenToPrivateMessages(
      activeConversation,
      (messages) => {
        setPrivateMessages(messages);
        setLoadingPrivateMessages(false);
      }
    );

    return () => unsubscribe();
  }, [activeConversation]);

  // ============================================
  // MÉTHODES POUR ENVOYER DES MESSAGES
  // ============================================

  const sendPublicMessage = async (text) => {
    if (!currentUser || !userProfile || !text.trim()) {
      return { success: false, error: 'Message invalide' };
    }

    return await firestoreService.sendPublicMessage(
      currentUser.uid,
      userProfile.displayName,
      text.trim(),
      userProfile.photoURL
    );
  };

  const sendPrivateMessage = async (text) => {
    if (!currentUser || !userProfile || !activeConversation || !text.trim()) {
      return { success: false, error: 'Message invalide' };
    }

    return await firestoreService.sendPrivateMessage(
      activeConversation,
      currentUser.uid,
      userProfile.displayName,
      text.trim(),
      userProfile.photoURL
    );
  };

  const deleteMessage = async (messageId) => {
    if (!currentUser) {
      return { success: false, error: 'Non authentifié' };
    }

    return await firestoreService.deletePublicMessage(messageId, currentUser.uid);
  };

  // ============================================
  // MÉTHODES POUR GÉRER LES CONVERSATIONS
  // ============================================

  const startConversation = async (otherUserId) => {
    if (!currentUser) {
      return { success: false, error: 'Non authentifié' };
    }

    const result = await firestoreService.getOrCreateConversation(
      currentUser.uid,
      otherUserId
    );

    if (result.success) {
      setActiveConversation(result.conversationId);
      
      // Recharger les conversations
      const conversationsResult = await firestoreService.getUserConversations(currentUser.uid);
      if (conversationsResult.success) {
        setConversations(conversationsResult.conversations);
      }
    }

    return result;
  };

  const selectConversation = (conversationId) => {
    setActiveConversation(conversationId);
  };

  const closeConversation = () => {
    setActiveConversation(null);
    setPrivateMessages([]);
  };

  // ============================================
  // MÉTHODES UTILITAIRES
  // ============================================

  const isUserOnline = (userId) => {
    return usersPresence[userId]?.isOnline || false;
  };

  const getUserLastSeen = (userId) => {
    return usersPresence[userId]?.lastSeen || null;
  };

  const value = {
    // Messages publics
    publicMessages,
    loadingPublicMessages,
    sendPublicMessage,
    deleteMessage,

    // Messages privés
    conversations,
    activeConversation,
    privateMessages,
    loadingPrivateMessages,
    sendPrivateMessage,
    startConversation,
    selectConversation,
    closeConversation,

    // Utilisateurs
    allUsers,
    usersPresence,
    isUserOnline,
    getUserLastSeen
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};