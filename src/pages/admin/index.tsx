import { Button } from '@/components/custom/button';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import Logo from '@/components/ui/logo';
import { Separator } from '@/components/ui/seperator';
import { UserNav } from '@/components/user-nav';
import { cn } from '@/lib/utils';
import { IconBell, IconChevronRight } from '@tabler/icons-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SettingsMenu } from '../../components/custom/settings';
import { AdminContext, AdminProvider } from './hooks/use-admin';
import { BreadCrumbWithData } from '@/components/custom/breadcrumb';
import { AdminPanelSubtitles } from './data/admin-panel-subtitles';
import { useAuth } from '@/hooks/use-auth';

export default function Admin() {
  const { roles } = useAuth();
  const navigation = useNavigate();
  const location = useLocation();

  if (location.pathname === '/admin') {
    navigation('/admin/user_management');
  }

  return (
    <AdminProvider>
      <AdminContext.Consumer>
        {({ adminPanelSubtitleItems, getCurrentTab, dashboardSubtitles }) => {
          return (
            <div className='relative h-full overflow-hidden bg-background'>
              <main
                id='content'
                className={`h-full overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0`}
              >
                <Layout>
                  <LayoutHeader className='fixed z-10 h-[var(--admin-header-height)] w-full bg-background p-0 pt-5 md:px-0'>
                    <div className='flex w-full flex-col justify-between gap-4 bg-background'>
                      <div className='flex flex-row justify-between px-12'>
                        <div className='flex flex-row items-center gap-5'>
                          <Logo link />
                          <Separator orientation='vertical' />
                          <BreadCrumbWithData
                            separator={<IconChevronRight size={18} />}
                            items={[
                              { title: roles?.[0] ?? '' },
                              {
                                title:
                                  adminPanelSubtitleItems.find(
                                    (x) => x.subtitle === getCurrentTab()
                                  )?.title ?? '',
                                children: adminPanelSubtitleItems.map(
                                  (item, index) => ({
                                    title: item.title,
                                    link: item.link,
                                    isActive: item.subtitle === getCurrentTab(),
                                  })
                                ),
                              },
                            ]}
                          />
                        </div>
                        <div className='flex flex-row'>
                          <div className='flex items-center space-x-4'>
                            <Search />
                            <Button
                              size='icon'
                              variant='ghost'
                              className='rounded-full'
                              onClick={() => null}
                            >
                              <IconBell size={22} />
                            </Button>
                            {/* <SettingsMenu items={dashboardSubtitles} /> */}
                            <ThemeSwitch />
                            <UserNav />
                          </div>
                        </div>
                      </div>
                      {/* <div className='flex flex-col gap-3 bg-background'>
                        <div className='flex flex-row justify-center gap-10 overflow-x-auto'>
                          {adminPanelSubtitleItems.map((item, index) => (
                            <Link
                              to={item.link}
                              key={index}
                              className={cn(
                                'flex-shrink-0 whitespace-nowrap text-slate-600 text-sm',
                                item.subtitle === getCurrentTab() &&
                                  'text-sky-500'
                              )}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div> 
                        
                      </div>*/}
                      <Separator orientation='horizontal' />
                    </div>
                  </LayoutHeader>

                  <LayoutBody className='w-full space-y-4 pt-[var(--admin-header-height)]'>
                    <div className='pt-6'>
                      <Outlet />
                    </div>
                  </LayoutBody>
                </Layout>
              </main>
            </div>
          );
        }}
      </AdminContext.Consumer>
    </AdminProvider>
  );
}
