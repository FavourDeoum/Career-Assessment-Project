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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
    console.log(`api key -${import.meta.env.VITE_EMAILJS_SERVICE_ID}`)
     console.log(`api key -${import.meta.env.VITE_EMAILJS_TEMPLATE_ID}`)

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }
  

    emailjs.send(
 import.meta.env.VITE_EMAILJS_SERVICE_ID,
 import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  formData,
 import.meta.env.VITE_EMAILJS_USER_ID
)
      .then(
        (response) => {
          setSubmitStatus('success');
          setFormData({ name: '', email: '', message: '' });
        },
        (error) => {
          setSubmitStatus('error');
          console.error('Failed to send message:', error);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
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
        
        {/* Status Messages */}
        {submitStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert success"
          >
            Message sent successfully!
          </motion.div>
        )}
        
        {submitStatus === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert error"
          >
            Failed to send message. Please try again.
          </motion.div>
        )}

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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder='Write down Your feedbacks, how EduVate has helped you!'
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="form-input"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            <FaPaperPlane className="button-icon" />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Contact;