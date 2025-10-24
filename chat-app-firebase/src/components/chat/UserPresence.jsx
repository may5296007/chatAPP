import { useEffect, useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { formatRelativeTime } from '../../utils/formatters';

const UserPresence = ({ userId, showLabel = true, inline = false }) => {
  const { isUserOnline, getUserLastSeen } = useChat();
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setIsOnline(isUserOnline(userId));
    setLastSeen(getUserLastSeen(userId));
  }, [userId, isUserOnline, getUserLastSeen]);

  if (inline) {
    // Mode inline : juste le point de couleur
    return (
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
        title={isOnline ? 'En ligne' : lastSeen ? `Vu ${formatRelativeTime(lastSeen)}` : 'Hors ligne'}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Indicateur */}
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`}
      />
      
      {/* Label */}
      {showLabel && (
        <span className="text-sm text-gray-600">
          {isOnline ? (
            <span className="text-green-600 font-medium">En ligne</span>
          ) : lastSeen ? (
            <span>Vu {formatRelativeTime(lastSeen)}</span>
          ) : (
            <span>Hors ligne</span>
          )}
        </span>
      )}
    </div>
  );
};

export default UserPresence;