import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { apiRequest } from '../config/api';
import { API_ENDPOINTS } from '../config/endpoints';

// Types
interface PurchaseRequest {
  id: number;
  item_name: string;
  description?: string;
  quantity: number;
  estimated_cost: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  requester: number;
  approver?: number;
  finance_note?: string;
}

interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface CreateRequestData {
  item_name: string;
  description?: string;
  quantity: number;
  estimated_cost: number;
}

interface DataContextType {
  // Purchase Requests
  requests: PurchaseRequest[];
  isLoadingRequests: boolean;
  fetchRequests: () => Promise<void>;
  createRequest: (data: CreateRequestData) => Promise<PurchaseRequest>;
  updateRequest: (id: number, data: Partial<CreateRequestData>) => Promise<PurchaseRequest>;
  deleteRequest: (id: number) => Promise<void>;
  approveRequest: (id: number, note?: string) => Promise<void>;
  rejectRequest: (id: number, note?: string) => Promise<void>;
  
  // Finance Notes
  addFinanceNote: (id: number, note: string) => Promise<void>;
  updateFinanceNote: (id: number, note: string) => Promise<void>;
  deleteFinanceNote: (id: number) => Promise<void>;
  
  // Profile Management
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Fetch all requests
  const fetchRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    try {
      const data = await apiRequest<PurchaseRequest[]>(API_ENDPOINTS.staff_requests);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      throw error;
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  // Create new request
  const createRequest = useCallback(async (data: CreateRequestData) => {
    try {
      const newRequest = await apiRequest<PurchaseRequest>(
        API_ENDPOINTS.create_request,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (error) {
      console.error('Failed to create request:', error);
      throw error;
    }
  }, []);

  // Update request
  const updateRequest = useCallback(async (id: number, data: Partial<CreateRequestData>) => {
    try {
      const endpoint = API_ENDPOINTS.update_my_request.replace('{id}', id.toString());
      const updatedRequest = await apiRequest<PurchaseRequest>(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      return updatedRequest;
    } catch (error) {
      console.error('Failed to update request:', error);
      throw error;
    }
  }, []);

  // Delete request
  const deleteRequest = useCallback(async (id: number) => {
    try {
      const endpoint = API_ENDPOINTS.delete_my_request.replace('{id}', id.toString());
      await apiRequest(endpoint, { method: 'DELETE' });
      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (error) {
      console.error('Failed to delete request:', error);
      throw error;
    }
  }, []);

  // Approve request
  const approveRequest = useCallback(async (id: number, note?: string) => {
    try {
      const endpoint = API_ENDPOINTS.approve_request.replace('{id}', id.toString());
      await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ note }),
      });
      await fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Failed to approve request:', error);
      throw error;
    }
  }, [fetchRequests]);

  // Reject request
  const rejectRequest = useCallback(async (id: number, note?: string) => {
    try {
      const endpoint = API_ENDPOINTS.reject_request.replace('{id}', id.toString());
      await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ note }),
      });
      await fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Failed to reject request:', error);
      throw error;
    }
  }, [fetchRequests]);

  // Add finance note
  const addFinanceNote = useCallback(async (id: number, note: string) => {
    try {
      const endpoint = API_ENDPOINTS.add_finance_note.replace('{id}', id.toString());
      await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ finance_note: note }),
      });
      await fetchRequests();
    } catch (error) {
      console.error('Failed to add finance note:', error);
      throw error;
    }
  }, [fetchRequests]);

  // Update finance note
  const updateFinanceNote = useCallback(async (id: number, note: string) => {
    try {
      const endpoint = API_ENDPOINTS.update_finance_note.replace('{id}', id.toString());
      await apiRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify({ finance_note: note }),
      });
      await fetchRequests();
    } catch (error) {
      console.error('Failed to update finance note:', error);
      throw error;
    }
  }, [fetchRequests]);

  // Delete finance note
  const deleteFinanceNote = useCallback(async (id: number) => {
    try {
      const endpoint = API_ENDPOINTS.delete_finance_note.replace('{id}', id.toString());
      await apiRequest(endpoint, { method: 'DELETE' });
      await fetchRequests();
    } catch (error) {
      console.error('Failed to delete finance note:', error);
      throw error;
    }
  }, [fetchRequests]);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      await apiRequest(API_ENDPOINTS.update_profile, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (data: ChangePasswordData) => {
    try {
      await apiRequest(API_ENDPOINTS.change_password, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }, []);

  // Delete account
  const deleteAccount = useCallback(async () => {
    try {
      await apiRequest(API_ENDPOINTS.delete_account, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        requests,
        isLoadingRequests,
        fetchRequests,
        createRequest,
        updateRequest,
        deleteRequest,
        approveRequest,
        rejectRequest,
        addFinanceNote,
        updateFinanceNote,
        deleteFinanceNote,
        updateProfile,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}