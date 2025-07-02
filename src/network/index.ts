import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

let baseUrl = 'https://urban-spoon-v6qp6v95r5qjcx5w4-';
// let baseUrl = 'https://vigilant-space-trout-4jwqj7rpq69vhj97p-';
// let baseUrl = 'http://localhost:';

export const baseAxiosConfig = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: 'Bearer ' + (localStorage.getItem('jwtToken') ?? ''),
    'x-content-type-options': 'nosniff',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' https://apis.google.com", // örnek CSP başlığı
    'x-frame-options': 'DENY', // Clickjacking koruması
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload', // HSTS
    'x-xss-protection': '1; mode=block', // XSS koruması
  },
});

const customUrl = (url: string) => {
  if (baseUrl == "http://localhost:") {
    return baseUrl + url.replace('.app.github.dev', '');;
  } else {
    return baseUrl.endsWith('-') ? baseUrl + url : baseUrl + '/' + url
  }
}

export const get = async (
  url: string,
  params?: AxiosRequestConfig<unknown>,
  headers?: any
) => {
  const response = await baseAxiosConfig.get(
    customUrl(url),
    {
      ...params,
      headers: { ...headers },
    }
  );

  return response.data;
};

export const post: <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig<unknown>,
  headers?: any
) => Promise<T> = async (
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig<unknown>,
  headers?: any
) => {
  const response: AxiosResponse<any, any> = await baseAxiosConfig.post(
    customUrl(url),
    data,
    {
      headers: {
        ...headers,
      },
      ...config,
    }
  );
  return response.data;
};

export const put = async (url: string, data?: unknown) => {
  const response = await baseAxiosConfig.put(
    customUrl(url),
    data
  );

  return response.data;
};

export const del = async (url: string, data: unknown) => {
  const response = await baseAxiosConfig.delete(
    customUrl(url),
    { data: data }
  );

  return response.data;
};

baseAxiosConfig.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseAxiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${baseUrl}/refreshToken`, {
            refreshToken,
          });
          // don't use axious instance that already configured for refresh token api call
          const newJwtToken = response.data.accessToken;
          localStorage.setItem('jwtToken', newJwtToken); //set new access token
          originalRequest.headers.Authorization = `Bearer ${newJwtToken}`;
          return axios(originalRequest); //recall Api with new token
        } catch (error) {
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }
    return Promise.reject(error);
  }
);
