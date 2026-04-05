import { createContext, useContext, useState, useEffect } from 'react';
import { createUser as createUserAPI, loginUser as loginUserAPI, getUser as getUserAPI, updateUser as updateUserAPI } from '../services/userService';

import { STORAGE_KEYS } from '../utils/constants';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        console.log('Loading user from localStorage:', savedUser);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log('Parsed user:', parsedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Error loading user from localStorage:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        console.log('Saving user to localStorage:', user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } catch (err) {
        console.error('Error saving user to localStorage:', err);
      }
    } else {
      console.log('User is null, not saving to localStorage');
    }
  }, [user]);

  const createUser = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await createUserAPI({ name, email, password });
      console.log('User created:', newUser);
      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates) => {
    if (!user) {
      throw new Error('No user to update');
    }
    
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await updateUserAPI(user.id, updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const loggedUser = await loginUserAPI(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const freshUser = await getUserAPI(user.id);
      setUser(freshUser);
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const value = {
    user,
    loading,
    error,
    createUser,
    login,
    updateUser,
    refreshUser,
    logout,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Made with Bob
