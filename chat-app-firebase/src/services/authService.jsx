import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Providers pour les authentifications tierces
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

// ============================================
// AUTHENTIFICATION EMAIL/PASSWORD
// ============================================

/**
 * Inscription avec email et mot de passe
 */
export const registerWithEmail = async (email, password, displayName) => {
  try {
    // Créer l'utilisateur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Mettre à jour le profil avec le nom
    await updateProfile(user, { displayName });

    // Envoyer l'email de vérification
    await sendEmailVerification(user);

    // Créer le document utilisateur dans Firestore
    await createUserDocument(user);

    return {
      success: true,
      user,
      message: 'Compte créé ! Vérifiez votre email pour activer votre compte.'
    };
  } catch (error) {
    return handleAuthError(error);
  }
};

/**
 * Connexion avec email et mot de passe
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Vérifier si l'email est vérifié
    if (!user.emailVerified) {
      await signOut(auth);
      return {
        success: false,
        error: 'EMAIL_NOT_VERIFIED',
        message: 'Veuillez vérifier votre email avant de vous connecter.'
      };
    }

    // Mettre à jour la présence
    await updateUserPresence(user.uid, true);

    return { success: true, user };
  } catch (error) {
    return handleAuthError(error);
  }
};

// ============================================
// AUTHENTIFICATION AVEC TÉLÉPHONE
// ============================================

/**
 * Initialiser le reCAPTCHA pour l'authentification par téléphone
 */
export const setupRecaptcha = (containerId) => {
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'normal',
      callback: () => {
        // reCAPTCHA résolu
        console.log('reCAPTCHA résolu');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expiré');
      }
    });
    return window.recaptchaVerifier;
  } catch (error) {
    console.error('Erreur setup reCAPTCHA:', error);
    throw error;
  }
};

/**
 * Envoyer le code de vérification par SMS
 */
export const sendPhoneVerificationCode = async (phoneNumber) => {
  try {
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    
    // Stocker confirmationResult pour la vérification
    window.confirmationResult = confirmationResult;
    
    return { success: true, confirmationResult };
  } catch (error) {
    return handleAuthError(error);
  }
};

/**
 * Vérifier le code SMS et se connecter
 */
export const verifyPhoneCode = async (code) => {
  try {
    const confirmationResult = window.confirmationResult;
    const userCredential = await confirmationResult.confirm(code);
    const user = userCredential.user;

    // Créer le document utilisateur si nécessaire
    await createUserDocument(user);
    await updateUserPresence(user.uid, true);

    return { success: true, user };
  } catch (error) {
    return handleAuthError(error);
  }
};

// ============================================
// AUTHENTIFICATION ANONYME
// ============================================

/**
 * Connexion anonyme
 */
export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;

    await createUserDocument(user);
    await updateUserPresence(user.uid, true);

    return { success: true, user };
  } catch (error) {
    return handleAuthError(error);
  }
};

// ============================================
// AUTHENTIFICATION AVEC FOURNISSEURS TIERS
// ============================================

/**
 * Connexion avec Google
 */
export const loginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    await createUserDocument(user);
    await updateUserPresence(user.uid, true);

    return { success: true, user };
  } catch (error) {
    return handleAuthError(error);
  }
};

/**
 * Connexion avec Facebook
 */
export const loginWithFacebook = async () => {
  try {
    const userCredential = await signInWithPopup(auth, facebookProvider);
    const user = userCredential.user;

    await createUserDocument(user);
    await updateUserPresence(user.uid, true);

    return { success: true, user };
  } catch (error) {
    return handleAuthError(error);
  }
};

/**
 * Connexion avec GitHub
 */
export const loginWithGithub = async () => {
  try {
    const userCredential = await signInWithPopup(auth, githubProvider);
    const user = userCredential.user;

    await createUserDocument(user);
    await updateUserPresence(user.uid, true);

    return { success: true, user };
  } catch (error) {
    return handleAuthError(error);
  }
};

// ============================================
// DÉCONNEXION
// ============================================

/**
 * Déconnexion de l'utilisateur
 */
export const logout = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (userId) {
      await updateUserPresence(userId, false);
    }
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return handleAuthError(error);
  }
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Créer ou mettre à jour le document utilisateur dans Firestore
 */
const createUserDocument = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    // Si le document n'existe pas, le créer
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || user.phoneNumber || 'Utilisateur anonyme',
        photoURL: user.photoURL || null,
        phoneNumber: user.phoneNumber || null,
        isAnonymous: user.isAnonymous,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      // Mettre à jour la date de dernière connexion
      await setDoc(userRef, {
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    console.error('Erreur création document utilisateur:', error);
  }
};

/**
 * Mettre à jour la présence de l'utilisateur
 */
const updateUserPresence = async (userId, isOnline) => {
  try {
    const presenceRef = doc(db, 'presence', userId);
    await setDoc(presenceRef, {
      isOnline,
      lastSeen: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur mise à jour présence:', error);
  }
};

/**
 * Gérer les erreurs d'authentification
 */
const handleAuthError = (error) => {
  console.error('Erreur authentification:', error);

  let message = 'Une erreur est survenue';

  switch (error.code) {
    case 'auth/email-already-in-use':
      message = 'Cette adresse email est déjà utilisée';
      break;
    case 'auth/invalid-email':
      message = 'Adresse email invalide';
      break;
    case 'auth/weak-password':
      message = 'Le mot de passe doit contenir au moins 6 caractères';
      break;
    case 'auth/user-not-found':
      message = 'Aucun compte trouvé avec cette adresse email';
      break;
    case 'auth/wrong-password':
      message = 'Mot de passe incorrect';
      break;
    case 'auth/too-many-requests':
      message = 'Trop de tentatives. Réessayez plus tard';
      break;
    case 'auth/popup-closed-by-user':
      message = 'Connexion annulée';
      break;
    case 'auth/account-exists-with-different-credential':
      message = 'Un compte existe déjà avec cette adresse email';
      break;
    default:
      message = error.message;
  }

  return {
    success: false,
    error: error.code,
    message
  };
};