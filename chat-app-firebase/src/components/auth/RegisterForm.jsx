import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import { getPasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '../../utils/validators';

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.displayName || formData.displayName.trim().length < 3) {
      newErrors.displayName = 'Le nom doit contenir au moins 3 caractères';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Au moins 6 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(formData.email, formData.password, formData.displayName);
    setLoading(false);

    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <Input
        label="Nom d'utilisateur"
        type="text"
        name="displayName"
        value={formData.displayName}
        onChange={handleChange}
        placeholder="John Doe"
        icon={User}
        error={errors.displayName}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="exemple@email.com"
        icon={Mail}
        error={errors.email}
        required
      />

      <div>
        <Input
          label="Mot de passe"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          icon={Lock}
          error={errors.password}
          required
        />
        {formData.password && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded ${i < passwordStrength ? 'bg-current' : 'bg-gray-200'}`}
                  style={{ color: i < passwordStrength ? getPasswordStrengthColor(passwordStrength) : undefined }}
                />
              ))}
            </div>
            <p className="text-xs mt-1" style={{ color: getPasswordStrengthColor(passwordStrength) }}>
              {getPasswordStrengthLabel(passwordStrength)}
            </p>
          </div>
        )}
      </div>

      <Input
        label="Confirmer le mot de passe"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        icon={Lock}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" fullWidth loading={loading}>
        S'inscrire
      </Button>
    </form>
  );
};

export default RegisterForm;