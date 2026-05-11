/**
 * TanStack Query key factory for history domain
 */

export const historyKeys = {
  all: ['history'] as const,
  lists: () => [...historyKeys.all, 'list'] as const,
  list: (limit?: number, offset?: number) => [...historyKeys.lists(), { limit, offset }] as const,
  entries: () => [...historyKeys.all, 'entries'] as const,
  entry: (id: string) => [...historyKeys.entries(), id] as const,
};
