import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PROJECTS, fetchDashboardData } from '../data/mockDashboardData';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [selectedProjectId, setSelectedProjectId] = useState('arconia-towers');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchDashboardData(selectedProjectId).then((data) => {
      if (isMounted) {
        setDashboardData(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  return (
    <ProjectContext.Provider
      value={{
        projects: MOCK_PROJECTS,
        selectedProjectId,
        setSelectedProjectId,
        dashboardData,
        isLoading
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
