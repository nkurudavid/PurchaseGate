const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  login: `${API_BASE_URL}/api/auth/login/`,
  logout: `${API_BASE_URL}/api/auth/logout/`,
  my_profile: `${API_BASE_URL}/api/auth/me/`,
  update_profile: `${API_BASE_URL}/api/auth/me/`,
  delete_account: `${API_BASE_URL}/api/auth/me/`,
  change_password: `${API_BASE_URL}/api/auth/me/change_password/`,
  
  // Add your other endpoints
  staff_requests: `${API_BASE_URL}/api/purchases/requests/`,
  update_my_request: `${API_BASE_URL}/api/purchases/requests/{id}/`,
  delete_my_request: `${API_BASE_URL}/api/purchases/requests/{id}/`,
  create_request: `${API_BASE_URL}/api/purchases/requests/`,
  approve_request: `${API_BASE_URL}/api/purchases/requests/{id}/approve/`,
  reject_request: `${API_BASE_URL}/api/purchases/requests/{id}/reject/`,
  add_finance_note: `${API_BASE_URL}/api/purchases/requests/{id}/finance_note/`,
  update_finance_note: `${API_BASE_URL}/api/purchases/requests/{id}/finance_note/`,
  delete_finance_note: `${API_BASE_URL}/api/purchases/requests/{id}/finance_note/`,
};

export default API_BASE_URL;