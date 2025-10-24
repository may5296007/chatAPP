import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Écouter les changements d'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Écouter les changements du profil utilisateur dans Firestore
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserProfile({ id: doc.id, ...doc.data() });
          }
        });

        setLoading(false);
        return () => unsubscribeProfile();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ============================================
  // MÉTHODES D'AUTHENTIFICATION
  // ============================================

  const register = async (email, password, displayName) => {
    try {
      setError(null);
      const result = await authService.registerWithEmail(email, password, displayName);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await authService.loginWithEmail(email, password);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const result = await authService.loginWithGoogle();
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const loginWithFacebook = async () => {
    try {
      setError(null);
      const result = await authService.loginWithFacebook();
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const loginWithGithub = async () => {
    try {
      setError(null);
      const result = await authService.loginWithGithub();
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const loginAnonymously = async () => {
    try {
      setError(null);
      const result = await authService.loginAnonymously();
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const sendPhoneCode = async (phoneNumber) => {
    try {
      setError(null);
      const result = await authService.sendPhoneVerificationCode(phoneNumber);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const verifyPhoneCode = async (code) => {
    try {
      setError(null);
      const result = await authService.verifyPhoneCode(code);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const result = await authService.logout();
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithGithub,
    loginAnonymously,
    sendPhoneCode,
    verifyPhoneCode,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
