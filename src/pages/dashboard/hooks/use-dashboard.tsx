import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DashboardSubtitles } from '../data/dashboardSubtitles';
import { useGetCustomerList } from '@/hooks/customer/use-get-customer-list';
import { useGetLocationList } from '@/hooks/location/use-get-location-list';
import { useQuery } from '@tanstack/react-query';
import { useGetCustomer } from '@/hooks/customer/use-get-customer';
import { QueryKeys } from '@/data/query-keys';
import { useGetLocation } from '@/hooks/location/use-get-location';
import { useGetUserById } from '@/hooks/user/use-get-user-by-id';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/hooks/use-auth';
import { useGetCustomCustomerList } from '@/hooks/user/use-get-custom-customers';
import { useGetLocationCustomList } from '@/hooks/location/use-get-location-custom-list';
import { useGetUserByEmail } from '@/hooks/user/use-get-user-list';
import GeneralError from '@/pages/errors/general-error';
import { UserListResponseModel } from '@/data/models/response-models/user/user-list-response-model';

type State = {
  customerId?: string;
  locationId?: string;
};

interface IDashboardContext {
  state: State;
  setCustomer: (customerId: string) => void;
  setLocation: (locationId: string) => void;
  userData?: UserListResponseModel;
  redirectionLoading: boolean;
}

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardContext = createContext<IDashboardContext>(
  {} as IDashboardContext
);

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  const { customerName, locationName } = useParams();

  const [state, setState] = useState<State>({
    customerId: undefined,
    locationId: undefined,
  });

  const setCustomer = (customerId: string) => {
    setState((prev) => ({ ...prev, customerId }));
  };

  const setLocation = (locationId: string) => {
    setState((prev) => ({ ...prev, locationId }));
  };

  const { data: userData, isLoading: userLoading } = useQuery({
    queryFn: async () => await useGetUserByEmail(user?.email!),
    queryKey: [QueryKeys.UserGetById, user?.email],
    enabled: user?.email !== undefined,
  });

  const { isLoading: customerLoading, isError: isCustomerError } = useQuery({
    queryFn: async () => await getCustomerFnc(),
    queryKey: [QueryKeys.CustomerGet, customerName],
    enabled: customerName !== undefined,
  });

  const { isLoading: locationLoading, isError: isLocationError } = useQuery({
    queryFn: async () => await getLocationFnc(),
    queryKey: [QueryKeys.LocationGet, locationName],
    enabled: locationName !== undefined,
  });

  const getCustomerFnc = async () => {
    const response = await useGetCustomer({ name: customerName });
    setState((prev) => ({ ...prev, customerId: response?.id }));
    return response;
  };

  const getLocationFnc = async () => {
    const response = await useGetLocation({ name: locationName });
    setState((prev) => ({ ...prev, locationId: response?.id }));
    return response;
  };

  const getDefaultCustomerFnc = async () => {
    const response = await useGetCustomCustomerList({ page: 1, pageSize: 1 });
    const defaultCustomer = response?.[0];
    if (state.customerId === undefined) {
      setState((prev) => ({ ...prev, customerId: defaultCustomer.id }));
    }
    return defaultCustomer;
  };

  const getDefaultLocationFnc = async (
    customerId: string,
    locationIds: string[]
  ) => {
    const response = await useGetLocationCustomList({
      customerIds: [customerId],
      locationIds: locationIds,
      page: 1,
      pageSize: 1,
    });
    const defaultLocation = response?.[0];
    if (state.locationId === undefined) {
      setState((prev) => ({ ...prev, locationId: defaultLocation.id }));
    }
    return defaultLocation;
  };

  const {
    data: defaultCustomer,
    isLoading: defaultCustomerLoading,
    isError: isDefaultCustomerError,
  } = useQuery({
    queryFn: async () => await getDefaultCustomerFnc(),
    queryKey: [QueryKeys.UserGetCustomCustomers, user, customerName],
    enabled: user !== undefined && customerName === undefined,
  });

  const {
    data: defaultLocation,
    isLoading: defaultLocationLoading,
    isError: isDefaultLocationError,
  } = useQuery({
    queryFn: async () =>
      await getDefaultLocationFnc(defaultCustomer?.id!, userData?.locationIds!),
    queryKey: [
      QueryKeys.LocationGetCustomList,
      userData?.locationIds,
      defaultCustomer?.id,
      locationName,
    ],
    enabled:
      defaultCustomer?.id !== undefined &&
      userData?.locationIds !== undefined &&
      locationName === undefined,
  });

  const redirectionLoading =
    userLoading ||
    defaultCustomerLoading ||
    defaultLocationLoading ||
    customerLoading ||
    locationLoading;

  useEffect(() => {
    const handleInitialRedirection = () => {
      if (location.pathname === '/dashboard' && !redirectionLoading) {
        if (defaultCustomer && defaultLocation) {
          const defaultTab = location.search.split('?tab=')[1] ?? 'admin_panel';
          const defaultTabWithValidation = Object.values(
            DashboardSubtitles
          ).includes(defaultTab as DashboardSubtitles)
            ? defaultTab
            : 'admin_panel';

          navigate(
            `${defaultCustomer.name}/${defaultLocation.name}/${defaultTabWithValidation}`
          );
        }
      }
    };
    handleInitialRedirection();
  }, [
    location.pathname,
    navigate,
    defaultCustomer,
    defaultLocation,
    redirectionLoading,
    location.search,
  ]);

  if (
    isCustomerError ||
    isLocationError ||
    isDefaultCustomerError ||
    isDefaultLocationError
  ) {
    return <GeneralError />;
  }

  return (
    <DashboardContext.Provider
      value={{ state, setCustomer, setLocation, userData, redirectionLoading }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
