import { MdDriveFolderUpload, MdHome, MdShare } from 'react-icons/md';
import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function Sidebar() {
  const [used, setUsed] = useState(0);
  const [total, setTotal] = useState(10 * 1024 * 1024 * 1024); // 10 Go par défaut

  useEffect(() => {
    api.get('/files/stats/space').then(res => setUsed(res.data));
  }, []);

  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r shadow-sm">
      <div className="flex items-center h-16 px-6 font-bold text-xl border-b">FileFlow</div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <a href="/dashboard" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
          <MdHome className="mr-3 text-2xl" /> Tableau de bord
        </a>
        <a href="/shared" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
          <MdShare className="mr-3 text-2xl" /> Fichiers partagés
        </a>
        <button className="flex items-center w-full px-3 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          <MdDriveFolderUpload className="mr-3 text-2xl" /> Upload
        </button>
      </nav>
      <div className="px-6 py-4 border-t">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Espace utilisé</span>
          <span>{(used / (1024 * 1024 * 1024)).toFixed(1)} Go / {(total / (1024 * 1024 * 1024)).toFixed(0)} Go</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (used / total) * 100)}%` }}></div>
        </div>
      </div>
    </aside>
  );
} 