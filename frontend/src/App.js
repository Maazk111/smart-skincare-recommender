import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import RecommendationForm from './components/RecommendationForm';
import UserHistory from './components/UserHistory';
import AdminDashboard from './components/admin/AdminDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8e44ad',
      light: '#bb8fce',
      dark: '#6c3483',
    },
    secondary: {
      main: '#f39c12',
      light: '#f7dc6f',
      dark: '#d68910',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2c3e50',
    },
    h5: {
      fontWeight: 500,
      color: '#34495e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Smart redirect component that sends admin to admin dashboard and users to dashboard
const SmartRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin users go to admin dashboard
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  // Regular users go to dashboard
  return <Navigate to="/dashboard" replace />;
};

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only routes
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  // User-only routes (admin cannot access)
  if (userOnly && user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    // Redirect based on user role
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<SmartRedirect />} />
              
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              
              {/* User-only routes - admin cannot access these */}
              <Route path="/dashboard" element={
                <ProtectedRoute userOnly={true}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/recommendation" element={
                <ProtectedRoute userOnly={true}>
                  <RecommendationForm />
                </ProtectedRoute>
              } />
              
              <Route path="/history" element={
                <ProtectedRoute userOnly={true}>
                  <UserHistory />
                </ProtectedRoute>
              } />
              
              {/* Admin-only route */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
