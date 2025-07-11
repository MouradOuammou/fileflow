import { useEffect, useState } from 'react';
import api from '@/utils/api';

export interface FileData {
  id: number;
  filename: string;
  size: number;
  mimeType: string;
  uploadDate: string;
}

export function useFiles(search?: string, folderId?: number) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let url = '/files';
    if (folderId) {
      url += `?folderId=${folderId}`;
    }
    if (search) {
      url += (url.includes('?') ? '&' : '?') + `search=${encodeURIComponent(search)}`;
    }
    api.get(url)
      .then(res => setFiles(res.data))
      .catch(() => setError('Erreur lors du chargement des fichiers'))
      .finally(() => setLoading(false));
  }, [search, folderId]);

  return { files, loading, error, setFiles };
} 