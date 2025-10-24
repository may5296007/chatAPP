import { useState, useEffect } from 'react';
import { listenToUserPresence } from '../services/presenceService';

/**
 * Hook personnalisé pour écouter la présence d'un utilisateur
 */
export const usePresence = (userId) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToUserPresence(userId, (presenceData) => {
      setIsOnline(presenceData.isOnline || false);
      setLastSeen(presenceData.lastSeen || null);
    });

    return () => unsubscribe();
  }, [userId]);

  return { isOnline, lastSeen };
};

export default usePresence;