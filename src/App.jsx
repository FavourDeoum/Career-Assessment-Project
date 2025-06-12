// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion';
// import { useUser } from '@clerk/clerk-react';
// import Navbar from './components/Navbar/Navbar';
// import Footer from './components/Footer/Footer';
// import LandingPage from './components/LandingPage/LandingPage';
// import About from './components/About/About';
// import Contact from './components/Contact/Contact';
// import Login from './components/Login/Login';
// import Signup from './components/Signup/Signup';
// import CareerAssessment from './components/CareerAssessment/CareerAssessment';
// import CareerDashboard from './components/AssesmentDashboard/ADashboard';
// import TermsOfService from './components/TermsOfService';
// import PrivacyPolicy from './components/PrivacyPolicy';
// import SSOCallback from './components/SSOCallback/SSOCallback';

// import './App.css';
// import CareerExplorePage from './components/pathsDirections/PathDirections';
// import SchoolDetailsWrapper from './components/pathsDirections/SchoolDetailsWrapper';
// import SchoolApplicationFormWrapper from './components/pathsDirections/SchoolApplicationFormWrapper';
// import MentorBookingWrapper from './components/pathsDirections/MentorBookingWrapper';
// import { ResultsProvider } from './contexts/ResultsContext';

// // Define all routes in a single array for better maintainability
// const publicRoutes = [
//   { path: '/', element: <LandingPage /> },
//   { path: '/about', element: <About /> },
//   { path: '/contact', element: <Contact /> },
//   { path: '/terms-of-service', element: <TermsOfService /> },
//   { path: '/privacy-policy', element: <PrivacyPolicy /> },
// ];

// const protectedRoutes = [
//   { path: '/assessment', element: <CareerAssessment /> },
//   { path: '/cdashboard', element: <CareerDashboard /> },
//   { path: '/explore', element: <CareerExplorePage /> },
//   { path: '/explore/school/:schoolId', element: <SchoolDetailsWrapper /> },
//   { path: '/explore/school/:schoolId/apply', element: <SchoolApplicationFormWrapper /> },
//   { path: '/explore/mentor/:mentorId', element: <MentorBookingWrapper /> },
// ];

// // Custom ProtectedRoute Component
// function ProtectedRoute({ children }) {
//   const { isSignedIn } = useUser();

//   if (!isSignedIn) {
//     return <Login />;
//   }

//   return children;
// }

// function App() {
//   return (
//     <ResultsProvider>
//        <Router>
//       <div className="App">
//         <Navbar />
//         <main className="main-content">
//           <AnimatePresence mode="wait">
//             <Routes>
//               {/* Public routes */}
//               {publicRoutes.map(({ path, element }) => (
//                 <Route key={path} path={path} element={element} />
//               ))}

//               {/* Authentication routes */}
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/signup/sso-callback" element={<SSOCallback />} />

//               {/* Protected routes */}
//               {protectedRoutes.map(({ path, element }) => (
//                 <Route
//                   key={path}
//                   path={path}
//                   element={
//                     <ProtectedRoute>
//                       {element}
//                     </ProtectedRoute>
//                   }
//                 />
//               ))}
//             </Routes>
//           </AnimatePresence>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//     </ResultsProvider>
   
//   );
// }

// export default App;





import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom'; // Added useLocation and Navigate
import { AnimatePresence } from 'framer-motion';
import { useUser, ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'; // Clerk components for auth handling

// Context
import { ResultsProvider } from './contexts/ResultsContext';

// Core Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Page Components
import LandingPage from './components/LandingPage/LandingPage';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Login from './components/Login/Login'; 
import Signup from './components/Signup/Signup'; 
import CareerAssessment from './components/CareerAssessment/CareerAssessment';
import CareerDashboard from './components/AssesmentDashboard/ADashboard'; 
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import SSOCallback from './components/SSOCallback/SSOCallback';


import './App.css';
import RecommendedSchoolsPage from './components/Schools/RecommendedSchoolsPage';
import AllSchoolsPage from './components/Schools/AllSchoolsPage';
import RecommendedMentorsPage from './components/Mentors/RecommendedMentorsPage';
import AllMentorsPage from './components/Mentors/AllMentorsPage';
import MentorDetailsPage from './components/Mentors/MentorDetailsPage';
import SchoolProfilePage from './components/Schools/SchoolProfilePage';
import ProgramDetailsPage from './components/Schools/ProgramDetailsPage';
import BookingPage from './components/Schools/BookingPage';

// Define all routes in a single array for better maintainability
const publicRoutes = [
  { path: '/', element: <LandingPage /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/terms-of-service', element: <TermsOfService /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
];

const authRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/signup/sso-callback', element: <SSOCallback /> },
];

const protectedRoutes = [
  { path: '/assessment', element: <CareerAssessment /> },
  { path: '/cdashboard', element: <CareerDashboard /> }, 
  // School Routes
  { path: '/schools/career/:careerSlug', element: <RecommendedSchoolsPage /> },
  { path: '/schools/all', element: <AllSchoolsPage /> },
  // Mentor Routes
  { path: '/mentors/career/:careerSlug', element: <RecommendedMentorsPage /> },
  { path: '/mentors/all', element: <AllMentorsPage /> },
  { path: '/mentor/:mentorId', element: <MentorDetailsPage /> },
  { path: '/book-session/:tutorSlug', element:<BookingPage/> },

  // THIS ROUTE CHANGES:
  { path: '/school/:schoolId', element: <SchoolProfilePage /> },
  // NEW ROUTE FOR PROGRAM DETAILS:
  { path: '/school/:schoolId/program/:programId', element: <ProgramDetailsPage /> },

];

// Main App Structure Component (to use useLocation for AnimatePresence)
function AppContent() {
  const location = useLocation(); // For AnimatePresence keying

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          {/* Keying Routes with location.pathname for AnimatePresence */}
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            {publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            {/* Authentication routes - these often use SignedOut or custom logic */}
            {authRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={
                <>
                  {/* Example: If you want to redirect signed-in users away from login/signup */}
                  {/* <SignedIn><Navigate to="/cdashboard" /></SignedIn>
                  <SignedOut>{element}</SignedOut> */}
                  {/* For now, just rendering the element as per your original structure */}
                  {element}
                </>
              } />
            ))}

            {/* Protected routes using Clerk's <SignedIn> and <SignedOut> */}
            {protectedRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  <>
                    <SignedIn>{element}</SignedIn>
                    <SignedOut><RedirectToSignIn redirectUrl={window.location.href} /></SignedOut>
                  </>
                }
              />
            ))}

            {/* Fallback for unmatched routes (optional) */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
             <Route path="*" element={<Navigate to="/" replace />} /> {/* Or a 404 page */}
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}


function App() {
  return (
      <ResultsProvider>
        <Router>
          <AppContent /> {/* Contains Navbar, main content with Routes, and Footer */}
        </Router>
      </ResultsProvider>

  );
}

export default App;