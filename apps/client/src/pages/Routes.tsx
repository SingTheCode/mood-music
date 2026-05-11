import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { HomePage } from './HomePage';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/player" element={<div>Player</div>} />
      <Route path="/history" element={<div>History</div>} />
    </RouterRoutes>
  );
}
