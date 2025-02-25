import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LandingPage from './components/LandingPage/LandingPage';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import CareerAssessment from './components/CareerAssessment/CareerAssessment';
import Resources from './components/Resources/Resources';
import Profile from './components/Profile/Profile';
import CareerRecommendations from './components/CareerRecomendations/CareerRecommendations';
import './App.css';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute'; 

// Define all routes in a single array for better maintainability
const routes = [
  { path: '/', element: <LandingPage /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/terms-of-service', element: <TermsOfService /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> }
];

// Define protected routes in a separate array
const protectedRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/assessment', element: <CareerAssessment /> },
  { path: '/recommendations', element: <CareerRecommendations /> },
  { path: '/resources', element: <Resources /> },
  { path: '/profile', element: <Profile /> }
];

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public routes */}
                {routes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  {protectedRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
                </Route>
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;