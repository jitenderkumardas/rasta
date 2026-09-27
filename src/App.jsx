import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardView from './views/DashboardView';
import DriverView from './views/DriverView';
import FieldofficerView from './views/FieldofficerView';
import WarehouseView from './views/WarehouseView';
import CommunityView from './views/CommunityView';
import './styles/tokens.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'DDMA Dashboard', icon: '🗺️' },
  { path: '/driver', label: 'Driver', icon: '🚚' },
  { path: '/field-officer', label: 'Field Officer', icon: '👷' },
  { path: '/warehouse', label: 'Warehouse', icon: '🏭' },
  { path: '/community', label: 'Community', icon: '📱' }
];

function Navigation() {
  const location = useLocation();

  return (
    <nav className="nav-container">
      {/* Logo/Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'var(--color-bg)'
        }}>
          R
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text)', letterSpacing: '0.02em' }}>
            RASTA
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '-2px' }}>
            Smart Logistics Platform
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="nav-links-wrapper">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Status Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--color-status-low)',
          boxShadow: '0 0 8px var(--color-status-low)'
        }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          System Online
        </span>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/driver" element={<DriverView />} />
        <Route path="/field-officer" element={<FieldofficerView />} />
        <Route path="/warehouse" element={<WarehouseView />} />
        <Route path="/community" element={<CommunityView />} />
        <Route path="*" element={<DashboardView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;