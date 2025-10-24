import { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../services/firestoreService';
import Input from '../common/Input';
import Button from '../common/Button';

const ProfileEdit = ({ onSuccess }) => {
  const { currentUser, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || ''
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.displayName || formData.displayName.trim().length < 3) {
      newErrors.displayName = 'Le nom doit contenir au moins 3 caractères';
    }

    if (formData.displayName.trim().length > 50) {
      newErrors.displayName = 'Le nom ne peut pas dépasser 50 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    const result = await updateUserProfile(currentUser.uid, {
      displayName: formData.displayName.trim()
    });

    setLoading(false);

    if (result.success) {
      setSuccess('Profil mis à jour avec succès !');
      setTimeout(() => {
        setSuccess('');
        onSuccess?.();
      }, 2000);
    } else {
      setError(result.error || 'Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom d'utilisateur"
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          placeholder="Votre nom"
          icon={User}
          error={errors.displayName}
          required
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            icon={Save}
            loading={loading}
            disabled={loading}
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;