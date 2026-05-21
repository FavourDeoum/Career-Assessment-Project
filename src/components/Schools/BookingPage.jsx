import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import {
  ArrowLeft, ArrowRight, User, Users, Monitor,
  Tag, Package, Check, Info, CalendarDays, CheckCircle2,
} from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import './BookingPage.css';

const SESSION_TYPE_META = {
  'One-on-one tutoring': {
    Icon: User,
    description: 'Private sessions focused entirely on your goals and pace.',
  },
  'Group sessions': {
    Icon: Users,
    description: 'Small-group learning with peers on shared topics.',
  },
  'Workshops': {
    Icon: Monitor,
    description: 'Structured, topic-based workshops with hands-on activities.',
  },
};
const DEFAULT_META = { Icon: User, description: 'Personalised sessions tailored to you.' };

const STEPS = ['Type', 'Plan', 'Schedule', 'Confirm'];

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-xs">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={22} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Mentor not found</h2>
          <p className="text-sm text-gray-500 mb-6">
            The mentor details could not be loaded. Please go back and try again.
          </p>
          <Link
            to="/mentors/all"
            className="inline-flex items-center gap-2 text-sm bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft size={15} />
            Browse Mentors
          </Link>
        </div>
      </div>
    );
  }

  const { name, image, role, sessionTypes = [], hourlyRate, packageDeals = {} } = tutor;

  const planOptions = {
    hourly: { name: 'Hourly Rate', price: hourlyRate, sessions: 1, savings: null },
    ...Object.fromEntries(
      Object.entries(packageDeals).map(([key, value]) => {
        const planName = key.replace('sessions', '-Session Package');
        const price = value.split(' (')[0];
        const sessions = parseInt(key.replace('sessions', ''), 10);
        const savings = value.split('(')[1]?.replace(')', '') || null;
        return [key, { name: planName, price, sessions, savings }];
      })
    ),
  };

  const getSessionsToBook = () => (selectedPlan ? planOptions[selectedPlan].sessions : 0);

  const handleDateClick = (date) => {
    const key = date.toDateString();
    const alreadySelected = scheduledDates.some(d => d.toDateString() === key);
    if (alreadySelected) {
      setScheduledDates(scheduledDates.filter(d => d.toDateString() !== key));
    } else if (scheduledDates.length < getSessionsToBook()) {
      setScheduledDates([...scheduledDates, date]);
    }
  };

  const tileClassName = ({ date }) =>
    scheduledDates.some(d => d.toDateString() === date.toDateString()) ? 'booked-date' : null;

  const tileDisabled = ({ date }) =>
    scheduledDates.length >= getSessionsToBook() &&
    !scheduledDates.some(d => d.toDateString() === date.toDateString());

  const isNextDisabled = () => {
    if (step === 1 && !selectedSessionType) return true;
    if (step === 2 && !selectedPlan) return true;
    if (step === 3 && scheduledDates.length < getSessionsToBook()) return true;
    return false;
  };

  const nextHint = () => {
    if (step === 1) return 'Select a session type to continue';
    if (step === 2) return 'Select a plan to continue';
    if (step === 3) {
      const n = getSessionsToBook() - scheduledDates.length;
      return `Select ${n} more date${n !== 1 ? 's' : ''} to continue`;
    }
    return null;
  };

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">Choose your session type</h2>
              <p className="text-sm text-gray-500 mt-1">Select the format that works best for you.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {sessionTypes.map(type => {
                const { Icon, description } = SESSION_TYPE_META[type] || DEFAULT_META;
                const isSelected = selectedSessionType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedSessionType(type)}
                    className={`relative text-left p-5 rounded-xl border-2 transition-all duration-150 ${
                      isSelected ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{type}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">Select your plan</h2>
              <p className="text-sm text-gray-500 mt-1">More sessions unlock better value.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(planOptions).map(([key, plan]) => {
                const isSelected = selectedPlan === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`relative text-left p-5 rounded-xl border-2 transition-all duration-150 ${
                      isSelected ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {plan.sessions > 1 ? <Package size={20} /> : <Tag size={20} />}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
                    <p className="text-base font-bold text-purple-600 mt-1">{plan.price}</p>
                    {plan.sessions > 1 && (
                      <p className="text-xs text-gray-400 mt-0.5">{plan.sessions} sessions</p>
                    )}
                    {plan.savings && (
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                        {plan.savings}
                      </span>
                    )}
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3: {
        const sessionsToBook = getSessionsToBook();
        const remaining = sessionsToBook - scheduledDates.length;
        return (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">Schedule your sessions</h2>
              <p className="text-sm text-gray-500 mt-1">
                Pick {sessionsToBook} date{sessionsToBook !== 1 ? 's' : ''} for your sessions.
              </p>
            </div>

            {remaining > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-5 text-sm text-blue-700">
                <Info size={15} className="flex-shrink-0" />
                Select <strong className="mx-1">{remaining}</strong> more date{remaining !== 1 ? 's' : ''}.
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="calendar-wrapper flex-shrink-0">
                <Calendar
                  onChange={handleDateClick}
                  minDate={new Date()}
                  tileClassName={tileClassName}
                  tileDisabled={tileDisabled}
                />
              </div>

              {scheduledDates.length > 0 && (
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CalendarDays size={15} className="text-purple-500" />
                    Selected ({scheduledDates.length}/{sessionsToBook})
                  </h4>
                  <div className="space-y-2">
                    {scheduledDates.map((date, i) => (
                      <div key={i} className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-lg px-4 py-2.5">
                        <span className="text-sm font-medium text-gray-800">{formatDate(date)}</span>
                        <button
                          onClick={() => setScheduledDates(scheduledDates.filter((_, idx) => idx !== i))}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors ml-3 flex-shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 4:
        return (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">Review your booking</h2>
              <p className="text-sm text-gray-500 mt-1">Check everything looks right before confirming.</p>
            </div>
            <div className="border border-gray-100 rounded-xl overflow-hidden max-w-md">
              <div className="divide-y divide-gray-100">
                {[
                  ['Mentor', name],
                  ['Session type', selectedSessionType],
                  ['Plan', planOptions[selectedPlan]?.name],
                  ['Sessions', getSessionsToBook()],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-3.5 px-5 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
                <div className="py-3.5 px-5 text-sm">
                  <span className="text-gray-500 block mb-2">Dates</span>
                  <div className="space-y-1">
                    {scheduledDates.map((date, i) => (
                      <p key={i} className="font-medium text-gray-900">{formatDate(date)}</p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 px-5 bg-gray-50">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-lg font-bold text-purple-600">{planOptions[selectedPlan]?.price}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={36} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking confirmed!</h2>
            <p className="text-sm text-gray-500 mb-1">
              Your session with <span className="font-semibold text-gray-800">{name}</span> is all set.
            </p>
            <p className="text-sm text-gray-400 mb-8">You'll receive a confirmation shortly.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/mentors/all"
                className="inline-flex items-center gap-2 text-sm border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Browse more mentors
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <div className="mb-5">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-purple-600 px-6 py-5 flex items-center gap-4">
            <img
              src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=48`}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/30 flex-shrink-0"
            />
            <div>
              <p className="text-purple-200 text-xs mb-0.5">Booking a session with</p>
              <h1 className="text-white font-bold text-lg leading-tight">{name}</h1>
              <p className="text-purple-200 text-sm">{role}</p>
            </div>
          </div>

          {/* Stepper */}
          {step < 5 && (
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center max-w-sm mx-auto">
                {STEPS.map((label, i) => {
                  const num = i + 1;
                  const isDone = step > num;
                  const isActive = step === num;
                  return (
                    <div key={label} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                          isDone || isActive ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isDone ? <Check size={13} /> : num}
                        </div>
                        <span className={`text-xs mt-1 font-medium whitespace-nowrap ${
                          isActive ? 'text-purple-600' : isDone ? 'text-gray-600' : 'text-gray-400'
                        }`}>{label}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-px mx-2 mb-5 ${step > num ? 'bg-purple-600' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {renderStep()}
          </div>

          {/* Footer */}
          {step < 5 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                {step > 1 ? (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                ) : <span />}
              </div>

              <div className="flex flex-col items-end gap-1">
                {step < 4 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    disabled={isNextDisabled()}
                    className={`inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg font-medium transition-all ${
                      isNextDisabled()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    Next
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(5)}
                    className="inline-flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <Check size={14} />
                    Confirm Booking
                  </button>
                )}
                {isNextDisabled() && (
                  <p className="text-xs text-gray-400">{nextHint()}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
