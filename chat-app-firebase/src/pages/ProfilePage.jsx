import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import PhotoUpload from '../components/profile/PhotoUpload';
import ProfileEdit from '../components/profile/ProfileEdit';
import AccountInfo from '../components/profile/AccountInfo';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span>Retour au chat</span>
            </button>
            
            <Button
              variant={isEditing ? 'danger' : 'primary'}
              icon={isEditing ? X : Edit}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile header with cover */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          {/* Avatar section */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-16 sm:-mt-12">
              {/* Avatar */}
              <div className="relative">
                <Avatar 
                  user={userProfile || currentUser} 
                  size="2xl" 
                  className="border-4 border-white shadow-lg"
                  showStatus
                  isOnline
                />
              </div>

              {/* User info */}
              <div className="flex-1 text-center sm:text-left mt-4 sm:mt-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  {userProfile?.displayName || currentUser?.displayName || 'Utilisateur'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {userProfile?.email || currentUser?.email}
                </p>
                {currentUser?.isAnonymous && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    Compte anonyme
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t">
            <div className="grid grid-cols-3 gap-4 px-6 py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {userProfile?.messagesCount || 0}
                </p>
                <p className="text-sm text-gray-600">Messages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {userProfile?.conversationsCount || 0}
                </p>
                <p className="text-sm text-gray-600">Conversations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  En ligne
                </p>
                <p className="text-sm text-gray-600">Statut</p>
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="border-t p-6 space-y-6">
            {isEditing ? (
              <>
                {/* Photo upload */}
                <PhotoUpload />
                
                {/* Profile edit form */}
                <ProfileEdit onSuccess={() => setIsEditing(false)} />
              </>
            ) : (
              <>
                {/* Account info (read-only) */}
                <AccountInfo />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;