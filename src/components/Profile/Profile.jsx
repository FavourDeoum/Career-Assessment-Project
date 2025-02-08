import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaBirthdayCake, FaGraduationCap, FaSave } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    username: 'JohnDoe',
    email: 'johndoe@example.com',
    password: '',
    confirmPassword: '',
    age: '18',
    dateOfBirth: '2005-01-01',
    location: 'Yaounde, Cameroon',
    education: 'High School',
    interests: ['Technology', 'Science'],
    skills: ['Problem Solving', 'Communication'],
    bio: 'I am a student interested in technology and science.',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    setFormData({ ...formData, [field]: value.split(',').map(item => item.trim()) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update here
    console.log('Profile updated:', formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="profile-page"
    >
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">New Password (leave blank to keep current)</label>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="age" className="form-label">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <div className="input-group">
                <FaBirthdayCake className="input-icon" />
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <div className="input-group">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="education" className="form-label">Education Level</label>
              <div className="input-group">
                <FaGraduationCap className="input-icon" />
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="High School">High School</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="interests" className="form-label">Interests (comma-separated)</label>
              <input
                type="text"
                id="interests"
                name="interests"
                value={formData.interests.join(', ')}
                onChange={(e) => handleArrayChange(e, 'interests')}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="skills" className="form-label">Skills (comma-separated)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills.join(', ')}
                onChange={(e) => handleArrayChange(e, 'skills')}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="form-input"
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="submit-button"
            >
              <FaSave className="button-icon" />
              Save Changes
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;

