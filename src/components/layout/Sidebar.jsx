import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Layers, ShieldAlert, FileText, Leaf, X, Building2 } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Labour', path: '/labour', icon: Users },
  { name: 'Materials', path: '/materials', icon: Layers },
  { name: 'Safety', path: '/safety', icon: ShieldAlert },
  { name: 'Compliance', path: '/compliance', icon: FileText },
  { name: 'Carbon & Waste', path: '/carbon-waste', icon: Leaf },
];

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 w-60 bg-[#040711] border-r border-slate-800/60 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/40">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-7 h-7 bg-[#ea580c] rounded-md flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">SiteLog</span>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1c1615] text-[#ea580c] border border-[#ea580c]/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#090e1a]'
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
