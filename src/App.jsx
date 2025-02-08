import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
// import { CaseProvider } from './contexts/CaseContext';
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
import './App.css';
import CareerRecommendations from './components/CareerRecomendations/CareerRecommendations';
const routes = [
  { path: "/", element: <LandingPage /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/assessment", element: <CareerAssessment /> },
  { path: "/recommendations", element: <CareerRecommendations /> },
  { path: "/resources", element: <Resources /> },
  { path: "/profile", element: <Profile /> },
];

function App() {
  return (
    <BrowserRouter>
      {/* <CaseProvider> */}
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <AnimatePresence mode="wait">
              <Routes>
                {routes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      {/* </CaseProvider> */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

















// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
