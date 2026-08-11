import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ProjectProvider } from '../../context/ProjectContext';
import { ToastProvider } from '../../context/ToastContext';

export default function AppLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <ProjectProvider>
      <ToastProvider>
        <div className="flex min-h-screen bg-[#060913] text-slate-100 antialiased overflow-x-hidden">
          <Sidebar
            isMobileOpen={isMobileOpen}
            onCloseMobile={() => setIsMobileOpen(false)}
          />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </ToastProvider>
    </ProjectProvider>
  );
}
