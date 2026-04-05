import { useState } from 'react';
import { User as UserIcon, Mail, Calendar, FileText, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatDate } from '../utils/formatters';
import toast, { Toaster } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, createUser, updateUser, logout } = useUser();
  const [isEditing, setIsEditing] = useState(!user);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (user) {
        await updateUser(formData);
        toast.success('Profile updated successfully!');
      } else {
        await createUser(formData.name, formData.email);
        toast.success('Profile created successfully!');
      }
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user && !isEditing) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <Toaster position="top-right" />
        <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Create Your Profile
        </h2>
        <p className="text-gray-600 mb-6">
          Get started by creating your profile to use the AI Summarizer
        </p>
        <Button onClick={() => setIsEditing(true)} size="lg">
          Create Profile
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Profile
        </h1>
        <p className="text-gray-600">
          Manage your account information
        </p>
      </div>

      {isEditing ? (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {user ? 'Update Profile' : 'Create Profile'}
              </Button>
              {user && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user.name, email: user.email });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      ) : (
        <>
          <Card>
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Profile Information
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" onClick={logout} icon={LogOut}>
                  Logout
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Total Summaries</p>
                  <p className="font-medium text-gray-900">{user.summaryCount || 0}</p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProfilePage;

// Made with Bob
