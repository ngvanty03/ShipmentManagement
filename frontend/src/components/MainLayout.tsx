import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAuth } from '../hooks/useAuth';
import { Package, LogOut, Menu } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">ShipHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-500">Welcome, </span>
                <span className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</span>
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-500 flex items-center"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:block">
          <div className="h-full px-3 py-4 overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                  <Menu className="w-6 h-6 text-gray-500 transition duration-75" />
                  <span className="ml-3">Dashboard</span>
                </a>
              </li>
              {/* Add more nav items based on role later */}
            </ul>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
