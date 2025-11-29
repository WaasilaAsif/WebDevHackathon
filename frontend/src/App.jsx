import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AppShell from './components/layout/AppShell';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';

// Main Pages
import Main from './pages/home/Main';
import UploadResume from './pages/resume/UploadResume';
import ResumeResult from './pages/resume/ResumeResult';
import InterviewInput from './pages/interview/InterviewInput';
import InterviewResult from './pages/interview/InterviewResult';
import History from './pages/history/History';

function App() {
  // Developer B will implement actual authentication check
  const isAuthenticated = true; // Mock authentication

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />

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
          path="/resume-result"
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
          path="/interview-result"
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

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;