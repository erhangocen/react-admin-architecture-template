import { Outlet } from 'react-router-dom';
import { DashboardContext, DashboardProvider } from './hooks/use-dashboard';
import { CustomerProvider } from './pages/customer/hooks/use-customer';

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContext.Consumer>
        {({ state }) => (
          <div className='relative h-full overflow-hidden bg-background'>
            <CustomerProvider>
              <Outlet />
            </CustomerProvider>
          </div>
        )}
      </DashboardContext.Consumer>
    </DashboardProvider>
  );
}
