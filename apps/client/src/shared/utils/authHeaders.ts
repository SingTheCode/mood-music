import { getUserKey } from '@/shared/hooks/useUserKey';

export function getAuthHeaders(): Record<string, string> {
  const userKey = getUserKey();
  return {
    'Content-Type': 'application/json',
    ...(userKey ? { 'x-user-id': userKey } : {}),
  };
}
