import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage } from './firebase';
import { updateUserProfile } from './firestoreService';

// ============================================
// UPLOAD DE PHOTO DE PROFIL
// ============================================

/**
 * Valider le fichier image
 */
const validateImageFile = (file) => {
  // Vérifier que c'est bien un fichier
  if (!file) {
    return { valid: false, error: 'Aucun fichier sélectionné' };
  }

  // Vérifier le type de fichier
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format non supporté. Utilisez JPG, PNG, GIF ou WEBP'
    };
  }

  // Vérifier la taille (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB en bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Le fichier est trop volumineux. Taille maximale : 5MB'
    };
  }

  return { valid: true };
};

/**
 * Uploader une photo de profil
 */
export const uploadProfilePicture = async (userId, file) => {
  try {
    // Valider le fichier
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}.${file.name.split('.').pop()}`;
    
    // Référence au Storage
    const storageRef = ref(storage, `profile_pictures/${userId}/${fileName}`);

    // Upload du fichier
    const snapshot = await uploadBytes(storageRef, file);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Mettre à jour le profil Firestore avec la nouvelle photo
    await updateUserProfile(userId, { photoURL: downloadURL });

    return {
      success: true,
      photoURL: downloadURL,
      message: 'Photo de profil mise à jour avec succès'
    };
  } catch (error) {
    console.error('Erreur upload photo de profil:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de l\'upload de la photo'
    };
  }
};

/**
 * Supprimer une photo de profil
 */
export const deleteProfilePicture = async (userId, photoURL) => {
  try {
    if (!photoURL) {
      return { success: false, error: 'Aucune photo à supprimer' };
    }

    // Extraire le chemin du fichier depuis l'URL
    const filePathMatch = photoURL.match(/profile_pictures%2F(.+?)\?/);
    if (!filePathMatch) {
      return { success: false, error: 'URL invalide' };
    }

    const filePath = decodeURIComponent(filePathMatch[1]);
    const storageRef = ref(storage, `profile_pictures/${filePath}`);

    // Supprimer le fichier
    await deleteObject(storageRef);

    // Mettre à jour le profil Firestore (enlever la photo)
    await updateUserProfile(userId, { photoURL: null });

    return {
      success: true,
      message: 'Photo de profil supprimée avec succès'
    };
  } catch (error) {
    console.error('Erreur suppression photo de profil:', error);
    
    // Si le fichier n'existe pas, on considère que c'est un succès
    if (error.code === 'storage/object-not-found') {
      await updateUserProfile(userId, { photoURL: null });
      return { success: true, message: 'Photo supprimée du profil' };
    }

    return {
      success: false,
      error: error.message || 'Erreur lors de la suppression de la photo'
    };
  }
};

/**
 * Uploader une image pour le chat (optionnel - extension future)
 */
export const uploadChatImage = async (userId, file) => {
  try {
    // Valider le fichier
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}.${file.name.split('.').pop()}`;
    
    // Référence au Storage
    const storageRef = ref(storage, `chat_images/${userId}/${fileName}`);

    // Upload du fichier
    const snapshot = await uploadBytes(storageRef, file);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      imageURL: downloadURL,
      message: 'Image uploadée avec succès'
    };
  } catch (error) {
    console.error('Erreur upload image chat:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de l\'upload de l\'image'
    };
  }
};

/**
 * Compresser une image avant l'upload (optionnel mais recommandé)
 */
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Redimensionner si nécessaire
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir en Blob
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            }));
          },
          file.type,
          quality
        );
      };
      
      img.onerror = (error) => reject(error);
    };
    
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Prévisualiser une image avant l'upload
 */
export const previewImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};