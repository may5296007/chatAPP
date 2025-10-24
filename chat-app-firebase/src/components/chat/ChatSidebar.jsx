import { useState } from 'react';
import { Search, X, MessageSquare } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import Avatar from '../common/Avatar';
import { formatLastMessageTime, truncateText } from '../../utils/formatters';

const ChatSidebar = ({ isVisible, onToggle }) => {
  const { 
    allUsers, 
    conversations, 
    startConversation, 
    selectConversation,
    activeConversation,
    isUserOnline 
  } = useChat();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('conversations'); // 'conversations' ou 'users'

  const filteredUsers = allUsers.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.otherUser?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = async (userId) => {
    await startConversation(userId);
  };

  const handleConversationClick = (conversationId) => {
    selectConversation(conversationId);
  };

  if (!isVisible) return null;

  return (
    <div className="w-80 border-r bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded-full lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setView('conversations')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === 'conversations'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Conversations ({conversations.length})
          </button>
          <button
            onClick={() => setView('users')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === 'users'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Utilisateurs ({allUsers.length})
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {view === 'conversations' ? (
          // Liste des conversations
          filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune conversation</p>
              <p className="text-xs mt-1">Commencez à discuter avec un utilisateur</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleConversationClick(conv.id)}
                className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                  activeConversation === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    user={conv.otherUser}
                    size="md"
                    showStatus
                    isOnline={isUserOnline(conv.otherUser?.uid || conv.otherUser?.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conv.otherUser?.displayName || 'Utilisateur'}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatLastMessageTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {truncateText(conv.lastMessage || 'Aucun message', 40)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )
        ) : (
          // Liste des utilisateurs
          filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className="w-full p-4 border-b hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    user={user}
                    size="md"
                    showStatus
                    isOnline={isUserOnline(user.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.displayName || 'Utilisateur'}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;