import axios from 'axios';

/**
 * Centralized API Configuration
 * 
 * IMPORTANT: The auth token is defined ONCE here and used globally
 * This ensures the token is not duplicated across files
 */

// Base URL for backend API
const BASE_URL = 'http://localhost:5000';

// Auth token - defined ONCE in this file only
const AUTH_TOKEN = 'S@nthosh7';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  }
});

/**
 * Response Interceptor
 * Handles 401 Unauthorized responses globally
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - Invalid or missing token');
      // You could redirect to login page here if needed
    }
    return Promise.reject(error);
  }
);

/**
 * API Methods
 */

// Get all employees with pagination and search
export const getEmployees = (page = 1, limit = 10, search = '') => {
  return apiClient.get('/employees', {
    params: { page, limit, search }
  });
};

// Get single employee by ID
export const getEmployee = (id) => {
  return apiClient.get(`/employees/${id}`);
};

// Create new employee
export const createEmployee = (employeeData) => {
  return apiClient.post('/employees', employeeData);
};

// Update employee
export const updateEmployee = (id, employeeData) => {
  return apiClient.put(`/employees/${id}`, employeeData);
};

// Delete employee (soft delete)
export const deleteEmployee = (id) => {
  return apiClient.delete(`/employees/${id}`);
};

export default apiClient;
