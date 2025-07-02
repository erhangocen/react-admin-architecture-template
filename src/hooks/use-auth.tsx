import { jwtDecode } from 'jwt-decode';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useHistory } from './use-history';
import { DecodedJWTModel } from '@/data/models/base/decoded-jwt-model';

interface IAuthContext {
  user?: DecodedJWTModel;
  isAuthanticated?: boolean;
  // login: (loginModel: LoginRequestModel) => Promise<boolean>
  //   login: (
  //     loginModel: LoginRequestModel
  //   ) => Promise<SingleResponseModel<LoginResponseModel>>
  logOut: () => void;
  roles?: string[];
  login: (jwtToken: string) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthanticated, setIsAuthanticated] = useState<boolean>();
  const [user, setUser] = useState<DecodedJWTModel>();

  const { resetHistory } = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token != null) {
      updateUser(token);
    } else {
      setIsAuthanticated(false);
      setUser(undefined);
    }
  }, [localStorage.getItem('jwtToken')]);

  // useEffect(() => {
  //   setRoles(
  //     JSON.parse(
  //       user?.[
  //         'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
  //       ] ?? '[]'
  //     )
  //   );
  // }, [user]);

  const updateUser = async (token: string) => {
    setIsAuthanticated(true);
    const decodedJWTModel = jwtDecode<DecodedJWTModel>(token);
    setUser(decodedJWTModel);
  };

  const logOut = () => {
    setIsAuthanticated(false);
    localStorage.removeItem('jwtToken');
    resetHistory();
  };

  const login = (jwtToken: string) => {
    setIsAuthanticated(true);
    localStorage.setItem('jwtToken', jwtToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthanticated,
        logOut,
        roles:
          user?.[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ],

        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
