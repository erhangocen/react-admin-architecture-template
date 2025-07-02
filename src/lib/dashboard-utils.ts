export const navigateDashboardSubtitleByCompanyAndLocation = ({
  customerName,
  locationName,
  newTab,
}: {
  customerName: string;
  locationName: string;
  newTab: string;
}) => {
  return `/dashboard/${customerName}/${locationName}/${newTab}`;
};

export type HeaderSubtitleItemType = {
  subtitle: string;
  title: string;
  link: string;
};
