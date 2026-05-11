import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * 테스트용 QueryClient를 생성합니다.
 * 재시도 비활성화, 무한 캐시 시간으로 설정됩니다.
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
}

/**
 * QueryClientProvider로 감싼 Wrapper 컴포넌트를 생성합니다.
 */
export function createWrapper() {
  const client = createTestQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

/**
 * QueryClientProvider를 포함한 커스텀 render 함수입니다.
 * 테스트에서 TanStack Query를 사용하는 컴포넌트를 렌더링할 때 사용합니다.
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: createWrapper(), ...options });
}
