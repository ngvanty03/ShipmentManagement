import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAuth } from '../hooks/useAuth';

interface MenuItem {
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
}

export const MainLayout: React.FC = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const adminMenu: MenuItem[] = [
    { label: 'Dashboard', path: '/' },
    { label: 'User', path: '/admin/users' },
    { label: 'Shipment', path: '/shipments' },
    { label: 'Shipment status', path: '/shipment-status' },
  ];

  const customerMenu: MenuItem[] = [
    { label: 'Dashboard', path: '/' },
    { label: 'Shipment', path: '/my-shipments' },
    { label: 'Tracks shipment', path: '/track' },
  ];

  const activeMenuItems = user?.role === 'Admin' ? adminMenu : customerMenu;

  const handleLogout = async () => {
    try {
      logout();
      // Optional: Add toast success here if you add a toast library later
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="h-14 flex items-center px-6 border-b border-slate-200 bg-white shadow-sm sticky top-0 z-40">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 mr-8 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow">
            SH
          </div>
          <span className="font-semibold text-slate-800 text-sm hidden sm:block">ShipHub-20260518.01</span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 flex items-center gap-1">
          {activeMenuItems.map((item) => {
            const isActive = item.path
              ? location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
              : item.children?.some((c) => location.pathname.startsWith(c.path));

            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  to={item.path!}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  {item.label}
                  <span className="text-[10px] opacity-50">▾</span>
                </button>

                {openMenu === item.label && (
                  <div className="absolute top-full left-0 pt-1 min-w-[160px] z-50">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-4 py-2 text-sm transition-colors ${location.pathname === child.path
                            ? 'text-indigo-600 bg-indigo-50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3 ml-4">
          <span className="text-sm text-slate-500 hidden md:block">
            {user?.firstName} {user?.lastName} ({user?.role})
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="mx-auto px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
