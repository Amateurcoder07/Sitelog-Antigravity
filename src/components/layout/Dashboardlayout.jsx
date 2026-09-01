import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Search, User as UserIcon, Sun, Moon, LogOut, Plus, Bell } from 'lucide-react';
import Logo from '../Logo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import API from '../../api';

export default function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const fetchNotificationCount = useCallback(() => {
    API.get('/notifications')
      .then((res) => setNotificationCount(res.data.notifications.length))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchNotificationCount(); // on mount / on navigating back to a Dashboard-layout page

    const interval = setInterval(fetchNotificationCount, 15000); // poll every 15s while this layout is active

    const handleFocus = () => fetchNotificationCount(); // refetch when the tab/window regains focus
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchNotificationCount]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const searchInput = (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-2.5 text-black/40 dark:text-white/40" size={15} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search your projects…"
        className="w-full bg-white dark:bg-[#0a0a0a] border border-black/15 dark:border-white/15 rounded-lg pl-9 pr-3 py-2 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <Logo />

          <div className="flex-1 max-w-sm hidden sm:block">{searchInput}</div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenCreateModal((n) => n + 1)}
              className="flex items-center gap-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold px-3.5 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Project</span>
            </button>

            <Link
              to="/notifications"
              onClick={() => setNotificationCount(0)} // optimistic clear; will be corrected by the next poll if some remain unresolved
              className="relative w-9 h-9 flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-black/70 dark:text-white/70 hover:border-black/30 dark:hover:border-white/30 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-black/70 dark:text-white/70 hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link
              to="/profile"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity"
              aria-label="Profile"
              title={user?.name}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={15} />}
            </Link>

            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="w-9 h-9 flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-black/70 dark:text-white/70 hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        <div className="sm:hidden px-4 pb-3">{searchInput}</div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <Outlet context={{ searchQuery, openCreateModalSignal: openCreateModal }} />
      </main>
    </div>
  );
}