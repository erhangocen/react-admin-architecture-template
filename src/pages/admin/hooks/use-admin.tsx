import { useLanguagePreference } from '@/hooks/use-language-preference'
import { useGetDashboardSubtitleItems } from '@/pages/dashboard/pages/customer/hooks/use-get-dashboard-subtitle-items'
import { ReactNode, createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { AdminPanelSubtitles } from '../data/admin-panel-subtitles'
import { HeaderSubtitleItemType } from '@/lib/dashboard-utils'
import { useGetAdminPanelSubtitleItems } from './use-get-admin-panel-subtitle-items'

interface IAdminContext {
  navigateAdminPanelSubtitle: (newTab: string) => string
  getCurrentTab: () => string
  adminPanelSubtitleItems: HeaderSubtitleItemType[]
  dashboardSubtitles: HeaderSubtitleItemType[]
}

interface AdminProviderProps {
  children: ReactNode
}

export const AdminContext = createContext<IAdminContext>({} as IAdminContext)

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { getStaticTextDatasForPreference } = useLanguagePreference()
  const { pathname } = useLocation()

  const navigateAdminPanelSubtitle = (newTab: string) => {
    return `/admin/${newTab}`
  }

  const getCurrentTab = () => {
    let currentTab = ''
    Object.values(AdminPanelSubtitles).map((item) => {
      if (pathname.includes(item)) {
        currentTab = item
      }
    })
    return currentTab
  }

  const adminPanelSubtitleItems: HeaderSubtitleItemType[] =
    useGetAdminPanelSubtitleItems()

  const dashboardSubtitles = useGetDashboardSubtitleItems(
    (newTab) => '/dashboard?tab=' + newTab
  )

  return (
    <AdminContext.Provider
      value={{
        navigateAdminPanelSubtitle,
        getCurrentTab,
        adminPanelSubtitleItems,
        dashboardSubtitles,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
