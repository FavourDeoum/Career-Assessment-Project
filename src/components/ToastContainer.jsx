return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="signup-page">
      <ToastContainer /> {/* Add this line */}
      <div className="signup-container">
        {/* Rest of your JSX */}
      </div>
    </motion.div>
  );