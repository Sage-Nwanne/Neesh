import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Home from './pages/Home';
import PublisherDashboard from './pages/PublisherDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import HealthStatus from './components/common/HealthStatus';
import Messages from './pages/Messages';
import Partners from './pages/Partners';
import Orders from './pages/Orders';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import AdminPanel from './pages/AdminPanel';

// Dashboard Pages
import Products from './pages/dashboard/Products';
import Customers from './pages/dashboard/Customers';
import Analytics from './pages/dashboard/Analytics';
import Widgets from './pages/dashboard/Widgets';
import Reports from './pages/dashboard/Reports';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="App">
        <HealthStatus />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<div>Auth page coming soon</div>} />
            <Route path="/publisher-application" element={<div>Publisher application coming soon</div>} />
            <Route path="/publisher-dashboard" element={<PublisherDashboard user={user} />} />
            <Route path="/retailer-dashboard" element={<RetailerDashboard user={user} />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/notifications" element={<Notifications />} />
            
            {/* Dashboard Routes */}
            <Route path="/products" element={<Products user={user} />} />
            <Route path="/customers" element={<Customers user={user} />} />
            <Route path="/analytics" element={<Analytics user={user} />} />
            <Route path="/widgets" element={<Widgets user={user} />} />
            <Route path="/reports" element={<Reports user={user} />} />
            <Route path="/admin" element={<AdminPanel user={user} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
