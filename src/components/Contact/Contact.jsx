import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import emailjs from 'emailjs-com';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        'service_56f423c', // Replace with your EmailJS service ID
        'template_u9p26jh', // Replace with your EmailJS template ID
        formData,
        '4EZiQWGgEh74yrfH3' // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          alert('Message sent successfully!');
          setFormData({ name: '', email: '', message: '' }); // Reset form
        },
        (error) => {
          console.error('Failed to send message:', error);
          alert('Failed to send message. Please try again.');
        }
      );
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="contact-page"
    >
      <div className="contact-container">
        <h1 className="contact-title">Contact Us</h1>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="form-input"
              required
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="submit-button"
          >
            <FaPaperPlane className="button-icon" />
            Send Message
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Contact;

