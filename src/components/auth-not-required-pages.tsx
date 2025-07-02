import { useAuth } from '@/hooks/use-auth';
import { Outlet } from 'react-router-dom';

export default function AuthNotRequiredPages() {
  const { isAuthanticated } = useAuth();

  return isAuthanticated === false ? <Outlet /> : null;
}
