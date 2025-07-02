import { createBrowserRouter } from 'react-router-dom';
import GeneralError from './pages/errors/general-error';
import NotFoundError from './pages/errors/not-found-error';
import MaintenanceError from './pages/errors/maintenance-error';
import { ApplicationItems } from './pages/dashboard/pages/customer/pages/applications/data/application-items';
import { DashboardSubtitles } from './pages/dashboard/data/dashboardSubtitles';
import { AdminPanelSubtitles } from './pages/admin/data/admin-panel-subtitles';

const router = createBrowserRouter([
  // Main routes
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell');
      return { Component: AppShell.default };
    },
    errorElement: <GeneralError />,
    children: [
      {
        lazy: async () => ({
          Component: (await import('./components/auth-not-required-pages'))
            .default,
        }),
        children: [
          {
            path: '/sign-in',
            lazy: async () => ({
              Component: (await import('./pages/auth/sign-in')).default,
            }),
          },
          {
            path: '/sign-in-2',
            lazy: async () => ({
              Component: (await import('./pages/auth/sign-in-2')).default,
            }),
          },
          {
            path: '/register',
            lazy: async () => ({
              Component: (await import('./pages/auth/sign-up')).default,
            }),
          },
          {
            path: '/passreset',
            lazy: async () => ({
              Component: (await import('./pages/auth/password-reset-confirm'))
                .default,
            }),
          },
          {
            path: '/forgot-password',
            lazy: async () => ({
              Component: (await import('./pages/auth/forgot-password')).default,
            }),
          },
          {
            path: '/otp',
            lazy: async () => ({
              Component: (await import('./pages/auth/otp')).default,
            }),
          },
        ],
      },
      {
        lazy: async () => ({
          Component: (await import('./components/auth-required-pages')).default,
        }),
        children: [
          {
            path: '/dashboard',
            lazy: async () => ({
              Component: (await import('./pages/dashboard')).default,
            }),
            children: [
              {
                path: ':customerName/:locationName',
                lazy: async () => ({
                  Component: (await import('./pages/dashboard/pages/customer'))
                    .default,
                }),
                errorElement: <GeneralError />,
                children: [
                  {
                    path: DashboardSubtitles.ADMIN_PANEL,
                    lazy: async () => ({
                      Component: (
                        await import(
                          '@/pages/dashboard/pages/customer/pages/admin-panel'
                        )
                      ).default,
                    }),
                  },
                  {
                    path: DashboardSubtitles.NETWORK_DEVICES,
                    lazy: async () => ({
                      Component: (
                        await import(
                          '@/pages/dashboard/pages/customer/pages/network-devices'
                        )
                      ).default,
                    }),
                    children: [
                      {
                        path: ':mac',
                        lazy: async () => ({
                          Component: (
                            await import(
                              '@/pages/dashboard/pages/customer/pages/network-devices/pages/network-device-details'
                            )
                          ).default,
                        }),
                      },
                    ],
                  },
                  {
                    path: DashboardSubtitles.APPLICATIONS,
                    lazy: async () => ({
                      Component: (
                        await import(
                          '@/pages/dashboard/pages/customer/pages/applications'
                        )
                      ).default,
                    }),

                    children: [
                      {
                        path: ApplicationItems.PORTAL_DESIGN,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.VPN_SERVER,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.BORDROPLUS,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.ERA,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.EASY_INTERNET,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.SURVEY,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.CAMPAIGNS,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.URL_LOGS,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.WEB_FILTER,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.REPORTS,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.IRA,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.SYSLOG_SERVER,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                      {
                        path: ApplicationItems.SYSLOG_CLIENT,
                        lazy: async () => ({
                          Component: (await import('@/pages/tasks')).default,
                        }),
                      },
                    ],
                  },
                  {
                    path: DashboardSubtitles.VERIFICATION_OPTIONS,
                    lazy: async () => ({
                      Component: (
                        await import(
                          '@/pages/dashboard/pages/customer/pages/verification-options'
                        )
                      ).default,
                    }),
                  },
                  {
                    path: DashboardSubtitles.NETWORK_SETTINGS,
                    lazy: async () => ({
                      Component: (
                        await import(
                          '@/pages/dashboard/pages/customer/pages/network-settings'
                        )
                      ).default,
                    }),
                  },
                  {
                    path: DashboardSubtitles.ACTIVE_DEVICES,
                    lazy: async () => ({
                      Component: (
                        await import(
                          '@/pages/dashboard/pages/customer/pages/active-devices'
                        )
                      ).default,
                    }),
                    children: [
                      {
                        path: ':mac',
                        lazy: async () => ({
                          Component: (
                            await import(
                              '@/pages/dashboard/pages/customer/pages/active-devices/pages/active-device-details'
                            )
                          ).default,
                        }),
                      },
                    ],
                  },
                ],
              },
            ],
          },

          {
            path: 'admin',
            lazy: async () => ({
              Component: (await import('./pages/admin')).default,
            }),
            errorElement: <GeneralError />,
            children: [
              {
                path: AdminPanelSubtitles.USER_MANAGEMENT,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/user-management')
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.CUSTOMER_MANAGEMENT,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/customer-management')
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.LOCATION_MANAGEMENT,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/location-management')
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.SMS_SERVICE_MANAGEMENT,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/sms-management')
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.WHATSAPP_SERVICE_MANAGEMENT,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/whatsapp-management')
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.NETWORK_DEVICE_TYPE_MANAGEMENT,
                lazy: async () => ({
                  Component: (
                    await import(
                      '@/pages/admin/pages/network-device-type-management'
                    )
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.END_USER_MANAGEMENT,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/whatsapp-management')
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.END_USER_CHECK,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/whatsapp-management')
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.SERVICE_APPLICATIONS,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/whatsapp-management')
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.QUERY_NETWORK_DEVICE,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/whatsapp-management')
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.SYSTEM_LOGS,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/whatsapp-management')
                  ).default,
                }),
              },
              {
                path: AdminPanelSubtitles.ACCOUNTING,
                lazy: async () => ({
                  Component: (
                    await import('@/pages/admin/pages/whatsapp-management')
                  ).default,
                }),
              },
            ],
          },
          // {
          //   path: 'tasks',
          //   lazy: async () => ({
          //     Component: (await import('@/pages/tasks')).default,
          //   }),
          // },
          // {
          //   path: 'chats',
          //   lazy: async () => ({
          //     Component: (await import('@/components/coming-soon')).default,
          //   }),
          // },
          // {
          //   path: 'apps',
          //   lazy: async () => ({
          //     Component: (await import('@/pages/apps')).default,
          //   }),
          // },
          // {
          //   path: 'users',
          //   lazy: async () => ({
          //     Component: (await import('@/components/coming-soon')).default,
          //   }),
          // },
          // {
          //   path: 'analysis',
          //   lazy: async () => ({
          //     Component: (await import('@/components/coming-soon')).default,
          //   }),
          // },
          // {
          //   path: 'extra-components',
          //   lazy: async () => ({
          //     Component: (await import('@/pages/extra-components')).default,
          //   }),
          // },
          // {
          //   path: 'settings',
          //   lazy: async () => ({
          //     Component: (await import('./pages/settings')).default,
          //   }),
          //   errorElement: <GeneralError />,
          //   children: [
          //     {
          //       index: true,
          //       lazy: async () => ({
          //         Component: (await import('./pages/settings/profile')).default,
          //       }),
          //     },
          // {
          //   path: 'account',
          //   lazy: async () => ({
          //     Component: (await import('./pages/settings/account')).default,
          //   }),
          // },
          //     {
          //       path: 'appearance',
          //       lazy: async () => ({
          //         Component: (await import('./pages/settings/appearance'))
          //           .default,
          //       }),
          //     },
          //     {
          //       path: 'notifications',
          //       lazy: async () => ({
          //         Component: (await import('./pages/settings/notifications'))
          //           .default,
          //       }),
          //     },
          //     {
          //       path: 'display',
          //       lazy: async () => ({
          //         Component: (await import('./pages/settings/display')).default,
          //       }),
          //     },
          //     {
          //       path: 'error-example',
          //       lazy: async () => ({
          //         Component: (await import('./pages/settings/error-example'))
          //           .default,
          //       }),
          //       errorElement: <GeneralError className='h-[50svh]' minimal />,
          //     },
          //   ],
          // },
        ],
      },
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
]);

export default router;
