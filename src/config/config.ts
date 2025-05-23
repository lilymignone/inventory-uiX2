export const config = {
  // Use environment variable if available, otherwise fallback to localhost:8080
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
}; 