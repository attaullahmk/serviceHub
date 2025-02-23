import { createContext } from 'react';

export const AuthContext = createContext(null);

export const defaultAuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isServiceProvider: false
};