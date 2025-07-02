import { AUTH_PAGES } from '@/data/auth-pages';
import { useAuth } from '@/hooks/use-auth';
import { useHistory } from '@/hooks/use-history';
import React, { ReactNode, createContext, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface IAppShellContext {}

interface AppShellProviderProps {
  children: ReactNode;
}

export const AppShellContext = createContext<IAppShellContext>(
  {} as IAppShellContext
);

export const AppShellProvider: React.FC<AppShellProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthanticated } = useAuth();
  const { addRoute, historyStack } = useHistory();

  useEffect(() => {
    if (location.pathname) {
      addRoute(location.pathname);
    }
  }, [location.pathname, addRoute]);

  useEffect(() => {
    const handleInitialRedirection = () => {
      if (
        !isAuthanticated &&
        !AUTH_PAGES.some((x) => x === location.pathname)
      ) {
        navigate('/sign-in');
      }

      if (isAuthanticated && AUTH_PAGES.some((x) => x === location.pathname)) {
        navigate('/dashboard');
      }

      if (isAuthanticated && location.pathname === '/') {
        navigate('/dashboard');
      }
    };

    handleInitialRedirection();

    return () => {};
  }, [isAuthanticated, location.pathname, navigate, historyStack.length]);

  return (
    <AppShellContext.Provider value={{}}>{children}</AppShellContext.Provider>
  );
};

export const useAppShell = () => useContext(AppShellContext);
