import { useRef, useState } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import api from '@/utils/api';
import { useFiles } from '@/hooks/useFiles';

export default function UploadZone({ onSuccess, onError }: { onSuccess?: () => void; onError?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { setFiles } = useFiles();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const res = await api.get('/files');
      setFiles(res.data);
      onSuccess && onSuccess();
    } catch {
      onError && onError();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-48 bg-white transition-all cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={e => {
          if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
        }}
      />
      <MdCloudUpload className={`text-5xl mb-2 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
      <div className="font-medium text-gray-700">{uploading ? 'Upload en cours...' : 'Glissez un fichier ou cliquez ici'}</div>
      <div className="text-xs text-gray-400 mt-1">Taille max : 100 Mo</div>
    </div>
  );
} 