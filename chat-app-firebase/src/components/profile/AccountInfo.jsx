import { Mail, Calendar, Shield, User, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatFullDate } from '../../utils/formatters';

const AccountInfo = () => {
  const { currentUser, userProfile } = useAuth();

  const infoItems = [
    {
      icon: User,
      label: 'Nom d\'utilisateur',
      value: userProfile?.displayName || currentUser?.displayName || 'Non défini'
    },
    {
      icon: Mail,
      label: 'Email',
      value: currentUser?.email || 'Non défini',
      verified: currentUser?.emailVerified
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: currentUser?.phoneNumber || 'Non défini'
    },
    {
      icon: Shield,
      label: 'Fournisseur d\'authentification',
      value: getAuthProvider(currentUser)
    },
    {
      icon: Calendar,
      label: 'Membre depuis',
      value: userProfile?.createdAt ? formatFullDate(userProfile.createdAt) : 'N/A'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Informations du compte</h2>

      <div className="space-y-3">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
          >
            <item.icon className="text-gray-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-900">{item.value}</p>
                {item.verified !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.verified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.verified ? 'Vérifié' : 'Non vérifié'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Account type badge */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-medium text-blue-900">Type de compte</p>
            <p className="text-sm text-blue-700 mt-1">
              {currentUser?.isAnonymous ? (
                'Compte anonyme - Vos données seront supprimées à la déconnexion'
              ) : (
                'Compte permanent - Vos données sont sauvegardées'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function pour obtenir le nom du fournisseur d'auth
const getAuthProvider = (user) => {
  if (!user) return 'Inconnu';
  if (user.isAnonymous) return 'Anonyme';
  
  const providerData = user.providerData?.[0];
  if (!providerData) return 'Email/Mot de passe';
  
  switch (providerData.providerId) {
    case 'google.com':
      return 'Google';
    case 'facebook.com':
      return 'Facebook';
    case 'github.com':
      return 'GitHub';
    case 'phone':
      return 'Téléphone';
    case 'password':
      return 'Email/Mot de passe';
    default:
      return providerData.providerId;
  }
};

export default AccountInfo;