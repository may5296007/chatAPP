import { useState } from 'react';
import { Trash2, MoreVertical } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import Avatar from '../common/Avatar';
import { formatRelativeTime } from '../../utils/formatters';

const MessageItem = ({ message, isOwn }) => {
  const { deleteMessage, isUserOnline } = useChat();
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce message ?')) return;
    
    setDeleting(true);
    await deleteMessage(message.id);
    setDeleting(false);
    setShowMenu(false);
  };

  const userOnline = isUserOnline(message.senderId);

  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <Avatar
        user={{
          photoURL: message.senderPhotoURL,
          displayName: message.senderName,
          uid: message.senderId
        }}
        size="sm"
        showStatus
        isOnline={userOnline}
      />

      {/* Message content */}
      <div className={`flex-1 max-w-lg ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender name & time */}
        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-sm font-semibold text-gray-900">
            {isOwn ? 'Vous' : message.senderName}
          </span>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(message.timestamp)}
          </span>
        </div>

        {/* Message bubble */}
        <div className="relative group">
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-900 rounded-bl-none'
            } ${deleting ? 'opacity-50' : ''}`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
          </div>

          {/* Menu button (only for own messages) */}
          {isOwn && (
            <div className="absolute top-0 right-0 -mr-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:bg-gray-200"
                disabled={deleting}
              >
                <MoreVertical size={16} className="text-gray-500" />
              </button>

              {/* Delete menu */}
              {showMenu && (
                <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg py-1 z-10">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;