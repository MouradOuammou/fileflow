import { useSharedFiles } from '@/hooks/useSharedFiles';

export default function SharedFilesList() {
  const { sharedFiles, loading, error } = useSharedFiles();

  if (loading) return <div>Chargement des fichiers partagés...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!sharedFiles.length) return <div>Aucun fichier partagé avec vous.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {sharedFiles.map(share => (
        <div key={share.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
          <div className="font-bold mb-2">{share.file.filename}</div>
          <div className="text-xs text-gray-500 mb-2">Partagé par : {share.owner.username}</div>
          <div className="text-xs text-gray-500 mb-2">Droits : {share.permission}</div>
          <div className="text-xs text-gray-400">{(share.file.size / 1024).toFixed(1)} Ko • {new Date(share.file.uploadDate).toLocaleDateString()}</div>
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/download/${share.file.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            Télécharger
          </a>
        </div>
      ))}
    </div>
  );
} 