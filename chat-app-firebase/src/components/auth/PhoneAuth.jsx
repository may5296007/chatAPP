import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { setupRecaptcha } from '../../services/authService';
import Input from '../common/Input';
import Button from '../common/Button';

const PhoneAuth = ({ onSuccess }) => {
  const { sendPhoneCode, verifyPhoneCode } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' ou 'code'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialiser reCAPTCHA au montage du composant
    try {
      setupRecaptcha('recaptcha-container');
    } catch (err) {
      console.error('Erreur setup reCAPTCHA:', err);
    }
  }, []);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Numéro de téléphone invalide');
      return;
    }

    setLoading(true);
    const result = await sendPhoneCode(phoneNumber);
    setLoading(false);

    if (result.success) {
      setStep('code');
    } else {
      setError(result.message || 'Erreur lors de l\'envoi du code');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('Code invalide (6 chiffres requis)');
      return;
    }

    setLoading(true);
    const result = await verifyPhoneCode(code);
    setLoading(false);

    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.message || 'Code incorrect');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <Input
            label="Numéro de téléphone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+33 6 12 34 56 78"
            icon={Phone}
            required
          />

          <div id="recaptcha-container"></div>

          <Button type="submit" fullWidth loading={loading}>
            Envoyer le code
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Format international requis (ex: +33612345678)
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Code envoyé au {phoneNumber}
          </p>

          <Input
            label="Code de vérification"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            required
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setStep('phone')}
            >
              Modifier
            </Button>
            <Button type="submit" fullWidth loading={loading}>
              Vérifier
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PhoneAuth;