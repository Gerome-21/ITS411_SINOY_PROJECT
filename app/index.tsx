import React from 'react';
import { useAuth } from './_layout';
import AuthScreen from './auth/AuthScreen';
import Dashboard from './dashboard/Dashboard';

export default function App() {
  const { user } = useAuth();

  return user ? <Dashboard /> : <AuthScreen />;
}