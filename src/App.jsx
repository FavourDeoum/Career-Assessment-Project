import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LandingPage from './components/LandingPage/LandingPage';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import CareerAssessment from './components/CareerAssessment/CareerAssessment';
import CareerDashboard from './components/AssesmentDashboard/ADashboard';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import './App.css';

// Define all routes in a single array for better maintainability
const publicRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/terms-of-service', element: <TermsOfService /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
];

const protectedRoutes = [
  { path: '/assessment', element: <CareerAssessment /> },
  { path: '/cdashboard', element: <CareerDashboard /> },
];

// Custom ProtectedRoute Component
function ProtectedRoute({ children }) {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Login />;
  }

  return children;
}

function App() {
  
  return (
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public routes */}
                {publicRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}

                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                {protectedRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProtectedRoute>
                        {element}
                      </ProtectedRoute>
                    }
                  />
                ))}
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
  );
}

export default App;