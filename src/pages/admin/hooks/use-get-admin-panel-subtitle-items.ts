import { TextDatasType } from '@/data/language-types';
import { useLanguagePreference } from '@/hooks/use-language-preference';
import { HeaderSubtitleItemType } from '@/lib/dashboard-utils';
import { useMemo } from 'react';
import { AdminPanelSubtitles } from '../data/admin-panel-subtitles';

export const useGetAdminPanelSubtitleItems = () => {
  const { getStaticTextDatasForPreference } = useLanguagePreference();

  const adminPanelSubtitleItem = (
    subtitle: AdminPanelSubtitles,
    title: keyof TextDatasType
  ) => ({
    subtitle: subtitle,
    title: getStaticTextDatasForPreference()[title],
    link: '/admin/' + subtitle,
  });

  const adminpanelSubtitleItems: HeaderSubtitleItemType[] = useMemo(
    () => [
      adminPanelSubtitleItem(
        AdminPanelSubtitles.USER_MANAGEMENT,
        'userManagement'
      ),
      adminPanelSubtitleItem(
        AdminPanelSubtitles.CUSTOMER_MANAGEMENT,
        'customerManagement'
      ),
      adminPanelSubtitleItem(
        AdminPanelSubtitles.LOCATION_MANAGEMENT,
        'locationManagement'
      ),
      adminPanelSubtitleItem(
        AdminPanelSubtitles.SMS_SERVICE_MANAGEMENT,
        'smsServiceManagement'
      ),
      adminPanelSubtitleItem(
        AdminPanelSubtitles.WHATSAPP_SERVICE_MANAGEMENT,
        'whatsappServiceManagement'
      ),
      adminPanelSubtitleItem(
        AdminPanelSubtitles.NETWORK_DEVICE_TYPE_MANAGEMENT,
        'networkDeviceTypeManagement'
      ),
      adminPanelSubtitleItem(
        AdminPanelSubtitles.SERVICE_APPLICATIONS,
        'serviceApplications'
      ),
      adminPanelSubtitleItem(
        AdminPanelSubtitles.END_USER_MANAGEMENT,
        'endUserManagement'
      ),
      adminPanelSubtitleItem(
        AdminPanelSubtitles.END_USER_CHECK,
        'endUserCheck'
      ),
      adminPanelSubtitleItem(
        AdminPanelSubtitles.QUERY_NETWORK_DEVICE,
        'queryNetworkDevice'
      ),
      adminPanelSubtitleItem(AdminPanelSubtitles.SYSTEM_LOGS, 'systemLogs'),
      adminPanelSubtitleItem(AdminPanelSubtitles.ACCOUNTING, 'accounting'),
    ],
    [getStaticTextDatasForPreference]
  );

  return adminpanelSubtitleItems;
};
