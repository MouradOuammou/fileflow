import FolderList from '@/components/FolderList';
import FileList from '@/components/FileList';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function FolderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const folderId = Number(params.id);
  const [path, setPath] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // Appel API pour récupérer le chemin du dossier courant
    api.get(`/folders/${folderId}`).then(res => {
      setPath(res.data.path || []);
    });
  }, [folderId]);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Breadcrumbs path={path} />
      <h1 className="text-2xl font-bold mb-4">Dossier #{folderId}</h1>
      <FolderList parentId={folderId} onNavigate={folder => router.push(`/folders/${folder.id}`)} />
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Fichiers</h2>
        <FileList folderId={folderId} />
      </div>
    </div>
  );
} 