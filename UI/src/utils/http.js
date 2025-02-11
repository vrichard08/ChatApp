const BASE_URL = 'https://localhost:7105';

class Http {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  setAuthHeader(token) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  removeAuthHeader() {
    delete this.headers['Authorization'];
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
  }

  async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.headers
    });
    return this.handleResponse(response);
  }

  async post(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async put(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async delete(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.headers
    });
    return this.handleResponse(response);
  }
}

export const http = new Http();

const token = localStorage.getItem('token');
if (token) {
  http.setAuthHeader(token);
} 