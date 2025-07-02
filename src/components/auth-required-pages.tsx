import { useAuth } from '@/hooks/use-auth';
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthNotRequiredPages() {
  const { isAuthanticated } = useAuth();

  return isAuthanticated === true ? <Outlet /> : null;
}
