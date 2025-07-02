export enum AdminPanelSubtitles {
  USER_MANAGEMENT = 'user_management',
  END_USER_MANAGEMENT = 'end_user_management',
  CUSTOMER_MANAGEMENT = 'customer_management',
  LOCATION_MANAGEMENT = 'location_management',
  SMS_SERVICE_MANAGEMENT = 'sms_service_management',
  WHATSAPP_SERVICE_MANAGEMENT = 'whatsapp_service_management',
  SERVICE_APPLICATIONS = 'service_applications',
  END_USER_CHECK = 'end_user_check',
  QUERY_NETWORK_DEVICE = 'query_network_device',
  SYSTEM_LOGS = 'system_logs',
  ACCOUNTING = 'accounting',
  NETWORK_DEVICE_TYPE_MANAGEMENT = 'network_device_type_management',
}

export type AdminPanelSubtitleItemType = {
  link: AdminPanelSubtitles;
  title: string;
};
