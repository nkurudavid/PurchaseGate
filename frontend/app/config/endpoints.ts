import { API_BASE_URL } from './env';

export const API_ENDPOINTS = {
  // Auth endpoints
  login: `${API_BASE_URL}/auth/login/`,
  logout: `${API_BASE_URL}/auth/logout/`,
  user: `${API_BASE_URL}/auth/me/`,
  update_profile: `${API_BASE_URL}/auth/me/`,
  delete_account: `${API_BASE_URL}/auth/me/`,
  change_password: `${API_BASE_URL}/auth/me/change_password/`,
  
  // Add your other endpoints
  staff_requests: `${API_BASE_URL}/purchases/requests/`,
  request_details: `${API_BASE_URL}/purchases/requests/{id}/`,
  update_my_request: `${API_BASE_URL}/purchases/requests/{id}/`,
  delete_my_request: `${API_BASE_URL}/purchases/requests/{id}/`,
  create_request: `${API_BASE_URL}/purchases/requests/`,
  approve_request: `${API_BASE_URL}/purchases/requests/{id}/approve/`,
  reject_request: `${API_BASE_URL}/purchases/requests/{id}/reject/`,
  add_finance_note: `${API_BASE_URL}/purchases/requests/{id}/finance_note/`,
  update_finance_note: `${API_BASE_URL}/purchases/requests/{id}/finance_note/`,
  delete_finance_note: `${API_BASE_URL}/purchases/requests/{id}/finance_note/`,
};

export default API_BASE_URL;