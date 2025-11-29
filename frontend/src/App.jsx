import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Layout
import AppShell from './components/layout/AppShell';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Onboarding from './pages/Auth/Onboarding';

// Main Pages
import Main from './pages/home/Main';
import UploadResume from './pages/resume/UploadResume';
import ResumeResult from './pages/resume/ResumeResult';
import InterviewInput from './pages/interview/InterviewInput';
import InterviewResult from './pages/interview/InterviewResult';
import History from './pages/history/History';

// Loading Spinner Component (no Tailwind needed)
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #2563eb',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/main" replace />;
  }

  return children;
};

// Onboarding Route (only for users who haven't completed onboarding)
const OnboardingRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.profileComplete) {
    return <Navigate to="/main" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              <OnboardingRoute>
                <Onboarding />
              </OnboardingRoute>
            } 
          />

          {/* Protected Routes - Wrapped in AppShell */}
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Main />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-upload"
            element={
              <ProtectedRoute>
                <AppShell>
                  <UploadResume />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-result/:analysisId"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ResumeResult />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <AppShell>
                  <InterviewInput />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-result/:prepId"
            element={
              <ProtectedRoute>
                <AppShell>
                  <InterviewResult />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AppShell>
                  <History />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
