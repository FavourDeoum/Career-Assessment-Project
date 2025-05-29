import React, { useState, useEffect } from 'react';
import "./PathDirections.css"
import { Search, MapPin, Star, Phone, MessageCircle, Filter, BookOpen, Users, Award, ChevronRight, Heart, Share2 } from 'lucide-react';

const StudentPathExplorer = () => {
  const [activeTab, setActiveTab] = useState('paths');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock data - In real app, this would come from API
  const careerPaths = [
    {
      id: 1,
      title: "Software Engineering",
      description: "Build the future with code, creating applications and systems.",
      icon: "💻",
      demand: "Very High",
      avgSalary: "$80k - $130k",
      duration: "2-4 years",
      category: "technology"
    },
    {
      id: 2,
      title: "Digital Marketing",
      description: "Connect brands with audiences online through various channels.",
      icon: "📱",
      demand: "High",
      avgSalary: "$50k - $90k",
      duration: "6 months - 2 years",
      category: "business"
    },
    {
      id: 3,
      title: "Graphic Design",
      description: "Create visual concepts to communicate ideas that inspire.",
      icon: "🎨",
      demand: "Medium",
      avgSalary: "$45k - $75k",
      duration: "1-3 years",
      category: "creative"
    },
    {
      id: 4,
      title: "Data Science",
      description: "Turn complex data into actionable insights and predictions.",
      icon: "📊",
      demand: "Very High",
      avgSalary: "$90k - $150k",
      duration: "2-4 years",
      category: "technology"
    },
    {
      id: 5,
      title: "Nursing",
      description: "Provide compassionate care and promote health.",
      icon: "🏥",
      demand: "High",
      avgSalary: "$60k - $95k",
      duration: "2-4 years",
      category: "healthcare"
    },
    {
      id: 6,
      title: "Culinary Arts",
      description: "Master the art of cooking and food presentation.",
      icon: "👨‍🍳",
      demand: "Medium",
      avgSalary: "$40k - $70k",
      duration: "6 months - 2 years",
      category: "creative"
    },
    {
      id: 7,
      title: "Business Management",
      description: "Lead teams and organizations towards strategic goals.",
      icon: "📈",
      demand: "High",
      avgSalary: "$65k - $110k",
      duration: "1-4 years",
      category: "business"
    },
    {
      id: 8,
      title: "Cybersecurity Analysis",
      description: "Protect digital assets and information systems from threats.",
      icon: "🛡️",
      demand: "Very High",
      avgSalary: "$70k - $120k",
      duration: "1-3 years",
      category: "technology"
    }
  ];

  const schools = [
    {
      id: 1,
      name: "Tech Valley Institute",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop",
      rating: 4.8,
      location: "San Francisco, CA",
      programs: ["Software Engineering", "Data Science", "AI"],
      tuition: "$25,000/year",
      type: "Private",
      pathId: 1 // Links to Software Engineering
    },
    {
      id: 2,
      name: "Creative Arts Academy",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=250&fit=crop",
      rating: 4.6,
      location: "Los Angeles, CA",
      programs: ["Graphic Design", "Digital Media", "Animation"],
      tuition: "$18,000/year",
      type: "Private",
      pathId: 3 // Links to Graphic Design
    },
    {
      id: 3,
      name: "Metro Community College",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=250&fit=crop",
      rating: 4.3,
      location: "Chicago, IL",
      programs: ["Nursing", "Business Admin", "IT Support"],
      tuition: "$8,500/year",
      type: "Public",
      pathId: 5 // Links to Nursing (primarily, but offers others)
    },
    {
      id: 4,
      name: "Digital Marketing Hub",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop",
      rating: 4.5,
      location: "New York, NY",
      programs: ["Digital Marketing", "Social Media Strategy", "SEO Specialization"],
      tuition: "$15,000/year",
      type: "Online",
      pathId: 2 // Links to Digital Marketing
    },
    {
      id: 5,
      name: "Gourmet Culinary Institute",
      image: "https://images.unsplash.com/photo-1556909172-6ab63f18fd12?w=400&h=250&fit=crop",
      rating: 4.7,
      location: "Paris, FR (Online options)",
      programs: ["Classic French Cuisine", "Pastry Arts", "Restaurant Management"],
      tuition: "$22,000/course",
      type: "Specialized",
      pathId: 6 // Links to Culinary Arts
    },
    {
      id: 6,
      name: "Apex Business School",
      image: "https://images.unsplash.com/photo-1551829149-a2a990099453?w=400&h=250&fit=crop",
      rating: 4.9,
      location: "London, UK",
      programs: ["MBA", "Masters in Management", "Entrepreneurship"],
      tuition: "$30,000/year",
      type: "Private",
      pathId: 7 // Links to Business Management
    },
    {
      id: 7,
      name: "CyberSec Training Academy",
      image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&h=250&fit=crop",
      rating: 4.6,
      location: "Austin, TX",
      programs: ["Ethical Hacking", "Network Security", "CISSP Prep"],
      tuition: "$12,000/bootcamp",
      type: "Bootcamp",
      pathId: 8 // Links to Cybersecurity Analysis
    },
    {
      id: 8,
      name: "Future Tech University",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
      rating: 4.4,
      location: "Boston, MA",
      programs: ["Data Science Masters", "Robotics", "Software Development BSc"],
      tuition: "$28,000/year",
      type: "University",
      pathId: 4 // Links to Data Science (primarily)
    },
    {
      id: 9,
      name: "HealWell Nursing College",
      image: "https://images.unsplash.com/photo-1605103871575-3969081067e3?w=400&h=250&fit=crop",
      rating: 4.7,
      location: "Toronto, CA",
      programs: ["Registered Nurse (RN)", "Practical Nursing (PN)", "Healthcare Assistant"],
      tuition: "$17,000/year",
      type: "Public College",
      pathId: 5 // Links to Nursing
    }
  ];

  const tutors = [
    {
      id: 1,
      name: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c3f0?w=150&h=150&fit=crop&crop=face",
      specialty: "Software Engineering",
      rating: 4.9,
      experience: "8 years",
      hourlyRate: "$45/hour",
      phone: "+1234567890",
      bio: "Senior full-stack developer with expertise in React, Node.js, and cloud technologies.",
      pathId: 1,
      availability: "Mon-Fri, Evenings"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      specialty: "Data Science & ML",
      rating: 4.8,
      experience: "6 years",
      hourlyRate: "$50/hour",
      phone: "+1234567891",
      bio: "Data scientist specializing in machine learning, Python, and statistical analysis.",
      pathId: 4,
      availability: "Flexible, Weekends"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      specialty: "Digital Marketing",
      rating: 4.7,
      experience: "5 years",
      hourlyRate: "$40/hour",
      phone: "+1234567892",
      bio: "Marketing strategist with proven track record in social media, SEO, and content marketing.",
      pathId: 2,
      availability: "Weekends, Tue/Thu Evenings"
    },
    {
      id: 4,
      name: "David Kim",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      specialty: "Graphic & UI/UX Design",
      rating: 4.6,
      experience: "7 years",
      hourlyRate: "$35/hour",
      phone: "+1234567893",
      bio: "Creative director with expertise in branding, UI/UX design, and digital illustration tools.",
      pathId: 3,
      availability: "Mon-Wed, Flexible"
    },
    {
      id: 5,
      name: "Chef Antoine Moreau",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specialty: "Culinary Arts & Pastry",
      rating: 4.9,
      experience: "15 years",
      hourlyRate: "$60/hour",
      phone: "+33123456789",
      bio: "Michelin-experienced chef passionate about teaching classic techniques and modern gastronomy.",
      pathId: 6,
      availability: "Sat-Sun, Special Workshops"
    },
    {
      id: 6,
      name: "Isabella Rossi",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      specialty: "Business Management & Strategy",
      rating: 4.8,
      experience: "10 years",
      hourlyRate: "$55/hour",
      phone: "+44123456789",
      bio: "Experienced business consultant and MBA lecturer. Specializes in startups and market entry.",
      pathId: 7,
      availability: "Evenings, Project-based"
    },
    {
      id: 7,
      name: "Raj Patel",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      specialty: "Cybersecurity & Ethical Hacking",
      rating: 4.7,
      experience: "6 years",
      hourlyRate: "$65/hour",
      phone: "+1987654321",
      bio: "Certified ethical hacker (CEH) and cybersecurity analyst. Focus on practical defense skills.",
      pathId: 8,
      availability: "Flexible Online Sessions"
    },
    {
      id: 8,
      name: "Ken Adams, NP",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      specialty: "Nursing & Healthcare Practice",
      rating: 4.9,
      experience: "12 years",
      hourlyRate: "$50/hour",
      phone: "+1555123456",
      bio: "Nurse Practitioner with clinical and teaching experience. Passionate about evidence-based care.",
      pathId: 5,
      availability: "Mon/Wed/Fri Afternoons"
    },
     {
      id: 9,
      name: "Dr. Lena Petrova",
      image: "https://images.unsplash.com/photo-1580894732444-8ec0efb762c4?w=150&h=150&fit=crop&crop=face",
      specialty: "Advanced Data Analytics",
      rating: 4.8,
      experience: "9 years",
      hourlyRate: "$70/hour",
      phone: "+17778889999",
      bio: "PhD in Statistics, specializing in big data, machine learning algorithms and visualization tools.",
      pathId: 4,
      availability: "Flexible, Online Only"
    }
  ];

  const categories = ['all', 'technology', 'business', 'creative', 'healthcare'];

  const toggleFavorite = (id, type) => {
    const key = `${type}-${id}`;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(key)) {
      newFavorites.delete(key);
    } else {
      newFavorites.add(key);
    }
    setFavorites(newFavorites);
  };

  const openWhatsApp = (phone, name, specialty) => {
    const message = encodeURIComponent(`Hi ${name}, I'm interested in learning ${specialty}. Can you help me get started?`);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const getDemandColor = (demand) => {
    switch(demand) {
      case 'Very High': return '#ff4757'; // Strong Red
      case 'High': return '#ff6b35'; // Orange-Red
      case 'Medium': return '#ffc048'; // Amber/Gold
      default: return '#70a1ff'; // Light Blue (for Low or N/A)
    }
  };

  // Filtered data for display
  // TODO: Implement dynamic filtering for schools and tutors based on selected path
  const filteredPaths = careerPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // For now, schools and tutors are filtered by search query if active tab matches
  // A more robust solution would filter them based on a selected career path
  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.programs.join(' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTutors = tutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PathCard = ({ path }) => (
    <div className="path-card" onClick={() => {
        // Potentially set a selectedPath state here to filter schools/tutors
        setActiveTab('schools');
      }}>
      <div className="path-header">
        <div className="path-icon">{path.icon}</div>
        <div className="path-info">
          <h3>{path.title}</h3>
          <p>{path.description}</p>
        </div>
        <button
          className="favorite-btn"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(path.id, 'path');
          }}
        >
          <Heart
            size={20}
            fill={favorites.has(`path-${path.id}`) ? 'var(--error-color)' : 'none'}
            color={favorites.has(`path-${path.id}`) ? 'var(--error-color)' : '#666'}
          />
        </button>
      </div>

      <div className="path-stats">
        <div className="stat">
          <span className="stat-label">Demand</span>
          <span
            className="stat-value demand-badge"
            style={{ backgroundColor: getDemandColor(path.demand) }}
          >
            {path.demand}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Salary</span>
          <span className="stat-value">{path.avgSalary}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Duration</span>
          <span className="stat-value">{path.duration}</span>
        </div>
      </div>

      <div className="path-actions">
        <button className="action-btn primary" onClick={(e) => { e.stopPropagation(); setActiveTab('schools'); /* TODO: Filter schools by path.id */ }}>
          Explore Schools <ChevronRight size={16} />
        </button>
        <button className="action-btn secondary" onClick={(e) => { e.stopPropagation(); setActiveTab('tutors'); /* TODO: Filter tutors by path.id */ }}>
          Find Tutors
        </button>
      </div>
    </div>
  );

  const SchoolCard = ({ school }) => (
    <div className="school-card">
      <div className="school-image">
        <img src={school.image} alt={school.name} />
        <div className="school-type">{school.type}</div>
        <button
          className="favorite-btn school-favorite"
          onClick={() => toggleFavorite(school.id, 'school')}
        >
          <Heart
            size={18}
            fill={favorites.has(`school-${school.id}`) ? 'var(--error-color)' : 'none'}
            color={favorites.has(`school-${school.id}`) ? 'var(--error-color)' : '#fff'}
          />
        </button>
      </div>

      <div className="school-content">
        <div className="school-header">
          <h3>{school.name}</h3>
          <div className="school-rating">
            <Star size={16} fill="var(--accent-color)" color="var(--accent-color)" />
            <span>{school.rating}</span>
          </div>
        </div>

        <div className="school-location">
          <MapPin size={16} color="#666" />
          <span>{school.location}</span>
        </div>

        <div className="school-programs">
          <BookOpen size={16} color="#666" />
          <span>{school.programs.join(', ')}</span>
        </div>

        <div className="school-tuition">
          <strong>{school.tuition}</strong>
        </div>

        <div className="school-actions">
          <button className="action-btn primary">Apply Now</button>
          <button className="action-btn secondary">Learn More</button>
        </div>
      </div>
    </div>
  );

  const TutorCard = ({ tutor }) => (
    <div className="tutor-card">
      <div className="tutor-image">
        <img src={tutor.image} alt={tutor.name} />
        <div className="tutor-rating">
          <Star size={14} fill="var(--accent-color)" color="var(--accent-color)" />
          <span>{tutor.rating}</span>
        </div>
         <button
          className="favorite-btn" /* Can be styled more specifically if needed */
          style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,255,255,0.3)', borderRadius: '50%'}}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(tutor.id, 'tutor');
          }}
        >
          <Heart
            size={18}
            fill={favorites.has(`tutor-${tutor.id}`) ? 'var(--error-color)' : 'none'}
            color={favorites.has(`tutor-${tutor.id}`) ? 'var(--error-color)' : '#333'}
          />
        </button>
      </div>

      <div className="tutor-info">
        <h3>{tutor.name}</h3>
        <p className="tutor-specialty">{tutor.specialty}</p>
        <p className="tutor-experience">{tutor.experience} experience</p>
        <p className="tutor-rate">{tutor.hourlyRate}</p>
        <p className="tutor-availability">Available: {tutor.availability}</p>
        <p className="tutor-bio">{tutor.bio}</p>

        <div className="tutor-actions">
          <button
            className="action-btn whatsapp"
            onClick={() => openWhatsApp(tutor.phone, tutor.name, tutor.specialty)}
          >
            <MessageCircle size={16} />
            WhatsApp
          </button>
          <button className="action-btn secondary">
            <Phone size={16} />
            Call
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
      

        {/* Filter Pills for Career Paths */}
        {isFilterOpen && activeTab === 'paths' && (
          <div className="filter-pills">
            {categories.map(category => (
              <button
                key={category}
                className={`pill ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        {[
          { key: 'paths', label: 'Career Paths', icon: BookOpen },
          { key: 'schools', label: 'Schools', icon: Award }, // Icon was Award, could be School for clarity
          { key: 'tutors', label: 'Tutors', icon: Users }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`nav-tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="main-content">
        {activeTab === 'paths' && (
          <div className="paths-grid">
            {filteredPaths.length > 0 ? filteredPaths.map(path => (
              <PathCard key={path.id} path={path} />
            )) : <p>No career paths match your search or filter.</p>}
          </div>
        )}

        {activeTab === 'schools' && (
          <div className="schools-grid">
            {/* In a real app, filter schools by selected pathId or search query */}
            {filteredSchools.length > 0 ? filteredSchools.map(school => (
              <SchoolCard key={school.id} school={school} />
            )) : <p>No schools match your search. Try a broader search or explore career paths first.</p>}
          </div>
        )}

        {activeTab === 'tutors' && (
          <div className="tutors-grid">
            {/* In a real app, filter tutors by selected pathId or search query */}
            {filteredTutors.length > 0 ? filteredTutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            )) : <p>No tutors match your search. Try a broader search or explore career paths first.</p>}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      {/* This is a conceptual bottom nav. State management for its active item is not implemented here for brevity. */}
      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'paths' ? 'active' : ''}`} onClick={() => setActiveTab('paths')}>
          <BookOpen size={24} />
          <span>Explore</span>
        </button>
        <button className="nav-item"> {/* TODO: Implement Favorites View */}
          <Heart size={24} />
          <span>Favorites</span>
        </button>
        <button className={`nav-item ${activeTab === 'tutors' ? 'active' : ''}`} onClick={() => setActiveTab('tutors')}>
          <Users size={24} />
          <span>Connect</span>
        </button>
        <button className={`nav-item ${activeTab === 'schools' ? 'active' : ''}`} onClick={() => setActiveTab('schools')}>
          <Award size={24} />
          <span>Schools</span>
        </button>
      </nav>
    </div>
  );
};

export default StudentPathExplorer;