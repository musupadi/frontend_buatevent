// API Configuration for the application
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
};

export const API_BASE_URL = API_CONFIG.BASE_URL.replace('/api/v1', '');

export default API_CONFIG;
