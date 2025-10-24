import { getInitials, getColorFromId } from '../../utils/formatters';

const Avatar = ({ 
  user, 
  size = 'md', 
  showStatus = false,
  isOnline = false,
  className = '' 
}) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-24 w-24 text-2xl'
  };

  const statusSizes = {
    xs: 'h-2 w-2',
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5',
    xl: 'h-4 w-4',
    '2xl': 'h-5 w-5'
  };

  const photoURL = user?.photoURL;
  const displayName = user?.displayName || user?.email || 'Utilisateur';
  const userId = user?.uid || user?.id || '';

  return (
    <div className={`relative inline-block ${className}`}>
      {photoURL ? (
        <img
          src={photoURL}
          alt={displayName}
          className={`${sizes[size]} rounded-full object-cover border-2 border-white shadow-sm`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold border-2 border-white shadow-sm`}
          style={{ backgroundColor: getColorFromId(userId) }}
        >
          {getInitials(displayName)}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;