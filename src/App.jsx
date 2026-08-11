import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Labour from './pages/Labour';
import Materials from './pages/Materials';
import Safety from './pages/Safety';
import Compliance from './pages/Compliance';
import CarbonWaste from './pages/CarbonWaste';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated Application Layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/labour" element={<Labour />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/carbon-waste" element={<CarbonWaste />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
