import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from '@/pages/Routes';
import { AiDisclosureSheet } from '@/shared/components/AiDisclosureSheet';
import { ExitConfirmDialog } from '@/shared/components/ExitConfirmDialog';
import { useUserKey } from '@/shared/hooks/useUserKey';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isLoading } = useUserKey();

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  return (
    <>
      <AiDisclosureSheet />
      <ExitConfirmDialog />
      <Routes />
    </>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
