import { useState } from 'react';
import { uploadProfilePicture, deleteProfilePicture } from '../services/storageService';

/**
 * Hook personnalisé pour gérer les opérations Storage
 */
export const useStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (userId, file) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    const result = await uploadProfilePicture(userId, file);

    setUploading(false);
    setProgress(100);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  const deleteFile = async (userId, photoURL) => {
    setDeleting(true);
    setError(null);

    const result = await deleteProfilePicture(userId, photoURL);

    setDeleting(false);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    deleting,
    error,
    progress
  };
};

export default useStorage;