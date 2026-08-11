import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { ChevronDown, Menu } from 'lucide-react';
import Button from '../Button';

export default function Topbar({ onToggleMobileMenu }) {
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleSelect = (id) => {
    setSelectedProjectId(id);
    setIsOpen(false);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-slate-800/40 bg-[#040711]">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg bg-[#090e1a] border border-slate-800 cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#090e1a] border border-slate-800 text-slate-200 text-xs md:text-sm font-medium hover:border-slate-700 transition-colors cursor-pointer"
          >
            <span className="truncate max-w-[140px] sm:max-w-none">{currentProject.name}</span>
            <ChevronDown size={15} className="text-slate-400 flex-shrink-0" />
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-[#090e1a] border border-slate-800 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Select Active Site
              </div>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => handleSelect(proj.id)}
                  className={`w-full text-left px-3.5 py-2 text-sm transition-colors flex items-center justify-between cursor-pointer ${
                    proj.id === selectedProjectId
                      ? 'bg-[#1c1615] text-[#ea580c] font-medium'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{proj.name}</span>
                  {proj.id === selectedProjectId && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logout Action */}
      <div>
        <Button variant="outline" onClick={handleLogout} className="text-xs px-3 md:px-4 py-1.5">
          Log out
        </Button>
      </div>
    </header>
  );
}
