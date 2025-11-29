import React from 'react';
import { Outlet } from 'react-router-dom';

function AppShell() {
  return (
    <div>
      <div style={{ padding: '1rem', backgroundColor: '#f3f4f6' }}>
        <p>Sidebar (Placeholder - Developer A will create)</p>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;