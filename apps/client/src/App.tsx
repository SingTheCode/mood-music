import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from '@/pages/Routes';
import { AiDisclosureSheet } from '@/shared/components/AiDisclosureSheet';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AiDisclosureSheet />
        <Routes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
