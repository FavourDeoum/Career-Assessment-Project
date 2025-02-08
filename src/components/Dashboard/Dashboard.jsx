import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaChartBar, FaBook, FaUser } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="dashboard-page"
    >
      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
        <div className="dashboard-grid">
          <DashboardCard
            icon={<FaClipboardList className="card-icon" />}
            title="Career Assessment"
            description="Take our comprehensive career assessment"
            link="/assessment"
          />
          <DashboardCard
            icon={<FaChartBar className="card-icon" />}
            title="Career Recommendations"
            description="Explore your personalized career recommendations"
            link="/recommendations"
          />
          <DashboardCard
            icon={<FaBook className="card-icon" />}
            title="Resources"
            description="Access career guides and educational materials"
            link="/resources"
          />
          <DashboardCard
            icon={<FaUser className="card-icon" />}
            title="My Profile"
            description="Update your personal information and preferences"
            link="/profile"
          />
        </div>
      </div>
    </motion.div>
  );
};

const DashboardCard = ({ icon, title, description, link }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
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









// import React from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { FaClipboardList, FaChartBar, FaBook, FaUser } from 'react-icons/fa';
// import './Dashboard.css';

// const Dashboard = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="dashboard-page"
//     >
//       <div className="dashboard-container">
//         <h1 className="dashboard-title">Welcome, [User Name]!</h1>
//         <div className="dashboard-grid">
//           <DashboardCard
//             icon={<FaClipboardList className="card-icon" />}
//             title="Start Assessment"
//             description="Take our comprehensive career assessment"
//             link="/assessment"
//           />
//           <DashboardCard
//             icon={<FaChartBar className="card-icon" />}
//             title="View Recommendations"
//             description="Explore your personalized career recommendations"
//             link="/recommendations"
//           />
//           <DashboardCard
//             icon={<FaBook className="card-icon" />}
//             title="Resources"
//             description="Access career guides and educational materials"
//             link="/resources"
//           />
//           <DashboardCard
//             icon={<FaUser className="card-icon" />}
//             title="My Profile"
//             description="Update your personal information and preferences"
//             link="/profile"
//           />
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const DashboardCard = ({ icon, title, description, link }) => (
//   <motion.div
//     whileHover={{ scale: 1.05 }}
//     className="dashboard-card"
//   >
//     <Link to={link} className="card-link">
//       <div className="card-content">
//         <div className="card-icon-wrapper">{icon}</div>
//         <div className="card-text">
//           <h3 className="card-title">{title}</h3>
//           <p className="card-description">{description}</p>
//         </div>
//       </div>
//     </Link>
//   </motion.div>
// );

// export default Dashboard;

