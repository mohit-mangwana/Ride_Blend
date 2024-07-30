import Cookies from 'js-cookie'
import { fetchToken } from './fetchToken';

export function handleLogin(token,role) {
    // Store the token in cookies

   
    Cookies.set( 'token',token, { expires: 3600 }); 
    Cookies.set('role', role, { expires: 1/24 }); // Store the user role
    Cookies.set('isLoggedIn', 'true', { expires: 1/24 }); 
    window.dispatchEvent(new Event('loginStateChange'));
    // Expires in 1 hour


  
    // Store the token in local storage
    localStorage.setItem('token', token);
   
      fetchToken();
 
  }