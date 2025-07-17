import React from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({element: Element, ...rest }) => {
    const {isAuthenticated} = useAuth();
    console.log(isAuthenticated);
    return isAuthenticated ? <Element {...rest}/> : <Navigate to="/login"/>;

};

export default PrivateRoute;
