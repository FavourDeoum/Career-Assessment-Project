// src/components/Layout.jsx or src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileNav from './MobileNav'; // Adjust path if necessary
// You might also have a DesktopHeader or Sidebar here

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Optional: <DesktopHeader /> or <Sidebar /> */}
      
      <main className="flex-grow">
        {/* Page content will be rendered here */}
        <Outlet /> 
      </main>
      
      {/* MobileNav will always be rendered at the bottom on mobile screens */}
      <MobileNav />
    </div>
  );
};

export default MainLayout;