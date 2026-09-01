import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    () => localStorage.getItem('terracore-selected-project') || null
  );
  const [isLoading, setIsLoading] = useState(true);

  const refreshProjects = useCallback(() => {
    if (!isAuthenticated) return Promise.resolve();
    return API.get('/projects/mine')
      .then((res) => {
        setProjects(res.data.projects);
        setSelectedProjectId((current) => {
          const stillValid = res.data.projects.some((p) => p._id === current);
          if (stillValid) return current;
          return res.data.projects[0]?._id || null;
        });
      })
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return; // wait until we know whether the user is signed in
    if (!isAuthenticated) {
      setProjects([]);
      setIsLoading(false);
      return;
    }
    refreshProjects();
  }, [authLoading, isAuthenticated, refreshProjects]);

  useEffect(() => {
    if (selectedProjectId) localStorage.setItem('terracore-selected-project', selectedProjectId);
  }, [selectedProjectId]);

  return (
    <ProjectContext.Provider
      value={{ projects, selectedProjectId, setSelectedProjectId, isLoading, refreshProjects }}
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