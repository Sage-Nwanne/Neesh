import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublisherDashboard from './pages/PublisherDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
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
