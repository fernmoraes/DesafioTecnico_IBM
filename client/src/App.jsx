import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { SummaryProvider } from './context/SummaryContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <UserProvider>
        <SummaryProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Route>
          </Routes>
        </SummaryProvider>
      </UserProvider>
    </Router>
  );
}

export default App;

// Made with Bob
