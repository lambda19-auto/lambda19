import { Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Home from './pages/Home';
import Agents from './pages/Agents';
import Integrations from './pages/Integrations';
import Security from './pages/Security';
import Privacy from './pages/Privacy';
import Contacts from './pages/Contacts';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/security" element={<Security />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MotionConfig>
    </LanguageProvider>
  );
}
