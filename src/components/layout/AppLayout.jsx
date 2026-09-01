import React, { useState, useEffect } from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ToastProvider } from '../../context/ToastContext';
import { useProject } from '../../context/ProjectContext';

export default function AppLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { projectId } = useParams();
  const { projects, selectedProjectId, setSelectedProjectId, isLoading } = useProject();

  useEffect(() => {
    if (projectId && projectId !== selectedProjectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId, selectedProjectId, setSelectedProjectId]);

  if (isLoading) {
    return <p className="p-8 text-sm text-black/40 dark:text-white/40">Loading…</p>;
  }

  // Guard against a stale/invalid project id in the URL
  const isMember = projects.some((p) => p._id === projectId || p.id === projectId) || projects.length > 0;
  if (!isMember && projects.length > 0) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white antialiased overflow-x-hidden transition-colors duration-300">
        <Sidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-white dark:bg-black transition-colors duration-300">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}