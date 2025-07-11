import { useState } from 'react';
import { MdInsertDriveFile, MdMoreVert, MdDelete, MdEdit, MdDownload, MdPerson } from 'react-icons/md';
import { Menu } from '@headlessui/react';
import api from '@/utils/api';
import { useFiles, FileData } from '@/hooks/useFiles';
import ShareDialog from './ShareDialog';

export default function FileItem({ file, onAction }: { file: FileData; onAction?: (msg: string) => void }) {
  const { setFiles } = useFiles();
  const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState(file.filename);
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await api.delete(`/files/${file.id}`);
    const res = await api.get('/files');
    setFiles(res.data);
    setLoading(false);
    onAction && onAction('Fichier supprimé !');
  };

  const handleRename = async () => {
    setLoading(true);
    await api.patch(`/files/${file.id}/rename`, { newName });
    const res = await api.get('/files');
    setFiles(res.data);
    setShowRename(false);
    setLoading(false);
    onAction && onAction('Fichier renommé !');
  };

  const handleDownload = () => {
    window.open(`http://localhost:8080/api/files/download/${file.id}`, '_blank');
    onAction && onAction('Téléchargement lancé');
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col items-center p-6 cursor-pointer group relative">
      <div className="absolute top-2 right-2">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
            <MdMoreVert className="text-xl" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => setShowRename(true)} className={`flex items-center w-full px-3 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                    <MdEdit className="mr-2" /> Renommer
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button onClick={handleDownload} className={`flex items-center w-full px-3 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                    <MdDownload className="mr-2" /> Télécharger
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button onClick={handleDelete} className={`flex items-center w-full px-3 py-2 text-sm text-red-600 ${active ? 'bg-gray-100' : ''}`}>
                    <MdDelete className="mr-2" /> Supprimer
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => setShowShare(true)} className={`flex items-center w-full px-3 py-2 text-sm text-blue-600 ${active ? 'bg-gray-100' : ''}`}>
                    <MdPerson className="mr-2" /> Partager
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
      <div className="text-blue-500 text-5xl mb-3 group-hover:scale-110 transition-transform">
        <MdInsertDriveFile />
      </div>
      <div className="font-medium text-gray-800 truncate w-full text-center">{file.filename}</div>
      <div className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} Ko • {new Date(file.uploadDate).toLocaleDateString()}</div>
      {/* Modale de renommage */}
      {showRename && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Renommer le fichier</h2>
            <input
              className="w-full border px-3 py-2 rounded mb-4"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              disabled={loading}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowRename(false)} className="px-4 py-2 rounded bg-gray-100">Annuler</button>
              <button onClick={handleRename} className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>
                {loading ? 'Renommage...' : 'Renommer'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showShare && <ShareDialog fileId={file.id} onClose={() => setShowShare(false)} />}
    </div>
  );
} 