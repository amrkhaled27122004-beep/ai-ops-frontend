import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LandingPage from '@/pages/LandingPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import AppLayout from '@/layouts/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import FleetPage from '@/pages/FleetPage';
import ServerDetailPage from '@/pages/ServerDetailPage';
import AlertsPage from '@/pages/AlertsPage';
import IncidentSimulatorPage from '@/pages/IncidentSimulatorPage';
import type { JSX } from 'react';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="text-cyber-cyan font-mono text-sm animate-pulse">Authenticating...</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/sign-in" replace />;
  return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="text-cyber-cyan font-mono text-sm animate-pulse">Loading...</div>
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<PublicRoute><SignInPage /></PublicRoute>} />
          <Route path="/sign-up" element={<PublicRoute><SignUpPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>}
          />
          <Route
            path="/fleet"
            element={<ProtectedRoute><AppLayout><FleetPage /></AppLayout></ProtectedRoute>}
          />
          <Route
            path="/servers/:id"
            element={<ProtectedRoute><AppLayout><ServerDetailPage /></AppLayout></ProtectedRoute>}
          />
          <Route
            path="/alerts"
            element={<ProtectedRoute><AppLayout><AlertsPage /></AppLayout></ProtectedRoute>}
          />
          <Route
            path="/simulator"
            element={<ProtectedRoute><AppLayout><IncidentSimulatorPage /></AppLayout></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
