import { Link } from 'react-router-dom';
import { FileText, History, User } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Header = () => {
  const { user } = useUser();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FileText className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Summarizer</h1>
              <p className="text-xs text-gray-500">Powered by IBM Granite</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Summarize</span>
            </Link>
            
            <Link
              to="/history"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <History className="w-5 h-5" />
              <span className="font-medium">History</span>
            </Link>

            {user && (
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">{user.name}</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

// Made with Bob
