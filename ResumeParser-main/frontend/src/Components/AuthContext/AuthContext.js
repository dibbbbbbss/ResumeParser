

import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token,setToken] = useState(null);

    useEffect(()=>{
        //check if there is token in localstorage on mount
        const storedToken = localStorage.getItem('access_token');
        if(storedToken){
            setToken(storedToken);
            setIsAuthenticated(true);
        }
    },[]);

    const login = (jwtToken) =>{
        localStorage.setItem('access_token',jwtToken);
        setToken(jwtToken);
        setIsAuthenticated(true);
    };

    const logout = () =>{
        localStorage.removeItem('access_token');
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated,token,login,logout}}>
        {children}
        </AuthContext.Provider>
    );

};
export const useAuth = () => useContext(AuthContext);
