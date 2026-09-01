import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown, Menu, Sun, Moon } from 'lucide-react';
import Button from '../Button';

export default function Topbar({ onToggleMobileMenu }) {
  const { projects, selectedProjectId } = useProject();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const currentProject = projects.find((p) => p._id === selectedProjectId) || null;

  const handleSelect = (id) => {
    setIsOpen(false);
    navigate(`/projects/${id}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-white dark:bg-black transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white p-1.5 rounded-lg bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/15 cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {currentProject ? (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/15 text-black dark:text-white text-xs md:text-sm font-medium hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer"
            >
              <span className="truncate max-w-[140px] sm:max-w-none">{currentProject.name}</span>
              <ChevronDown size={15} className="text-black/40 dark:text-white/40 flex-shrink-0" />
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/15 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider">
                    Switch Project
                  </div>
                  {projects.map((proj) => (
                    <button
                      key={proj._id}
                      onClick={() => handleSelect(proj._id)}
                      className={`w-full text-left px-3.5 py-2 text-sm transition-colors flex items-center justify-between cursor-pointer ${
                        proj._id === selectedProjectId
                          ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white font-medium'
                          : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span>{proj.name}</span>
                      {proj._id === selectedProjectId && (
                        <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <span className="text-xs md:text-sm text-black/40 dark:text-white/40 px-1">No project selected</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-black/70 dark:text-white/70 hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <Button variant="outline" onClick={handleLogout} className="text-xs px-3 md:px-4 py-1.5">
          Log out
        </Button>
      </div>
    </header>
  );
}