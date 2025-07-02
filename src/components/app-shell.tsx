import { Outlet } from 'react-router-dom';
import { AppShellContext, AppShellProvider } from './hooks/use-app-shell';
import NormalizeUrl from './normalize-url';

export default function AppShell() {
  return (
    <AppShellProvider>
      <AppShellContext.Consumer>
        {() => {
          return (
            <>
              <NormalizeUrl />
              <Outlet />
            </>
          );
        }}
      </AppShellContext.Consumer>
    </AppShellProvider>
  );
}
