import { http } from '@/utils/http';

class AuthService {
  async login(email, password) {
    const response = await http.post('/auth/login', {
      email,
      password
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('tokenExpiration', response.expiration);
      http.setAuthHeader(response.token);
    }
    
    return response;
  }

  async register(userName, email, password) {
    return await http.post('/auth/register', {
      userName,
      email,
      password
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('user');
    http.removeAuthHeader();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isTokenValid() {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return false;
    return new Date(expiration) > new Date();
  }
}

export const authService = new AuthService(); 