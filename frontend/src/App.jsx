import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublisherDashboard from './pages/PublisherDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HealthStatus from './components/common/HealthStatus';
import { getCurrentUser } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('Checking...');

  // Check backend connection
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        // Use the health endpoint you just added
        const response = await axios.get('https://neesh-backend-8378fc8ecdf9.herokuapp.com/api/health');
        console.log('Backend health check response:', response.data);
        setBackendStatus('Connected');
      } catch (error) {
        console.error('Backend connection error:', error);
        setBackendStatus('Disconnected');
      }
    };
    
    checkBackendConnection();
  }, []);

  // Check for logged in user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem('token');
        
        if (token) {
          // Fetch current user data
          const response = await getCurrentUser();
          setUser(response.data);
          
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        
        // If API call fails, try to use stored user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Clear token if no user found
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      console.log('Current user in App:', user);
      console.log('User role:', user.role);
    }
  }, [user]);

  if (loading) {
    // You could add a loading spinner here
    return <div className="loading">Loading... Backend status: {backendStatus}</div>;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      {backendStatus !== 'Connected' && (
        <div style={{ background: 'red', color: 'white', padding: '10px', textAlign: 'center' }}>
          Warning: Backend connection issue. Some features may not work.
        </div>
      )}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ padding: '0 20px' }}>
          <HealthStatus />
        </div>
      )}
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/publisher-dashboard" element={<PublisherDashboard user={user} />} />
          <Route path="/retailer-dashboard" element={<RetailerDashboard user={user} />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
