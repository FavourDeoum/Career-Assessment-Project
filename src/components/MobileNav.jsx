// src/components/MobileNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, GraduationCap, Users, MessageCircle } from 'lucide-react'; // Or your icon library

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard", defaultColor: "text-purple-600" },
  { to: "/schools/all", icon: GraduationCap, label: "Schools" },
  { to: "/mentors/all", icon: Users, label: "Mentors" },
  { to: "/contact", icon: MessageCircle, label: "Contact" },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          const IconComponent = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center p-2 ${
                isActive ? 'text-purple-600' : (item.defaultColor || 'text-gray-500 hover:text-purple-600')
              }`}
            >
              <IconComponent size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;