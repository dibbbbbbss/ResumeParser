import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosInterceptorError } from './AxiosInterceptorError';

const withAxiosInterceptor = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      AxiosInterceptorError(navigate);
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAxiosInterceptor;
