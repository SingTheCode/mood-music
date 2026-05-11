/**
 * TanStack Query key factory for player domain
 */

export const playerKeys = {
  all: ['player'] as const,
  searches: () => [...playerKeys.all, 'searches'] as const,
  search: (keywords: string[]) => [...playerKeys.searches(), { keywords: keywords.sort().join(',') }] as const,
};
