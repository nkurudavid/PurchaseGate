import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { apiRequest } from '../config/api';
import { API_ENDPOINTS } from '../config/endpoints';
import { useToast } from './ToastContext';



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

    // Get toast functions
    const toast = useToast();


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
            toast.success('Request created successfully!');
            return newRequest;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create request');
            throw error;
        }
    }, [toast]);

    // Update request
    const updateRequest = useCallback(async (id: number, data: Partial<CreateRequestData>) => {
        try {
            const endpoint = API_ENDPOINTS.update_my_request.replace('{id}', id.toString());
            const updatedRequest = await apiRequest<PurchaseRequest>(endpoint, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
            setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
            toast.success('Request updated successfully!');
            return updatedRequest;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update request');
            throw error;
        }
    }, [toast]);

    // Delete request
    const deleteRequest = useCallback(async (id: number) => {
        try {
            const endpoint = API_ENDPOINTS.delete_my_request.replace('{id}', id.toString());
            await apiRequest(endpoint, { method: 'DELETE' });
            setRequests(prev => prev.filter(req => req.id !== id));
            toast.success('Request deleted successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete request');
            throw error;
        }
    }, [toast]);

    // Approve request
    const approveRequest = useCallback(async (id: number, note?: string) => {
        try {
            const endpoint = API_ENDPOINTS.approve_request.replace('{id}', id.toString());
            await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({ note }),
            });
            toast.success('Request approved successfully!');
            await fetchRequests(); // Refresh the list
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to approve request');
            throw error;
        }
    }, [fetchRequests, toast]);

    // Reject request
    const rejectRequest = useCallback(async (id: number, note?: string) => {
        try {
            const endpoint = API_ENDPOINTS.reject_request.replace('{id}', id.toString());
            await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({ note }),
            });
            toast.success('Request rejected successfully!');
            await fetchRequests(); // Refresh the list
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to reject request');
            throw error;
        }
    }, [fetchRequests, toast]);

    // Add finance note
    const addFinanceNote = useCallback(async (id: number, note: string) => {
        try {
            const endpoint = API_ENDPOINTS.add_finance_note.replace('{id}', id.toString());
            await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({ finance_note: note }),
            });
            toast.success('Finance note added successfully!');
            await fetchRequests();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to add finance note');
            throw error;
        }
    }, [fetchRequests, toast]);

    // Update finance note
    const updateFinanceNote = useCallback(async (id: number, note: string) => {
        try {
            const endpoint = API_ENDPOINTS.update_finance_note.replace('{id}', id.toString());
            await apiRequest(endpoint, {
                method: 'PATCH',
                body: JSON.stringify({ finance_note: note }),
            });
            toast.success('Finance note updated successfully!');
            await fetchRequests();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update finance note');
            throw error;
        }
    }, [fetchRequests, toast]);

    // Delete finance note
    const deleteFinanceNote = useCallback(async (id: number) => {
        try {
            const endpoint = API_ENDPOINTS.delete_finance_note.replace('{id}', id.toString());
            await apiRequest(endpoint, { method: 'DELETE' });
            toast.success('Finance note deleted successfully!');
            await fetchRequests();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete finance note');
            throw error;
        }
    }, [fetchRequests, toast]);

    // Update profile
    const updateProfile = useCallback(async (data: UpdateProfileData) => {
        try {
            await apiRequest(API_ENDPOINTS.update_profile, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
            throw error;
        }
    }, [toast]);

    // Change password
    const changePassword = useCallback(async (data: ChangePasswordData) => {
        try {
            await apiRequest(API_ENDPOINTS.change_password, {
                method: 'POST',
                body: JSON.stringify(data),
            });
            toast.success('Password changed successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to change password');
            throw error;
        }
    }, [toast]);

    // Delete account
    const deleteAccount = useCallback(async () => {
        try {
            await apiRequest(API_ENDPOINTS.delete_account, {
                method: 'DELETE',
            });
            toast.success('Account deleted successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete account');
            throw error;
        }
    }, [toast]);

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