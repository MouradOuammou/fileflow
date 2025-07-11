import { MdSearch, MdLogout, MdPerson } from 'react-icons/md';
import { Menu } from '@headlessui/react';
import { useAuth } from '@/context/AuthContext';

export default function Topbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center h-16 px-6 bg-white border-b shadow-sm justify-between">
      <form className="flex items-center w-1/2 max-w-lg" onSubmit={e => e.preventDefault()}>
        <span className="text-gray-400 mr-2 text-xl"><MdSearch /></span>
        <input
          type="text"
          placeholder="Rechercher des fichiers..."
          className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={e => onSearch && onSearch(e.target.value)}
        />
      </form>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="flex items-center space-x-2 focus:outline-none">
          <span className="font-medium text-gray-700 hidden sm:block">{user}</span>
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            <MdPerson className="text-xl" />
          </div>
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`flex items-center w-full px-3 py-2 text-sm text-red-600 ${active ? 'bg-gray-100' : ''}`}
                >
                  <MdLogout className="mr-2" /> Déconnexion
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </header>
  );
} 