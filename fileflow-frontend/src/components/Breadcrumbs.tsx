import Link from 'next/link';

interface BreadcrumbsProps {
  path: { id: number; name: string }[];
}

export default function Breadcrumbs({ path }: BreadcrumbsProps) {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/dashboard" className="hover:underline">Racine</Link>
      {path.map((folder, idx) => (
        <span key={folder.id}>
          {' / '}
          <Link href={`/folders/${folder.id}`} className="hover:underline">
            {folder.name}
          </Link>
        </span>
      ))}
    </nav>
  );
} 