import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { HomePage } from './HomePage';
import { PlayerPage } from './PlayerPage';
import { HistoryPage } from './HistoryPage';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/player" element={<PlayerPage />} />
      <Route path="/history" element={<HistoryPage />} />
    </RouterRoutes>
  );
}
