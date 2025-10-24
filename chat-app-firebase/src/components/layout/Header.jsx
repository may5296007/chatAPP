import { Link } from 'react-router-dom';
import { MessageCircle, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <MessageCircle className="text-blue-600" size={32} />
            <span className="text-xl font-bold text-gray-900">Chat App</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {currentUser ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3">
                  <Avatar 
                    user={userProfile || currentUser} 
                    size="sm" 
                    showStatus 
                    isOnline 
                  />
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {userProfile?.displayName || currentUser?.displayName || 'Utilisateur'}
                  </span>
                </div>

                {/* Actions */}
                <Link to="/profile">
                  <Button variant="ghost" size="sm" icon={User}>
                    <span className="hidden sm:inline">Profil</span>
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={LogOut}
                  onClick={handleLogout}
                >
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;