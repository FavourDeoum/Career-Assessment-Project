"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Phone,
  User,
  Mail,
  CreditCard,
  CheckCircle,
  Award,
  BookOpen,
  Target,
  Globe,
  DollarSign,
  ArrowRight,
} from "lucide-react"
import "./MentorBookingPage.css"

const MentorBookingPage = ({ mentor, onBack }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [sessionType, setSessionType] = useState("")
  const [sessionDuration, setSessionDuration] = useState("60")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    experience: "",
    goals: "",
    specificTopics: "",
    paymentMethod: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!mentor) {
    return <div>Mentor not found</div>
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!selectedDate) newErrors.selectedDate = "Please select a date"
      if (!selectedTime) newErrors.selectedTime = "Please select a time"
      if (!sessionType) newErrors.sessionType = "Please select a session type"
    }

    if (step === 2) {
      if (!formData.firstName) newErrors.firstName = "First name is required"
      if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.goals) newErrors.goals = "Please describe your goals"
    }

    if (step === 3) {
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required"
      if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"
      if (!formData.cvv) newErrors.cvv = "CVV is required"
      if (!formData.cardholderName) newErrors.cardholderName = "Cardholder name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      alert("Session booked successfully! You will receive a confirmation email with meeting details.")
      onBack()
    }, 2000)
  }

  const getSessionPrice = () => {
    const basePrice = Number.parseInt(mentor.price.replace(/[^0-9]/g, ""))
    const duration = Number.parseInt(sessionDuration)
    return (basePrice * (duration / 60)).toFixed(0)
  }

  const availableTimes = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
  ]

  const steps = [
    { number: 1, title: "Schedule", icon: <Calendar size={20} /> },
    { number: 2, title: "Details", icon: <User size={20} /> },
    { number: 3, title: "Payment", icon: <CreditCard size={20} /> },
    { number: 4, title: "Confirm", icon: <CheckCircle size={20} /> },
  ]

  return (
    <div className={`mentor-booking-page ${isVisible ? "visible" : ""}`}>
      {/* Header */}
      <div className="booking-header">
        <div className="booking-header-content">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
            <span className="back-text">Back to Mentors</span>
          </button>

          <div className="booking-title">
            <h1>Book a Session</h1>
            <p>Schedule your mentoring session with {mentor.name}</p>
          </div>
        </div>
      </div>

      {/* Mentor Info Card */}
      <div className="mentor-info-card">
        <div className="mentor-profile">
          <div className="mentor-avatar-large">
            <img src={mentor.image || "/placeholder.svg"} alt={mentor.name} />
            <div className="online-status"></div>
          </div>

          <div className="mentor-details">
            <h2 className="mentor-name">{mentor.name}</h2>
            <p className="mentor-title">{mentor.title}</p>

            <div className="mentor-stats-row">
              <div className="stat-item">
                <Star className="stat-icon" size={16} />
                <span>{mentor.rating}</span>
              </div>
              <div className="stat-item">
                <Award className="stat-icon" size={16} />
                <span>{mentor.sessions} sessions</span>
              </div>
              <div className="stat-item">
                <Clock className="stat-icon" size={16} />
                <span>{mentor.experience}</span>
              </div>
              <div className="stat-item">
                <DollarSign className="stat-icon" size={16} />
                <span>{mentor.price}</span>
              </div>
            </div>

            <div className="mentor-expertise-tags">
              {mentor.expertise.map((skill, index) => (
                <span key={index} className="expertise-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mentor-bio">
          <h3>About {mentor.name.split(" ")[0]}</h3>
          <p>{mentor.bio}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="progress-container">
        <div className="progress-steps">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`progress-step ${currentStep >= step.number ? "active" : ""} ${
                currentStep > step.number ? "completed" : ""
              }`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-info">
                <div className="step-number">{step.number}</div>
                <div className="step-title">{step.title}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>
        </div>
      </div>

      {/* Form Content */}
      <div className="booking-form-container">
        {currentStep === 1 && (
          <div className="form-step schedule-step">
            <h2 className="step-title">Schedule Your Session</h2>

            <div className="scheduling-grid">
              <div className="session-type-selection">
                <h3>Session Type</h3>
                <div className="session-types">
                  {mentor.sessionTypes.map((type, index) => (
                    <label key={index} className="session-type-option">
                      <input
                        type="radio"
                        name="sessionType"
                        value={type}
                        checked={sessionType === type}
                        onChange={(e) => setSessionType(e.target.value)}
                      />
                      <div className="option-content">
                        <div className="option-icon">
                          {type.includes("1-on-1") && <Video size={20} />}
                          {type.includes("Code") && <BookOpen size={20} />}
                          {type.includes("Career") && <Target size={20} />}
                          {type.includes("Interview") && <MessageSquare size={20} />}
                          {type.includes("Leadership") && <Award size={20} />}
                          {type.includes("Technical") && <BookOpen size={20} />}
                          {type.includes("Business") && <Target size={20} />}
                          {type.includes("Executive") && <Award size={20} />}
                          {type.includes("Statistical") && <BookOpen size={20} />}
                          {type.includes("Research") && <BookOpen size={20} />}
                          {type.includes("System") && <BookOpen size={20} />}
                        </div>
                        <span>{type}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.sessionType && <span className="error-message">{errors.sessionType}</span>}
              </div>

              <div className="duration-selection">
                <h3>Session Duration</h3>
                <div className="duration-options">
                  <label className="duration-option">
                    <input
                      type="radio"
                      name="duration"
                      value="30"
                      checked={sessionDuration === "30"}
                      onChange={(e) => setSessionDuration(e.target.value)}
                    />
                    <div className="option-content">
                      <Clock size={20} />
                      <span>30 minutes</span>
                      <span className="price">
                        ${(Number.parseInt(mentor.price.replace(/[^0-9]/g, "")) * 0.5).toFixed(0)}
                      </span>
                    </div>
                  </label>

                  <label className="duration-option">
                    <input
                      type="radio"
                      name="duration"
                      value="60"
                      checked={sessionDuration === "60"}
                      onChange={(e) => setSessionDuration(e.target.value)}
                    />
                    <div className="option-content">
                      <Clock size={20} />
                      <span>60 minutes</span>
                      <span className="price">{mentor.price}</span>
                    </div>
                  </label>

                  <label className="duration-option">
                    <input
                      type="radio"
                      name="duration"
                      value="90"
                      checked={sessionDuration === "90"}
                      onChange={(e) => setSessionDuration(e.target.value)}
                    />
                    <div className="option-content">
                      <Clock size={20} />
                      <span>90 minutes</span>
                      <span className="price">
                        ${(Number.parseInt(mentor.price.replace(/[^0-9]/g, "")) * 1.5).toFixed(0)}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="date-selection">
                <h3>Select Date</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={errors.selectedDate ? "error" : ""}
                />
                {errors.selectedDate && <span className="error-message">{errors.selectedDate}</span>}
              </div>

              <div className="time-selection">
                <h3>Available Times</h3>
                <div className="time-slots">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {errors.selectedTime && <span className="error-message">{errors.selectedTime}</span>}
              </div>
            </div>

            <div className="availability-note">
              <div className="availability-languages">
                <h4>Languages</h4>
                <div className="languages">
                  {mentor.languages.map((lang, index) => (
                    <span key={index} className="language-tag">
                      <Globe size={14} />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="availability-schedule">
                <h4>Mentor's Availability</h4>
                <div className="availability-times">
                  {mentor.availability.map((slot, index) => (
                    <div key={index} className="availability-slot">
                      <Clock size={14} />
                      <span>{slot}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step details-step">
            <h2 className="step-title">Your Information</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "error" : ""}
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "error" : ""}
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "error" : ""}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="form-group">
                <label>Current Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  placeholder="Enter your current role"
                />
              </div>

              <div className="form-group full-width">
                <label>Experience Level</label>
                <select value={formData.experience} onChange={(e) => handleInputChange("experience", e.target.value)}>
                  <option value="">Select your experience level</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="advanced">Advanced (5-10 years)</option>
                  <option value="expert">Expert (10+ years)</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Session Goals *</label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange("goals", e.target.value)}
                  className={errors.goals ? "error" : ""}
                  placeholder="What do you hope to achieve in this session? What specific challenges are you facing?"
                  rows={4}
                />
                {errors.goals && <span className="error-message">{errors.goals}</span>}
              </div>

              <div className="form-group full-width">
                <label>Specific Topics</label>
                <textarea
                  value={formData.specificTopics}
                  onChange={(e) => handleInputChange("specificTopics", e.target.value)}
                  placeholder="Any specific topics, technologies, or areas you'd like to focus on?"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step payment-step">
            <h2 className="step-title">Payment Information</h2>

            <div className="payment-summary">
              <h3>Session Summary</h3>
              <div className="session-details">
                <div className="detail-row">
                  <span>Mentor:</span>
                  <span>{mentor.name}</span>
                </div>
                <div className="detail-row">
                  <span>Session Type:</span>
                  <span>{sessionType}</span>
                </div>
                <div className="detail-row">
                  <span>Duration:</span>
                  <span>{sessionDuration} minutes</span>
                </div>
                <div className="detail-row">
                  <span>Date & Time:</span>
                  <span>
                    {selectedDate} at {selectedTime}
                  </span>
                </div>
                <div className="detail-row total">
                  <span>Total Amount:</span>
                  <span>${getSessionPrice()}</span>
                </div>
              </div>
            </div>

            <div className="payment-methods">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === "credit-card"}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  />
                  <div className="option-content">
                    <CreditCard size={20} />
                    <span>Credit/Debit Card</span>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  />
                  <div className="option-content">
                    <DollarSign size={20} />
                    <span>PayPal</span>
                  </div>
                </label>
              </div>
            </div>

            {formData.paymentMethod === "credit-card" && (
              <div className="card-details">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                      className={errors.cardholderName ? "error" : ""}
                      placeholder="Enter cardholder name"
                    />
                    {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      className={errors.cardNumber ? "error" : ""}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      className={errors.expiryDate ? "error" : ""}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                  </div>

                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      className={errors.cvv ? "error" : ""}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                  </div>
                </div>
              </div>
            )}

            <div className="payment-security">
              <div className="security-badge">
                <CheckCircle size={20} />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="form-step confirm-step">
            <h2 className="step-title">Confirm Your Booking</h2>

            <div className="confirmation-card">
              <div className="confirmation-header">
                <CheckCircle size={48} className="success-icon" />
                <h3>Almost Done!</h3>
                <p>Please review your booking details before confirming</p>
              </div>

              <div className="booking-summary">
                <div className="summary-section">
                  <h4>Session Details</h4>
                  <div className="summary-content">
                    <div className="summary-row">
                      <span>Mentor:</span>
                      <span>{mentor.name}</span>
                    </div>
                    <div className="summary-row">
                      <span>Session Type:</span>
                      <span>{sessionType}</span>
                    </div>
                    <div className="summary-row">
                      <span>Duration:</span>
                      <span>{sessionDuration} minutes</span>
                    </div>
                    <div className="summary-row">
                      <span>Date:</span>
                      <span>{selectedDate}</span>
                    </div>
                    <div className="summary-row">
                      <span>Time:</span>
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Your Information</h4>
                  <div className="summary-content">
                    <div className="summary-row">
                      <span>Name:</span>
                      <span>
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Email:</span>
                      <span>{formData.email}</span>
                    </div>
                    {formData.phone && (
                      <div className="summary-row">
                        <span>Phone:</span>
                        <span>{formData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Payment</h4>
                  <div className="summary-content">
                    <div className="summary-row">
                      <span>Method:</span>
                      <span>{formData.paymentMethod === "credit-card" ? "Credit/Debit Card" : "PayPal"}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Amount:</span>
                      <span>${getSessionPrice()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="terms-agreement">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>I agree to the terms of service and cancellation policy</span>
                </label>
              </div>

              <div className="next-steps">
                <h4>What happens next?</h4>
                <ul>
                  <li>You'll receive a confirmation email with meeting details</li>
                  <li>A calendar invite will be sent to your email</li>
                  <li>The mentor will reach out 24 hours before the session</li>
                  <li>You can reschedule up to 24 hours before the session</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button className="nav-button prev-button" onClick={prevStep}>
              <ArrowLeft size={18} />
              Previous
            </button>
          )}

          {currentStep < 4 ? (
            <button className="nav-button next-button" onClick={nextStep}>
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button className="nav-button confirm-button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Booking"}
              {!isSubmitting && <CheckCircle size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MentorBookingPage
