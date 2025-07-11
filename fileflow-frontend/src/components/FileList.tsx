import { useFiles } from '@/hooks/useFiles';
import FileItem from './FileItem';

function SkeletonCard() {
  return (
    <div className="bg-gray-100 rounded-xl animate-pulse h-40 flex flex-col items-center p-6">
      <div className="w-12 h-12 bg-gray-200 rounded mb-3" />
      <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
      <div className="w-16 h-3 bg-gray-200 rounded" />
    </div>
  );
}

interface FileListProps {
  onAction?: (msg: string) => void;
  search?: string;
  folderId?: number;
}

export default function FileList({ onAction, search, folderId }: FileListProps) {
  const { files, loading, error } = useFiles(search, folderId);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  if (!files.length) {
    return <div className="p-6 text-gray-400">Aucun fichier pour le moment.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {files.map(file => (
        <FileItem key={file.id} file={file} onAction={onAction} />
      ))}
    </div>
  );
} 