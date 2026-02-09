import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      const { status, data } = error.response;
      errorMessage = data?.message || `Server error (${status})`;
    } else if (error.request) {
      errorMessage = 'Cannot connect to server. Please check if the backend is running.';
    }

    error.userMessage = errorMessage;
    return Promise.reject(error);
  }
);

// Upload tech pack PDF
export const uploadTechPack = async (formData) => {
  const response = await api.post('/api/techpack/analyse', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;
