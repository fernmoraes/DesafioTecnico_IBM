import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, EyeOff, Check, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { useSummary } from '../context/SummaryContext';
import { validatePassword } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const PasswordInput = ({ value, onChange, placeholder, disabled, showStrength = false }) => {
  const [visible, setVisible] = useState(false);
  const rules = [
    { label: 'At least 8 characters', pass: value.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(value) },
    { label: 'Lowercase letter', pass: /[a-z]/.test(value) },
    { label: 'Number', pass: /\d/.test(value) },
    { label: 'Special character', pass: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) },
  ];

  return (
    <div>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder={placeholder}
        required
        disabled={disabled}
      />
      <button
        type="button"
        className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 hover:text-primary-600 transition-colors"
        onClick={() => setVisible(v => !v)}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        {visible ? 'Hide password' : 'Show password'}
      </button>
      {showStrength && value.length > 0 && (
        <ul className="mt-1 space-y-1">
          {rules.map(rule => (
            <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.pass ? 'text-green-600' : 'text-gray-400'}`}>
              {rule.pass ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              {rule.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const LoginPage = () => {
  const { login, createUser } = useUser();
  const { clearAll } = useSummary();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      clearAll();
      await login(loginData.email, loginData.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { valid, errors } = validatePassword(registerData.password);
    if (!valid) {
      toast.error(`Password requirements not met: ${errors[0]}`);
      return;
    }
    try {
      setLoading(true);
      clearAll();
      await createUser(registerData.name, registerData.email, registerData.password);
      toast.success('Account created! Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md">
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
                tab === 'login' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === 'register' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <PasswordInput
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" loading={loading} disabled={loading}>
                Login
              </Button>
              <p className="text-center text-sm text-gray-500">
                No account?{' '}
                <button type="button" className="text-primary-600 hover:underline font-medium" onClick={() => setTab('register')}>
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <PasswordInput
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="Create a password"
                  disabled={loading}
                  showStrength
                />
              </div>
              <Button type="submit" className="w-full" loading={loading} disabled={loading}>
                Create Account
              </Button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" className="text-primary-600 hover:underline font-medium" onClick={() => setTab('login')}>
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
