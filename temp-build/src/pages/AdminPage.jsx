import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-gray-700">
          Admin Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/overview" className="block px-4 py-2 rounded hover:bg-gray-700">
            Overview
          </Link>
          <Link to="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-700">
            Users
          </Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-gray-700">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminPage;