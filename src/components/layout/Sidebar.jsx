import React from 'react';
import { NavLink, Link, useParams } from 'react-router-dom';
import { Users, Layers, ShieldAlert, FileText, Leaf, FolderOpen, ArrowLeft, X, CalculatorIcon, FlaskConical } from 'lucide-react';
import Logo from '../Logo';

const navItems = [
  { name: 'Labour', path: 'labour', icon: Users },
  { name: 'Materials', path: 'materials', icon: Layers },
  { name: 'Lab Management', path: 'lab-management', icon: FlaskConical },
  { name: 'Document Inventory', path: 'documents-inventory', icon: FolderOpen },
  { name: 'Estimation & Costings', path: 'estimation&costing', icon: CalculatorIcon },
  { name: 'Safety', path: 'safety', icon: ShieldAlert },
  { name: 'Compliance', path: 'compliance', icon: FileText },
  { name: 'Carbon & Waste', path: 'carbon-waste', icon: Leaf },
];

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const { projectId } = useParams();

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 w-60 bg-white dark:bg-black border-r border-black/10 dark:border-white/10 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-black/10 dark:border-white/10">
          <Logo />
          <button
            onClick={onCloseMobile}
            className="md:hidden text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white p-1 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-4">
          <Link
            to="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            Back to Projects
          </Link>
        </div>

        <nav className="p-4 pt-1 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={`/projects/${projectId}/${item.path}`}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                    ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                    : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}