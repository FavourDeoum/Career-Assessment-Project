import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaBook, FaVideo, FaNewspaper } from 'react-icons/fa';
import './Resources.css';

const resources = [
  {
    title: 'Introduction to Software Development',
    type: 'Article',
    category: 'Technology',
    icon: FaNewspaper,
  },
  {
    title: 'Data Science Fundamentals',
    type: 'Course',
    category: 'Data Science',
    icon: FaBook,
  },
  {
    title: 'UX Design Principles',
    type: 'Video',
    category: 'Design',
    icon: FaVideo,
  },
  {
    title: 'Machine Learning Basics',
    type: 'Article',
    category: 'Technology',
    icon: FaNewspaper,
  },
  {
    title: 'Digital Marketing Strategies',
    type: 'Course',
    category: 'Marketing',
    icon: FaBook,
  },
  {
    title: 'Financial Planning for Beginners',
    type: 'Video',
    category: 'Finance',
    icon: FaVideo,
  },
];

const categories = ['All', 'Technology', 'Data Science', 'Design', 'Marketing', 'Finance'];

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || resource.category === selectedCategory)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="resources-page"
    >
      <div className="resources-container">
        <h1 className="resources-title">Career Resources</h1>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search resources..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filters">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`category-button ${
                selectedCategory === category ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </motion.button>
          ))}
        </div>
        <div className="resources-grid">
          {filteredResources.map((resource, index) => (
            <ResourceCard key={index} resource={resource} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ResourceCard = ({ resource }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="resource-card"
  >
    <div className="card-header">
      <resource.icon className="resource-icon" />
      <h2 className="resource-title">{resource.title}</h2>
    </div>
    <div className="card-footer">
      <span className="resource-type">{resource.type}</span>
      <span className="resource-category">{resource.category}</span>
    </div>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="view-resource-button"
    >
      View Resource
    </motion.button>
  </motion.div>
);

export default Resources;

