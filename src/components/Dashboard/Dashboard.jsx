import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaChartBar, FaBook, FaUser } from 'react-icons/fa';
import './Dashboard.css';
import { useUser } from '@clerk/clerk-react'; // Import Clerk's useUser hook

const Dashboard = () => {
  const { user } = useUser(); // Get the user data from Clerk
  console.log(user)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="dashboard-page"
    >
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome, {user?.fullName || 'Guest'}!</h1>
          <div className="profile-info">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt={`${user.fullName}'s Profile`}
                className="profile-image"
              />
            )}
          </div>
        </div>

        {/* Call-to-Action Message */}
        <p className="dashboard-message">
          Ready to discover your career path?{' '}
          <Link to="/assessment" className="dashboard-link">
            Start the Career Assessment
          </Link>
        </p>

        {/* Cards Grid */}
        <div className="dashboard-grid">
          <DashboardCard
            icon={<FaClipboardList className="card-icon" />}
            title="Career Assessment"
            description="Take our comprehensive career assessment"
            link="/assessment"
          />
          <DashboardCard
            icon={<FaChartBar className="card-icon" />}
            title="Performance Insights"
            description="View detailed insights into your performance"
            link="/insights"
          />
          <DashboardCard
            icon={<FaBook className="card-icon" />}
            title="Learning Resources"
            description="Access exclusive learning resources"
            link="/resources"
          />
          <DashboardCard
            icon={<FaUser className="card-icon" />}
            title="Profile Settings"
            description="Manage your account and personal information"
            link="/settings"
          />
        </div>
      </div>
    </motion.div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ icon, title, description, link }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="dashboard-card"
  >
    <Link to={link} className="card-link">
      <div className="card-content">
        <div className="card-icon-wrapper">{icon}</div>
        <div className="card-text">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default Dashboard;