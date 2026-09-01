import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

const DEMO_PROJECTS = [
  { _id: 'arconia-towers', id: 'arconia-towers', name: 'Arconia Towers', address: 'Andheri West, Mumbai', code: 'PRJ-101' },
  { _id: 'ganesh-towers', id: 'ganesh-towers', name: 'Ganesh Towers', address: 'Bandra West, Mumbai', code: 'PRJ-102' },
  { _id: 'nh-566', id: 'nh-566', name: 'NH 566 Highway Project', address: 'Panvel, Navi Mumbai', code: 'PRJ-103' }
];

export function ProjectProvider({ children }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState(
    () => localStorage.getItem('terracore-selected-project') || 'arconia-towers'
  );
  const [isLoading, setIsLoading] = useState(false);

  const addProject = (newProj) => {
    setProjects((prev) => [newProj, ...prev]);
    setSelectedProjectId(newProj._id || newProj.id);
  };

  const refreshProjects = useCallback(() => {
    return API.get('/projects/mine')
      .then((res) => {
        if (res.data?.projects && res.data.projects.length > 0) {
          setProjects(res.data.projects);
          setSelectedProjectId((current) => {
            const stillValid = res.data.projects.some((p) => (p._id === current || p.id === current));
            if (stillValid) return current;
            return res.data.projects[0]?._id || res.data.projects[0]?.id || 'arconia-towers';
          });
        } else {
          setProjects(DEMO_PROJECTS);
        }
      })
      .catch(() => {
        // API offline fallback: preserve demo projects or locally created ones
        setProjects((prev) => (prev.length > 0 ? prev : DEMO_PROJECTS));
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (authLoading) return;
    refreshProjects();
  }, [authLoading, isAuthenticated, refreshProjects]);

  useEffect(() => {
    if (selectedProjectId) localStorage.setItem('terracore-selected-project', selectedProjectId);
  }, [selectedProjectId]);

  return (
    <ProjectContext.Provider
      value={{ projects, selectedProjectId, setSelectedProjectId, isLoading, refreshProjects, addProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
}