import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import { ArrowLeft, User, Users, Package, Tag, Calendar as CalendarIcon, Check, Info } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

// Helper to format currency if needed
const formatCurrency = (amount, currency = "XAF") => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount.replace(/[^0-9]/g, ''));
}

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tutor } = location.state || {};
  
  const [step, setStep] = useState(1);
  const [selectedSessionType, setSelectedSessionType] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [scheduledDates, setScheduledDates] = useState([]);

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tutor Not Found</h2>
          <p className="text-gray-600 mb-6">The tutor details could not be loaded. Please go back and try again.</p>
          <Link to="/" className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors">
            <ArrowLeft size={18} /> 
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    );
  }
  

  const { name, image, role, sessionTypes = [], hourlyRate, packageDeals = {} } = tutor;

  const planOptions = {
    hourly: { name: 'Hourly Rate', price: hourlyRate, sessions: 1 },
    ...Object.fromEntries(
      Object.entries(packageDeals).map(([key, value]) => {
        const name = key.replace('sessions', ' Session Package');
        const price = value.split(' (')[0];
        const sessions = parseInt(key.replace('sessions', ''), 10);
        return [key, { name, price, sessions }];
      })
    )
  };
  
  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const getSessionsToBook = () => selectedPlan ? planOptions[selectedPlan].sessions : 0;
  
  const handleDateChange = (date) => {
    const sessionsToBook = getSessionsToBook();
    if (scheduledDates.length < sessionsToBook) {
      setScheduledDates([...scheduledDates, date]);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Session Type
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Choose Your Session Type
              </h2>
              <p className="text-gray-600">Select the type of session that works best for you</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {sessionTypes.map(type => (
                <div 
                  key={type} 
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    selectedSessionType === type ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => setSelectedSessionType(type)}
                >
                  <div className={`p-8 rounded-3xl border-2 transition-all duration-300 ${
                    selectedSessionType === type 
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl' 
                      : 'border-purple-200 bg-white/70 backdrop-blur-sm hover:border-purple-300 hover:shadow-lg'
                  }`}>
                    <div className="text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedSessionType === type 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                      }`}>
                        {type.toLowerCase().includes('group') ? <Users size={24} /> : <User size={24} />}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{type}</h3>
                      {selectedSessionType === type && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 2: // Plan Selection
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Select Your Plan
              </h2>
              <p className="text-gray-600">Choose the plan that fits your learning goals</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(planOptions).map(([key, plan]) => (
                <div 
                  key={key} 
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    selectedPlan === key ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => setSelectedPlan(key)}
                >
                  <div className={`p-6 rounded-3xl border-2 transition-all duration-300 ${
                    selectedPlan === key 
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl' 
                      : 'border-purple-200 bg-white/70 backdrop-blur-sm hover:border-purple-300 hover:shadow-lg'
                  }`}>
                    <div className="text-center space-y-4">
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedPlan === key 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                      }`}>
                        {plan.sessions > 1 ? <Package size={20} /> : <Tag size={20} />}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">{plan.name}</h3>
                        <p className="text-xl font-bold text-purple-600">{plan.price}</p>
                        {plan.sessions > 1 && tutor.packageDeals[key] && (
                          <p className="text-xs text-green-600 mt-1">
                            {tutor.packageDeals[key]?.split('(')[1]?.replace(')','')}
                          </p>
                        )}
                      </div>
                      {selectedPlan === key && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3: // Scheduling
        const sessionsToBook = getSessionsToBook();
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Schedule Your Sessions
              </h2>
              <p className="text-gray-600">Pick your preferred dates and times</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Info size={16} className="text-white" />
              </div>
              <p className="text-purple-800">
                Please select <strong>{sessionsToBook - scheduledDates.length}</strong> more date(s) on the calendar.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="calendar-wrapper bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                <Calendar
                  onChange={handleDateChange}
                  value={scheduledDates}
                  minDate={new Date()}
                />
              </div>
            </div>
            
            {scheduledDates.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CalendarIcon size={20} className="text-purple-600 mr-2" />
                  Selected Dates:
                </h4>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {scheduledDates.map((date, index) => (
                    <div key={index} className="bg-purple-100 text-purple-800 px-4 py-2 rounded-xl text-sm font-medium">
                      {date.toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 4: // Confirmation
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Confirm Your Booking
              </h2>
              <p className="text-gray-600">Review your booking details before confirming</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Booking Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-purple-100">
                    <span className="text-gray-600">Tutor:</span>
                    <span className="font-semibold text-gray-800">{name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-purple-100">
                    <span className="text-gray-600">Session Type:</span>
                    <span className="font-semibold text-gray-800">{selectedSessionType}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-purple-100">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold text-gray-800">{planOptions[selectedPlan]?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-purple-100">
                    <span className="text-gray-600">Total Sessions:</span>
                    <span className="font-semibold text-gray-800">{getSessionsToBook()}</span>
                  </div>
                  
                  <div className="py-3 border-b border-purple-100">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-gray-600">Scheduled Dates:</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {scheduledDates.map((date, index) => (
                        <div key={index} className="bg-purple-50 text-purple-800 px-3 py-2 rounded-lg text-sm">
                          {date.toLocaleDateString()}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl px-6 mt-6">
                    <span className="text-lg font-semibold text-gray-800">Total Cost:</span>
                    <span className="text-2xl font-bold text-purple-600">{planOptions[selectedPlan]?.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
      if (step === 1 && !selectedSessionType) return true;
      if (step === 2 && !selectedPlan) return true;
      if (step === 3 && scheduledDates.length < getSessionsToBook()) return true;
      return false;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-purple-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Main Booking Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden">
                <img src={image} alt={name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-purple-200 text-sm mb-1">Booking Session with</p>
                <h1 className="text-3xl font-bold mb-1">{name}</h1>
                <p className="text-purple-200">{role}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/50 backdrop-blur-sm p-6 border-b border-purple-100">
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              {[1,2,3,4].map(num => (
                <div key={num} className="flex items-center">
                  <div className={`flex flex-col items-center ${num < 4 ? 'flex-1' : ''}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step >= num 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step > num ? <Check size={20}/> : <span className="font-semibold">{num}</span>}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step >= num ? 'text-purple-600' : 'text-gray-400'}`}>
                      {num === 1 && 'Type'}
                      {num === 2 && 'Plan'}
                      {num === 3 && 'Schedule'}
                      {num === 4 && 'Confirm'}
                    </span>
                  </div>
                  {num < 4 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                      step > num ? 'bg-purple-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 min-h-96">
            {renderStep()}
          </div>

          {/* Footer */}
          <div className="bg-white/50 backdrop-blur-sm p-6 border-t border-purple-100">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              {step > 1 ? (
                <button 
                  className="px-6 py-3 bg-white border-2 border-purple-300 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 flex items-center space-x-2"
                  onClick={handlePrevStep}
                >
                  <ArrowLeft size={16} />
                  <span>Previous Step</span>
                </button>
              ) : <div></div>}
              
              {step < 4 ? (
                <button 
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                    isNextDisabled()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
                  }`}
                  onClick={handleNextStep} 
                  disabled={isNextDisabled()}
                >
                  <span>Next Step</span>
                  <ArrowLeft size={16} className="rotate-180" />
                </button>
              ) : (
                <button 
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  onClick={() => alert('Booking Confirmed!')}
                >
                  <Check size={16} />
                  <span>Confirm & Book Session</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;