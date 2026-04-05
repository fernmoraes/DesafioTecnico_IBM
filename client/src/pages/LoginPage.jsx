import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { useSummary } from '../context/SummaryContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const LoginPage = () => {
  const { login, createUser } = useUser();
  const { clearAll } = useSummary();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [registerData, setRegisterData] = useState({ name: '', email: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail) {
      toast.error('Please enter your email');
      return;
    }
    try {
      setLoading(true);
      clearAll();
      await login(loginEmail);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerData.name || !registerData.email) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      clearAll();
      await createUser(registerData.name, registerData.email);
      toast.success('Account created! Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <FileText className="w-10 h-10 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Summarizer</h1>
          </div>
          <p className="text-gray-500">Powered by IBM Granite</p>
        </div>

        <Card>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === 'login'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === 'register'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setTab('register')}
            >
              Create Account
            </button>
          </div>

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" loading={loading} disabled={loading}>
                Login
              </Button>
              <p className="text-center text-sm text-gray-500">
                No account?{' '}
                <button
                  type="button"
                  className="text-primary-600 hover:underline font-medium"
                  onClick={() => setTab('register')}
                >
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" loading={loading} disabled={loading}>
                Create Account
              </Button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-primary-600 hover:underline font-medium"
                  onClick={() => setTab('login')}
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
