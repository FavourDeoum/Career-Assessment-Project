import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  // State for authentication status, user data, token, and loading state
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on initial load
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Validate the token with your backend
          const response = await fetch('/api/validate-token', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setIsAuthenticated(true);
            setUser(userData);
            setToken(storedToken);
          } else {
            logout(); // Invalid token, log the user out
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          logout(); // Log the user out on error
        }
      }
      setLoading(false); // Set loading to false after validation
    };

    validateToken();
  }, []);

  // Login function
  const login = (userData, newToken) => {
    setIsAuthenticated(true);
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', newToken);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Function to check if the user has a specific role (optional)
  const hasRole = (role) => {
    return user?.roles?.includes(role);
  };

  // Provide the context values to the application
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);