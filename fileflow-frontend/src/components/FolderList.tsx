import { useState } from 'react';
import { Folder, useFolders } from '@/hooks/useFolders';
import Toast from './Toast';

interface FolderListProps {
  parentId?: number;
  onNavigate?: (folder: Folder) => void;
}

export default function FolderList({ parentId, onNavigate }: FolderListProps) {
  const { folders, loading, error, createFolder, renameFolder, deleteFolder } = useFolders(parentId);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;
    await createFolder(newFolderName, parentId);
    setNewFolderName('');
    setToast('Dossier créé !');
  };

  const handleRename = async (id: number) => {
    if (!renameValue.trim()) return;
    await renameFolder(id, renameValue);
    setRenamingId(null);
    setRenameValue('');
    setToast('Dossier renommé !');
  };

  const handleDelete = async (id: number) => {
    await deleteFolder(id);
    setDeletingId(null);
    setToast('Dossier supprimé !');
  };

  if (loading) return <div>Chargement des dossiers...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nouveau dossier"
          value={newFolderName}
          onChange={e => setNewFolderName(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button onClick={handleCreate} className="bg-blue-600 text-white px-3 py-1 rounded">Créer</button>
      </div>
      <ul className="space-y-2">
        {folders.map(folder => (
          <li key={folder.id} className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
            <span
              className="flex-1 cursor-pointer hover:underline"
              onClick={() => onNavigate && onNavigate(folder)}
            >
              {renamingId === folder.id ? (
                <input
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  className="border px-2 py-1 rounded"
                  autoFocus
                />
              ) : (
                folder.name
              )}
            </span>
            {renamingId === folder.id ? (
              <>
                <button onClick={() => handleRename(folder.id)} className="text-green-600">Valider</button>
                <button onClick={() => setRenamingId(null)} className="text-gray-500">Annuler</button>
              </>
            ) : (
              <>
                <button onClick={() => { setRenamingId(folder.id); setRenameValue(folder.name); }} className="text-blue-600">Renommer</button>
                <button onClick={() => setDeletingId(folder.id)} className="text-red-600">Supprimer</button>
              </>
            )}
            {deletingId === folder.id && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
                <div className="bg-white rounded-lg p-6 shadow-lg w-80">
                  <h2 className="text-lg font-bold mb-4">Supprimer le dossier ?</h2>
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => setDeletingId(null)} className="px-4 py-2 rounded bg-gray-100">Annuler</button>
                    <button onClick={() => handleDelete(folder.id)} className="px-4 py-2 rounded bg-red-600 text-white">Supprimer</button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
} 