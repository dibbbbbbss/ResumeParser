import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const refresh = localStorage.getItem('refresh_token');
        const access = localStorage.getItem('access_token');
        if (refresh && access) {
          await axios.post(
            'http://localhost:8000/api/logout/', 
            { refresh },
            {
              headers: {
                Authorization: `Bearer ${access}`
              }
            }
          );
        }
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        console.log('Logout successful');
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
      finally {
        navigate('/login');
      }
    };

    logout();
  }, [navigate]);

  return null;
};

export default Logout;
