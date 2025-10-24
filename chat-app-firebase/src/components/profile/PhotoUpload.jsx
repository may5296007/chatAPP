import { useState, useRef } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadProfilePicture, deleteProfilePicture } from '../../services/storageService';
import Button from '../common/Button';
import Avatar from '../common/Avatar';

const PhotoUpload = () => {
  const { currentUser, userProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Format non supporté. Utilisez JPG, PNG, GIF ou WEBP');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux. Taille maximale : 5MB');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    setError('');
    setSuccess('');
    setUploading(true);

    const result = await uploadProfilePicture(currentUser.uid, file);

    setUploading(false);

    if (result.success) {
      setSuccess(result.message);
      setPreview(null);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer votre photo de profil ?')) return;

    setError('');
    setSuccess('');
    setDeleting(true);

    const result = await deleteProfilePicture(
      currentUser.uid,
      userProfile?.photoURL || currentUser?.photoURL
    );

    setDeleting(false);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Photo de profil</h2>

      {/* Avatar preview */}
      <div className="flex items-center gap-6">
        <Avatar
          user={preview ? { photoURL: preview } : (userProfile || currentUser)}
          size="2xl"
        />

        <div className="flex-1 space-y-3">
          {/* Upload button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              icon={Camera}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || deleting}
              loading={uploading}
            >
              {uploading ? 'Upload en cours...' : 'Changer la photo'}
            </Button>
          </div>

          {/* Delete button */}
          {(userProfile?.photoURL || currentUser?.photoURL) && (
            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleDelete}
              disabled={uploading || deleting}
              loading={deleting}
            >
              Supprimer la photo
            </Button>
          )}

          <p className="text-xs text-gray-500">
            JPG, PNG, GIF ou WEBP. Max 5MB.
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {success}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;