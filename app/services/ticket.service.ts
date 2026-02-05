import { getAuthTokenClient } from '@/app/utils/authClient';

interface ContactInquiry {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  inquiryType: string;
  subject: string;
  message: string;
  status: string;
  assignedAdmin?: string | { _id: string; name: string; email: string; role: string };  // Handle both string ID and object
  assignedAt?: string;
  assignmentHistory: Array<{
    assignedTo: string;
    assignedAt: string;
    reason: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ContactResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
  results?: number;
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ContactStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export async function getContactInquiries(page: number = 1, limit: number = 10): Promise<ContactResponse<{ inquiries: ContactInquiry[] }>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/?page=${page}&limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { status: 'error', error: data.message || 'Failed to fetch inquiries' };
    }

    return { 
      status: 'success', 
      data: data.data, // The inquiries are in the data.data property
      results: data.results,
      total: data.total,
      pagination: data.pagination
    };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Network error' };
  }
}

export async function getContactInquiryStats(): Promise<ContactResponse<ContactStats>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/stats`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { status: 'error', error: data.message || 'Failed to fetch stats' };
    }

    // Handle the response structure properly - the stats are in data.statistics
    const statsData = data.data?.statistics || {};
    return { 
      status: 'success', 
      data: {
        total: (statsData.pending || 0) + (statsData.in_progress || 0), // Calculate total from known values
        pending: statsData.pending || 0,
        inProgress: statsData.in_progress || statsData['in_progress'] || 0,
        resolved: statsData.resolved || statsData.completed || 0
      }
    };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Network error' };
  }
}

export async function getContactInquiryById(ticketId: string): Promise<ContactResponse<ContactInquiry>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${ticketId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { status: 'error', error: data.message || 'Failed to fetch inquiry' };
    }

    // Handle the response structure properly - the inquiry is in data.inquiry
    return { status: 'success', data: data.data.inquiry };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Network error' };
  }
}

export async function updateContactInquiryStatus(ticketId: string, status: string): Promise<ContactResponse<ContactInquiry>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${ticketId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { status: 'error', error: data.message || 'Failed to update status' };
    }

    // Handle the response structure properly - the inquiry is likely in data.data or data.inquiry
    return { status: 'success', data: data.data?.inquiry || data.data };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Network error' };
  }
}

export async function assignContactInquiry(ticketId: string, newAdminId: string | null): Promise<ContactResponse<ContactInquiry>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${ticketId}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ newAdminId }),
    });

    const data = await res.json();
    console.log('Assign API raw response:', JSON.stringify(data, null, 2)); // Debug log

    if (!res.ok) {
      return { status: 'error', error: data.message || 'Failed to assign inquiry' };
    }

    // Handle the response structure properly - the inquiry is likely in data.data or data.inquiry
    const responseData = data.data?.inquiry || data.data || data.ticket || data;
    console.log('Assign API processed data:', responseData); // Debug log
    return { status: 'success', data: responseData };
  } catch (err: any) {
    console.log('Assign API error:', err); // Debug log
    return { status: 'error', error: err.message || 'Network error' };
  }
}

// Add this new function to fetch all available admins
export async function getAllAdmins(page: number = 1, limit: number = 10): Promise<any> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/accounts?page=${page}&limit=${limit}&sort=-createdAt`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { status: 'error', error: data.message || 'Failed to fetch admins' };
    }

    return { status: 'success', data: data.data };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Network error' };
  }
}

// Get tickets assigned to the current user
export async function getMyTickets(page: number = 1, limit: number = 10): Promise<ContactResponse<{ tickets: ContactInquiry[] }>> {
  try {
    const token = await getAuthTokenClient();
    if (!token) {
      return { status: 'error', error: 'Authentication required' };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/my-tickets?page=${page}&limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { status: 'error', error: data.message || 'Failed to fetch assigned tickets' };
    }

    return { 
      status: 'success', 
      data: data.data, 
      results: data.results,
      total: data.total,
      pagination: data.pagination
    };
  } catch (err: any) {
    return { status: 'error', error: err.message || 'Network error' };
  }
}
