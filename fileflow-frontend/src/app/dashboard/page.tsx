"use client";
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import FileList from '@/components/FileList';
import UploadZone from '@/components/UploadZone';
import Toast from '@/components/Toast';
import FolderList from '@/components/FolderList';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar onSearch={setSearch} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Dossiers</h2>
              <Link href="/shared" className="text-blue-600 hover:underline">Fichiers partagés avec moi</Link>
            </div>
            <FolderList onNavigate={folder => router.push(`/folders/${folder.id}`)} />
            <h2 className="text-xl font-bold mt-8 mb-4">Fichiers</h2>
            <UploadZone onSuccess={() => setToast('Fichier uploadé !')} onError={() => setToast('Erreur upload !')} />
            <FileList onAction={msg => setToast(msg)} search={search} />
          </div>
        </main>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
} 