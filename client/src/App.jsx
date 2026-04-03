import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { SummaryProvider } from './context/SummaryContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <UserProvider>
        <SummaryProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </SummaryProvider>
      </UserProvider>
    </Router>
  );
}

export default App;

// Made with Bob
