import { useEffect, useState } from 'react';
import api from '@/utils/api';

export interface SharedFile {
  id: number;
  file: {
    id: number;
    filename: string;
    size: number;
    mimeType: string;
    uploadDate: string;
  };
  owner: {
    id: number;
    username: string;
  };
  permission: string;
}

export function useSharedFiles() {
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/files/shared-with-me')
      .then(res => setSharedFiles(res.data))
      .catch(() => setError('Erreur lors du chargement des fichiers partagés'))
      .finally(() => setLoading(false));
  }, []);

  return { sharedFiles, loading, error };
} 