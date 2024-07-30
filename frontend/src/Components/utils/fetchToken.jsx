import Cookies from 'js-cookie'

export function fetchToken() {
    // Check if the token is available in local storage
                                      
     const tokenFromStorage =  Cookies.get('isLoggedIn');           
     const tokenmStorage =  Cookies.get('token');           
    //  alert(user)
    if (tokenFromStorage) return tokenFromStorage;
  
    // If not, read it from cookies
    //  return localStorage.getItem('token');
  }