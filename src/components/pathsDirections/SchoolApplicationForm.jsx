"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  CreditCard,
  Upload,
  CheckCircle,
  AlertCircle,
  DollarSign,
  ArrowRight,
} from "lucide-react"
import "./SchoolApplicationForm.css"

const SchoolApplicationForm = ({ school, onBack }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    // state: "",
    // zipCode: "",
    country: "",

    // Academic Information
    currentEducation: "",
    institution: "",
    gpa: "",
    graduationDate: "",
    major: "",

    // Documents
    transcript: null,
    resume: null,
    personalStatement: null,
    recommendations: [],

    // Payment Information
    paymentMethod: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",

    // Additional Information
    workExperience: "",
    whyThisProgram: "",
    careerGoals: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleFileUpload = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required"
      if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.phone) newErrors.phone = "Phone number is required"
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
      if (!formData.address) newErrors.address = "Address is required"
      if (!formData.city) newErrors.city = "City is required"
      if (!formData.country) newErrors.country = "Country is required"
    }

    if (step === 2) {
      if (!formData.currentEducation) newErrors.currentEducation = "Current education level is required"
      if (!formData.institution) newErrors.institution = "Institution name is required"
      if (!formData.gpa) newErrors.gpa = "GPA is required"
      if (!formData.major) newErrors.major = "Major/Field of study is required"
    }

    if (step === 4) {
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
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Application submitted successfully! You will receive a confirmation email shortly.")
      onBack()
    }, 2000)
  }

  const steps = [
    { number: 1, title: "Personal Info", icon: <User size={20} /> },
    { number: 2, title: "Academic", icon: <GraduationCap size={20} /> },
    { number: 3, title: "Documents", icon: <FileText size={20} /> },
    { number: 4, title: "Payment", icon: <CreditCard size={20} /> },
    { number: 5, title: "Review", icon: <CheckCircle size={20} /> },
  ]

  if (!school) {
    return <div>School not found</div>
  }

  return (
    <div className={`school-application-form ${isVisible ? "visible" : ""}`}>
      {/* Header */}
      <div className="application-header">
        <div className="application-header-content">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
            <span className="back-text">Back to School Details</span>
          </button>

          <div className="application-title">
            <h1>Apply to {school.name}</h1>
            <p>{school.program}</p>
          </div>
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
      <div className="form-container">
        {currentStep === 1 && (
          <div className="form-step personal-info-step">
            <h2 className="step-title">Personal Information</h2>

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
                <label>Phone Number *</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "error" : ""}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>Date of Birth *</label>
                <div className="input-wrapper">
                  <Calendar className="input-icon" size={18} />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={errors.dateOfBirth ? "error" : ""}
                  />
                </div>
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>

              <div className="form-group full-width">
                <label>Address *</label>
                <div className="input-wrapper">
                  <MapPin className="input-icon" size={18} />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className={errors.address ? "error" : ""}
                    placeholder="Enter your full address"
                  />
                </div>
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={errors.city ? "error" : ""}
                  placeholder="Enter your city"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label>State/Province</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter your state/province"
                />
              </div>

              <div className="form-group">
                <label>ZIP/Postal Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="Enter your ZIP/postal code"
                />
              </div>

              <div className="form-group">
                <label>Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className={errors.country ? "error" : ""}
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="CM">Cameroon</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IN">India</option>
                  <option value="CN">China</option>
                  <option value="JP">Japan</option>
                  <option value="other">Other</option>
                </select>
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step academic-info-step">
            <h2 className="step-title">Academic Information</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Current Education Level *</label>
                <select
                  value={formData.currentEducation}
                  onChange={(e) => handleInputChange("currentEducation", e.target.value)}
                  className={errors.currentEducation ? "error" : ""}
                >
                  <option value="">Select education level</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
                {errors.currentEducation && <span className="error-message">{errors.currentEducation}</span>}
              </div>

              <div className="form-group">
                <label>Institution Name *</label>
                <div className="input-wrapper">
                  <GraduationCap className="input-icon" size={18} />
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleInputChange("institution", e.target.value)}
                    className={errors.institution ? "error" : ""}
                    placeholder="Enter your institution name"
                  />
                </div>
                {errors.institution && <span className="error-message">{errors.institution}</span>}
              </div>

              <div className="form-group">
                <label>GPA *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange("gpa", e.target.value)}
                  className={errors.gpa ? "error" : ""}
                  placeholder="Enter your GPA (e.g., 3.75)"
                />
                {errors.gpa && <span className="error-message">{errors.gpa}</span>}
              </div>

              <div className="form-group">
                <label>Graduation Date</label>
                <input
                  type="date"
                  value={formData.graduationDate}
                  onChange={(e) => handleInputChange("graduationDate", e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label>Major/Field of Study *</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  className={errors.major ? "error" : ""}
                  placeholder="Enter your major or field of study"
                />
                {errors.major && <span className="error-message">{errors.major}</span>}
              </div>

              <div className="form-group full-width">
                <label>Work Experience</label>
                <textarea
                  value={formData.workExperience}
                  onChange={(e) => handleInputChange("workExperience", e.target.value)}
                  placeholder="Describe your relevant work experience..."
                  rows={4}
                />
              </div>

              <div className="form-group full-width">
                <label>Why This Program?</label>
                <textarea
                  value={formData.whyThisProgram}
                  onChange={(e) => handleInputChange("whyThisProgram", e.target.value)}
                  placeholder="Why are you interested in this specific program?"
                  rows={4}
                />
              </div>

              <div className="form-group full-width">
                <label>Career Goals</label>
                <textarea
                  value={formData.careerGoals}
                  onChange={(e) => handleInputChange("careerGoals", e.target.value)}
                  placeholder="Describe your career goals and how this program will help you achieve them..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step documents-step">
            <h2 className="step-title">Required Documents</h2>

            <div className="documents-grid">
              <div className="document-upload">
                <div className="upload-header">
                  <FileText size={24} />
                  <h3>Official Transcript</h3>
                  <span className="required">Required</span>
                </div>
                <div className="upload-area">
                  <Upload size={32} />
                  <p>Click to upload or drag and drop</p>
                  <span>PDF, DOC, DOCX (Max 10MB)</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload("transcript", e.target.files[0])}
                  />
                </div>
                {formData.transcript && (
                  <div className="uploaded-file">
                    <CheckCircle size={16} />
                    <span>{formData.transcript.name}</span>
                  </div>
                )}
              </div>

              <div className="document-upload">
                <div className="upload-header">
                  <FileText size={24} />
                  <h3>Resume/CV</h3>
                  <span className="required">Required</span>
                </div>
                <div className="upload-area">
                  <Upload size={32} />
                  <p>Click to upload or drag and drop</p>
                  <span>PDF, DOC, DOCX (Max 5MB)</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload("resume", e.target.files[0])}
                  />
                </div>
                {formData.resume && (
                  <div className="uploaded-file">
                    <CheckCircle size={16} />
                    <span>{formData.resume.name}</span>
                  </div>
                )}
              </div>

              <div className="document-upload">
                <div className="upload-header">
                  <FileText size={24} />
                  <h3>Personal Statement</h3>
                  <span className="required">Required</span>
                </div>
                <div className="upload-area">
                  <Upload size={32} />
                  <p>Click to upload or drag and drop</p>
                  <span>PDF, DOC, DOCX (Max 5MB)</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload("personalStatement", e.target.files[0])}
                  />
                </div>
                {formData.personalStatement && (
                  <div className="uploaded-file">
                    <CheckCircle size={16} />
                    <span>{formData.personalStatement.name}</span>
                  </div>
                )}
              </div>

              <div className="document-upload">
                <div className="upload-header">
                  <FileText size={24} />
                  <h3>Letters of Recommendation</h3>
                  <span className="optional">Optional</span>
                </div>
                <div className="upload-area">
                  <Upload size={32} />
                  <p>Click to upload or drag and drop</p>
                  <span>PDF, DOC, DOCX (Max 5MB each)</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) => handleFileUpload("recommendations", Array.from(e.target.files))}
                  />
                </div>
                {formData.recommendations.length > 0 && (
                  <div className="uploaded-files">
                    {formData.recommendations.map((file, index) => (
                      <div key={index} className="uploaded-file">
                        <CheckCircle size={16} />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="document-note">
              <AlertCircle size={20} />
              <p>
                All documents should be in English or accompanied by certified translations. Make sure all files are
                clearly readable and under the specified size limits.
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="form-step payment-step">
            <h2 className="step-title">Payment Information</h2>

            <div className="payment-summary">
              <h3>Application Fee Summary</h3>
              <div className="fee-breakdown">
                <div className="fee-item">
                  <span>Application Processing Fee</span>
                  <span>$75.00</span>
                </div>
                <div className="fee-item">
                  <span>Document Review Fee</span>
                  <span>$25.00</span>
                </div>
                <div className="fee-item total">
                  <span>Total Amount</span>
                  <span>$100.00</span>
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

        {currentStep === 5 && (
          <div className="form-step review-step">
            <h2 className="step-title">Review Your Application</h2>

            <div className="review-sections">
              <div className="review-section">
                <h3>Personal Information</h3>
                <div className="review-content">
                  <p>
                    <strong>Name:</strong> {formData.firstName} {formData.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zipCode},{" "}
                    {formData.country}
                  </p>
                </div>
              </div>

              <div className="review-section">
                <h3>Academic Information</h3>
                <div className="review-content">
                  <p>
                    <strong>Education Level:</strong> {formData.currentEducation}
                  </p>
                  <p>
                    <strong>Institution:</strong> {formData.institution}
                  </p>
                  <p>
                    <strong>GPA:</strong> {formData.gpa}
                  </p>
                  <p>
                    <strong>Major:</strong> {formData.major}
                  </p>
                </div>
              </div>

              <div className="review-section">
                <h3>Documents</h3>
                <div className="review-content">
                  <div className="document-status">
                    <CheckCircle size={16} />
                    <span>Transcript: {formData.transcript ? "Uploaded" : "Not uploaded"}</span>
                  </div>
                  <div className="document-status">
                    <CheckCircle size={16} />
                    <span>Resume: {formData.resume ? "Uploaded" : "Not uploaded"}</span>
                  </div>
                  <div className="document-status">
                    <CheckCircle size={16} />
                    <span>Personal Statement: {formData.personalStatement ? "Uploaded" : "Not uploaded"}</span>
                  </div>
                  <div className="document-status">
                    <CheckCircle size={16} />
                    <span>Recommendations: {formData.recommendations.length} file(s) uploaded</span>
                  </div>
                </div>
              </div>

              <div className="review-section">
                <h3>Payment Information</h3>
                <div className="review-content">
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {formData.paymentMethod === "credit-card" ? "Credit/Debit Card" : "PayPal"}
                  </p>
                  <p>
                    <strong>Application Fee:</strong> $100.00
                  </p>
                </div>
              </div>
            </div>

            <div className="terms-agreement">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the terms and conditions and privacy policy</span>
              </label>
            </div>

            <div className="submission-note">
              <AlertCircle size={20} />
              <p>
                By submitting this application, you confirm that all information provided is accurate and complete.
                False or misleading information may result in application rejection or admission revocation.
              </p>
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

          {currentStep < 5 ? (
            <button className="nav-button next-button" onClick={nextStep}>
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button className="nav-button submit-button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
              {!isSubmitting && <CheckCircle size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SchoolApplicationForm
