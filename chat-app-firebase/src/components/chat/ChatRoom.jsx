import { useChat } from '../../contexts/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Loader from '../common/Loader';

const ChatRoom = ({ mode }) => {
  const { 
    publicMessages, 
    loadingPublicMessages,
    privateMessages,
    loadingPrivateMessages,
    activeConversation,
    conversations
  } = useChat();

  const isPublic = mode === 'public';
  const messages = isPublic ? publicMessages : privateMessages;
  const loading = isPublic ? loadingPublicMessages : loadingPrivateMessages;

  // Trouver les infos de la conversation active
  const currentConversation = conversations.find(
    conv => conv.id === activeConversation
  );

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header de la conversation */}
      {!isPublic && currentConversation && (
        <div className="border-b px-4 py-3 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {currentConversation.otherUser?.displayName?.charAt(0) || '?'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {currentConversation.otherUser?.displayName || 'Utilisateur'}
              </h3>
              <p className="text-xs text-gray-500">
                {currentConversation.otherUser?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader text="Chargement des messages..." />
        </div>
      ) : !isPublic && !activeConversation ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">Aucune conversation sélectionnée</p>
            <p className="text-sm">Sélectionnez un utilisateur pour commencer à discuter</p>
          </div>
        </div>
      ) : (
        <>
          <MessageList messages={messages} mode={mode} />
          <MessageInput mode={mode} />
        </>
      )}
    </div>
  );
};

export default ChatRoom;