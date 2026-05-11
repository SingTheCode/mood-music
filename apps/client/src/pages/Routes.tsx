import { Routes as RouterRoutes, Route } from "react-router-dom";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/player" element={<div>Player</div>} />
      <Route path="/history" element={<div>History</div>} />
    </RouterRoutes>
  );
}
