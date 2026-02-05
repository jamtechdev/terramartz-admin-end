'use client';

import { getAuthTokenClient } from '@/app/utils/authClient';
import { 
  KYCApplication, 
  KYCStats, 
  KYCReviewPayload, 
  KYCFilterOptions, 
  KYCResponse
} from '@/app/types/kyc';

const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;

// Get KYC applications list
export async function getAdminKYCApplications(
  filters: KYCFilterOptions
): Promise<KYCResponse<{ applications: KYCApplication[]; total: number; page: number; limit: number }>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);

    const res = await fetch(`${API_URL}/api/admin/kyc/applications?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      return { status: 'error', error: data?.message || `HTTP Error: ${res.status}` };
    }

    // Transform backend response to match expected format
    return { 
      status: 'success', 
      data: {
        applications: data.data.applications,
        total: data.total,
        page: data.page,
        limit: filters.limit || 10
      }
    };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Failed to fetch KYC applications' };
  }
}

// Get KYC application details
export async function getAdminKYCApplication(
  kycId: string
): Promise<KYCResponse<KYCApplication>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${API_URL}/api/admin/kyc/application/${kycId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      return { status: 'error', error: data?.message || `HTTP Error: ${res.status}` };
    }

    return { status: 'success', data: data.data };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Failed to fetch KYC application' };
  }
}

// Get KYC statistics
export async function getAdminKYCStats(): Promise<KYCResponse<KYCStats>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${API_URL}/api/admin/kyc/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      return { status: 'error', error: data?.message || `HTTP Error: ${res.status}` };
    }

    // Transform backend response to match expected format
    return { 
      status: 'success', 
      data: {
        totalApplications: data.data.total,
        pendingApplications: data.data.pending,
        submittedApplications: data.data.submitted,
        approvedApplications: data.data.approved,
        rejectedApplications: data.data.rejected,
        underReviewApplications: data.data.under_review,
        completionRate: Math.round((data.data.approved / data.data.total) * 100) || 0,
        recentActivity: []
      }
    };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Failed to fetch KYC stats' };
  }
}

// Review KYC application
export async function reviewKYCApplication(
  kycId: string,
  payload: KYCReviewPayload
): Promise<KYCResponse<KYCApplication>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${API_URL}/api/admin/kyc/application/${kycId}/review`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    
    if (!res.ok) {
      return { status: 'error', error: data?.message || `HTTP Error: ${res.status}` };
    }

    return { status: 'success', data: data.data };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Failed to review KYC application' };
  }
}

// Bulk KYC actions
export async function bulkKYCAction(
  applicationIds: string[],
  action: 'approve' | 'reject',
  reason?: string
): Promise<KYCResponse<{ success: number; failed: number }>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${API_URL}/api/admin/kyc/bulk-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ applicationIds, action, reason }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      return { status: 'error', error: data?.message || `HTTP Error: ${res.status}` };
    }

    return { status: 'success', data: data.data };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Failed to perform bulk action' };
  }
}