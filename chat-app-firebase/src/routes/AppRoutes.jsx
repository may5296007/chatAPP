import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ChatPage from '../pages/ChatPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Route d'accueil */}
      <Route 
        path="/" 
        element={currentUser ? <Navigate to="/chat" replace /> : <HomePage />} 
      />

      {/* Routes publiques (accessibles uniquement si non connecté) */}
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/chat" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={currentUser ? <Navigate to="/chat" replace /> : <RegisterPage />} 
      />

      {/* Routes protégées (nécessitent authentification) */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Page 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;