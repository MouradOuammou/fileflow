import { useState } from 'react';
import api from '@/utils/api';
import Toast from './Toast';

interface ShareDialogProps {
  fileId: number;
  onClose: () => void;
}

export default function ShareDialog({ fileId, onClose }: ShareDialogProps) {
  const [username, setUsername] = useState('');
  const [permission, setPermission] = useState('READ');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/files/${fileId}/share`, { username, permission });
      setToast('Fichier partagé !');
      setUsername('');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur lors du partage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-30">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Partager le fichier</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />
        <select
          value={permission}
          onChange={e => setPermission(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="READ">Lecture seule</option>
          <option value="WRITE">Lecture & écriture</option>
        </select>
        {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">Annuler</button>
          <button onClick={handleShare} className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>
            {loading ? 'Partage...' : 'Partager'}
          </button>
        </div>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
} 