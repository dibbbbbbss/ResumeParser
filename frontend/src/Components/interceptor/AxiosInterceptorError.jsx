import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
});

const AxiosInterceptorError = (navigate) => {
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        // Redirect to login page
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
export { AxiosInterceptorError };
