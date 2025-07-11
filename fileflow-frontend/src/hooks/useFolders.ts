import { useState, useEffect } from 'react';
import api from '@/utils/api';

export interface Folder {
  id: number;
  name: string;
  parent?: Folder | null;
  subfolders?: Folder[];
}

export function useFolders(parentId?: number) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const url = parentId ? `/folders/${parentId}` : '/folders';
    api.get(url)
      .then(res => {
        if (parentId) {
          setFolders(res.data.subfolders || []);
        } else {
          setFolders(res.data);
        }
        setError(null);
      })
      .catch(() => setError('Erreur lors du chargement des dossiers'))
      .finally(() => setLoading(false));
  }, [parentId]);

  const createFolder = async (name: string, parentId?: number) => {
    try {
      const res = await api.post('/folders', { name, parentId });
      setFolders(folders => [...folders, res.data]);
      return res.data;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur lors de la création du dossier');
      throw e;
    }
  };

  const renameFolder = async (id: number, newName: string) => {
    try {
      const res = await api.patch(`/folders/${id}/rename`, { newName });
      setFolders(folders => folders.map(f => f.id === id ? { ...f, name: newName } : f));
      return res.data;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur lors du renommage');
      throw e;
    }
  };

  const deleteFolder = async (id: number) => {
    try {
      await api.delete(`/folders/${id}`);
      setFolders(folders => folders.filter(f => f.id !== id));
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur lors de la suppression');
      throw e;
    }
  };

  return { folders, loading, error, createFolder, renameFolder, deleteFolder };
} 