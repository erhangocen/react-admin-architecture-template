import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import '@/index.css';
import router from '@/router';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';
import { HistoryProvider } from './hooks/use-history';
import { LanguagePreferenceProvider } from './hooks/use-language-preference';
import { toast } from './components/ui/use-toast';
import { ToastAction } from './components/ui/toast';
import { errorToast2 } from './components/custom/error-toast';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: errorToast2,
  }),
  mutationCache: new MutationCache({
    onError: errorToast2,
  }),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HistoryProvider>
        <AuthProvider>
          <LanguagePreferenceProvider>
            <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
              <RouterProvider router={router} />
              <Toaster />
            </ThemeProvider>
          </LanguagePreferenceProvider>
        </AuthProvider>
      </HistoryProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
