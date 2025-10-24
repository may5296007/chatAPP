import { useState, useEffect } from 'react';
import { listenToPublicMessages, listenToPrivateMessages } from '../services/firestoreService';

/**
 * Hook personnalisé pour écouter les messages publics en temps réel
 */
export const usePublicMessages = (limit = 50) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = listenToPublicMessages((newMessages) => {
      setMessages(newMessages);
      setLoading(false);
    }, limit);

    return () => unsubscribe();
  }, [limit]);

  return { messages, loading };
};

/**
 * Hook personnalisé pour écouter les messages privés en temps réel
 */
export const usePrivateMessages = (conversationId, limit = 50) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = listenToPrivateMessages(
      conversationId,
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      },
      limit
    );

    return () => unsubscribe();
  }, [conversationId, limit]);

  return { messages, loading };
};

export default usePublicMessages;