import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AppLayout from './components/layout/AppLayout';
import ProjectOverview from './pages/ProjectOverview';
import Labour from './pages/Labour';
import Materials from './pages/Materials';
import LabManagement from './pages/LabManagement';
import Safety from './pages/Safety';
import Compliance from './pages/Compliance';
import CarbonWaste from './pages/CarbonWaste';
import DocumentInventory from './pages/DocumentInventory';
import FolderDetail from './pages/FolderDetail';
import Notifications from './pages/Notifications';
import UploadPlan from './pages/EstimationAndCostingLayout';
import ProjectPlans from './pages/EstimationAndCostingLayout';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>

              {/* Project workspace — every route here is scoped to one project via :projectId */}
              <Route path="/projects/:projectId" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<ProjectOverview />} />
                <Route path="labour" element={<Labour />} />
                <Route path="materials" element={<Materials />} />
                <Route path="lab-management" element={<LabManagement />} />
                <Route path="documents-inventory" element={<DocumentInventory />} />
                <Route path="documents-inventory/:id" element={<FolderDetail />} />
                <Route path="safety" element={<Safety />} />
                <Route path="compliance" element={<Compliance />} />
                <Route path="carbon-waste" element={<CarbonWaste />} />
                <Route path="estimation&costing" element={<ProjectPlans />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;