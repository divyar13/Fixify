import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPrompt from './components/LoginPrompt';
import Home from './pages/Home';
import History from './pages/History';
import Community from './pages/Community';
import Stats from './pages/Stats';
import { AuthProvider, useAuth } from './context/AuthContext';
import { setAuthToken } from './api';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-line border-t-violet-600 rounded-full spin" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

function AppContent() {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  return (
    <Router>
      <div className="min-h-screen bg-neutral-950 flex flex-col">
        <Navbar />
        <main className="flex-1 pt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <Stats />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <LoginPrompt />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#f5f5f5',
              border: '1px solid #1f1f1f',
              fontSize: '13px',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
