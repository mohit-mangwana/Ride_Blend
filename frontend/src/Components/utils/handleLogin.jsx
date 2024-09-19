import Cookies from 'js-cookie'
import { fetchToken } from './fetchToken';

export function handleLogin(token,role) {
    // Store the token in cookies

   
    
    Cookies.set('token', token, {
      expires: 1 / 24,               // Token expires in 1 hour
      path: '/',                     // Path for the cookie
      domain: 'ride-blend-frontend.onrender.com', // Frontend domain
      secure: true,                  // Ensure it is sent over HTTPS
      sameSite: 'None'               // Allow cross-origin cookie
    });
  
    // Store other info like role, isLoggedIn, etc.
    Cookies.set('role', role, { expires: 1 / 24, sameSite: 'None', secure: true, domain: 'ride-blend-frontend.onrender.com' });
    Cookies.set('isLoggedIn', 'true', { expires: 1 / 24, sameSite: 'None', secure: true, domain: 'ride-blend-frontend.onrender.com' });
  
    window.dispatchEvent(new Event('loginStateChange'));
  
    // Store the token in local storage
    localStorage.setItem('token', token);
   
      fetchToken();
 
  }