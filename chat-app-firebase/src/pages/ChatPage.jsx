import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import ChatRoom from '../components/chat/ChatRoom';
import ChatSidebar from '../components/chat/ChatSidebar';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';

const ChatPage = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const { activeConversation, closeConversation } = useChat();
  
  const [chatMode, setChatMode] = useState('public'); // 'public' ou 'private'
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    // Si une conversation est active, passer en mode privé
    if (activeConversation) {
      setChatMode('private');
    }
  }, [activeConversation]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSwitchToPublic = () => {
    setChatMode('public');
    closeConversation();
  };

  const handleSwitchToPrivate = () => {
    setChatMode('private');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-blue-600" size={32} />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chat App</h1>
              <p className="text-xs text-gray-500">
                {chatMode === 'public' ? 'Salon public' : 'Messages privés'}
              </p>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            <Avatar user={userProfile || currentUser} size="sm" showStatus isOnline />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {userProfile?.displayName || currentUser?.displayName || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500">En ligne</p>
            </div>
            
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                icon={User}
                onClick={() => navigate('/profile')}
              >
                <span className="hidden sm:inline">Profil</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={LogOut}
                onClick={handleLogout}
              >
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex border-t">
          <button
            onClick={handleSwitchToPublic}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              chatMode === 'public'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users size={18} />
            Chat public
          </button>
          <button
            onClick={handleSwitchToPrivate}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              chatMode === 'private'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare size={18} />
            Messages privés
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (liste des utilisateurs ou conversations) */}
        {chatMode === 'private' && (
          <ChatSidebar 
            isVisible={showSidebar}
            onToggle={() => setShowSidebar(!showSidebar)}
          />
        )}

        {/* Chat room */}
        <div className="flex-1 flex flex-col">
          <ChatRoom mode={chatMode} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;