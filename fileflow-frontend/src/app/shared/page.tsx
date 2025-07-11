import SharedFilesList from '@/components/SharedFilesList';

export default function SharedPage() {
  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Fichiers partagés avec moi</h1>
      <SharedFilesList />
    </div>
  );
} 