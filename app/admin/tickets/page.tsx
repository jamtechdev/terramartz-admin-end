'use client';

import DashboardCard from '@/app/components/common/DashboardCard';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import { useState, useEffect } from 'react';
import { 
  getContactInquiries, 
  getContactInquiryStats, 
  updateContactInquiryStatus,
  getContactInquiryById,
  assignContactInquiry,
  getAllAdmins
  // getMyTickets
} from '@/app/services/ticket.service';
import { getUserRoleFromToken } from '@/app/utils/authClient';
import { toast } from 'sonner';
import { FaUser, FaEnvelope, FaPhone, FaTag, FaComments, FaClock, FaCheck, FaExclamationTriangle, FaUserCheck } from 'react-icons/fa';
import { RiTicketLine } from 'react-icons/ri';

interface ContactInquiry {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  inquiryType: string;
  subject: string;
  message: string;
  status: string;
  assignedAdmin?: string | { 
    _id: string; 
    name: string; 
    email: string; 
    role: string;
    permissions?: Record<string, string>;
  } | null;  // Handle both string ID, object, and null
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

interface ContactStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export default function TicketPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableAdmins, setAvailableAdmins] = useState<any[]>([]); // State for available admins
  const [showAdminDropdown, setShowAdminDropdown] = useState(false); // State to toggle dropdown visibility
  const [userRole, setUserRole] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState('');

  // Fetch available admins
  useEffect(() => {
    const fetchAdmins = async () => {
      const role = await getUserRoleFromToken();
      setUserRole(role);
      
      if (role !== 'Super Admin') return;

      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (token) {
          const res: any = await getAllAdmins(1, 10);
          if (res.status === 'success' && res.data && res.data.admins) {
            // Remove duplicates based on _id and log duplicates for debugging
            const seenIds = new Set();
            const uniqueAdmins = res.data.admins.filter((admin: any) => {
              if (seenIds.has(admin._id)) {
                return false;
              }
              seenIds.add(admin._id);
              return true;
            });
            setAvailableAdmins(uniqueAdmins);
          } else if (res.status === 'success' && res.data) {
            // If the response has admins in a different field name
            const adminKeys = Object.keys(res.data).filter(key => 
              key.toLowerCase().includes('admin') || key.toLowerCase() === 'users' || key.toLowerCase() === 'accounts'
            );
            if (adminKeys.length > 0) {
              const adminsData = res.data[adminKeys[0]] || [];
              // Remove duplicates based on _id
              const seenIds = new Set();
              const uniqueAdmins = adminsData.filter((admin: any) => {
                if (seenIds.has(admin._id)) {
                  return false;
                }
                seenIds.add(admin._id);
                return true;
              });
              setAvailableAdmins(uniqueAdmins);
            } else {
              // Assume the entire data object is the array
              const adminsData = Array.isArray(res.data) ? res.data : [];
              // Remove duplicates based on _id
              const seenIds = new Set();
              const uniqueAdmins = adminsData.filter((admin: any) => {
                if (seenIds.has(admin._id)) {
                  return false;
                }
                seenIds.add(admin._id);
                return true;
              });
              setAvailableAdmins(uniqueAdmins);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching admins:', err);
      }
    };

    fetchAdmins();
  }, []);

  const fetchTickets = async (overrideFilters?: { search?: string; status?: string; inquiryType?: string }) => {
    try {
      setLoading(true);
      
      const role = await getUserRoleFromToken();
      setUserRole(role);

      const effectiveSearch = overrideFilters && Object.prototype.hasOwnProperty.call(overrideFilters, 'search')
        ? overrideFilters.search || ''
        : search;

      const effectiveStatus = overrideFilters && Object.prototype.hasOwnProperty.call(overrideFilters, 'status')
        ? overrideFilters.status || ''
        : statusFilter;

      const effectiveInquiryType = overrideFilters && Object.prototype.hasOwnProperty.call(overrideFilters, 'inquiryType')
        ? overrideFilters.inquiryType || ''
        : inquiryTypeFilter;

      const baseFilters: any = {
        page: 1,
        limit: 10
      };

      if (effectiveSearch && effectiveSearch.trim()) {
        baseFilters.search = effectiveSearch.trim();
      }

      if (effectiveStatus) {
        baseFilters.status = effectiveStatus;
      }

      if (effectiveInquiryType) {
        baseFilters.inquiryType = effectiveInquiryType;
      }
      
      // if (role === 'Super Admin') {
        const statsRes = await getContactInquiryStats();
        if (statsRes.status === 'success' && statsRes.data) {
          setStats(statsRes.data);
        }
        
        const allRes = await getContactInquiries(baseFilters);
        
        if (allRes.status === 'success' && allRes.data && allRes.data.inquiries) {
          setInquiries(allRes.data.inquiries);
          
          if (statsRes.status !== 'success' || (statsRes.data && statsRes.data.total === 0)) {
            const calculatedStats = calculateStatsFromInquiries(allRes.data.inquiries);
            setStats(calculatedStats);
          }
        } else {
          setInquiries([]);
        }
      // } else {
      //   const myRes = await getMyTickets(baseFilters);
        
      //   if (myRes.status === 'success' && myRes.data && myRes.data.tickets) {
      //     setInquiries(myRes.data.tickets);
      //     const calculatedStats = calculateStatsFromInquiries(myRes.data.tickets);
      //     setStats(calculatedStats);
      //   } else {
      //     setInquiries([]);
      //     setStats({
      //       total: 0,
      //       pending: 0,
      //       inProgress: 0,
      //       resolved: 0
      //     });
      //   }
      // }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      toast.error(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-700'; // Handle undefined/null status
    
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'in_progress':
      case 'in progress':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Helper function to calculate stats from inquiries
  const calculateStatsFromInquiries = (inquiries: ContactInquiry[]): ContactStats => {
    if (!inquiries || inquiries.length === 0) {
      return {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
      };
    }
    
    const total = inquiries.length;
    const pending = inquiries.filter(i => i.status && i.status.toLowerCase() === 'pending').length;
    const inProgress = inquiries.filter(i => i.status && (i.status.toLowerCase().includes('in_progress') || i.status.toLowerCase() === 'in progress')).length;
    const resolved = inquiries.filter(i => i.status && (i.status.toLowerCase() === 'resolved' || i.status.toLowerCase() === 'completed')).length;
    
    return {
      total,
      pending,
      inProgress,
      resolved
    };
  };

  const handleRefresh = async () => {
    try {
      await fetchTickets();
      toast.success('Data refreshed successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to refresh data');
    }
  };

  const handleFilterSubmit = (e: any) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setInquiryTypeFilter('');
    fetchTickets({ search: '', status: '', inquiryType: '' });
  };

  const handleViewDetails = async (inquiryId: string) => {
    try {
      const res = await getContactInquiryById(inquiryId);
      if (res.status === 'success' && res.data) {
        // Handle potential nested structure
        // @ts-ignore
        const inquiryData = res.data.ticket || res.data;
        setSelectedInquiry(inquiryData);
        setViewMode('detail');
      } else {
        toast.error(res.error || 'Failed to load inquiry details');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load inquiry details');
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedInquiry) return;
    
    // Extract ticket ID properly
    // @ts-ignore
    const ticketId = selectedInquiry._id || selectedInquiry.ticket?._id;

    if (!ticketId) return;

    setIsProcessing(true);
    try {
      const res = await updateContactInquiryStatus(ticketId, status);
      if (res.status === 'success' && res.data) {
        // Handle response data
        // @ts-ignore
        const updatedInquiryData = res.data.ticket || res.data;

        // Preserve populated assignedAdmin if the update response returns an ID string
        // This prevents the UI from showing just the ID after a status update
        // @ts-ignore
        if (typeof updatedInquiryData.assignedAdmin === 'string' && 
            selectedInquiry.assignedAdmin && 
            typeof selectedInquiry.assignedAdmin === 'object' && 
            // @ts-ignore
            selectedInquiry.assignedAdmin._id === updatedInquiryData.assignedAdmin) {
             // @ts-ignore
             updatedInquiryData.assignedAdmin = selectedInquiry.assignedAdmin;
        }

        // Update the selected inquiry with the full response data
        setSelectedInquiry(updatedInquiryData);
        
        // Update the main list with the new status
        setInquiries(prev => prev.map(inq => 
          inq._id === ticketId 
            ? { ...inq, status: updatedInquiryData.status } 
            : inq
        ));
        
        toast.success(`Inquiry status updated to ${status}`);
      } else {
        toast.error(res.error || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAssignTicket = async (newAdminId: string | null) => {
    console.log('handleAssignTicket called with:', newAdminId); // Debug log
    console.log('Selected inquiry:', selectedInquiry); // Debug log
    
    // Extract ticket ID properly handling potential nested structure
    // @ts-ignore - Handling dynamic structure
    const ticketId = selectedInquiry?._id || selectedInquiry?.ticket?._id;
    
    if (!ticketId) {
      console.log('No ticket ID found'); // Debug log
      return;
    }
    
    setIsProcessing(true);
    try {
      console.log('Calling assignContactInquiry with:', ticketId, newAdminId); // Debug log
      const res = await assignContactInquiry(ticketId, newAdminId);
      console.log('Assign API response:', res); // Debug log
      console.log('Response data:', res.data); // Debug log
      
      if (res.status === 'success' && res.data) {
        // Handle response data structure which might be nested under 'ticket'
        // @ts-ignore - Handling dynamic structure
        const updatedInquiryData = res.data.ticket || res.data;
        
        console.log('Updating selected inquiry with:', updatedInquiryData); // Debug log
        console.log('Assigned admin in response:', updatedInquiryData?.assignedAdmin); // Debug log

        // Update the selected inquiry with the full response data
        setSelectedInquiry(updatedInquiryData);
        
        // Update the main list with the new assigned admin data
        setInquiries(prev => {
          const updated = prev.map(inq => 
            inq._id === ticketId 
              ? { 
                  ...inq, 
                  assignedAdmin: updatedInquiryData.assignedAdmin,
                  assignedAt: updatedInquiryData.assignedAt,
                  assignmentHistory: updatedInquiryData.assignmentHistory,
                  status: updatedInquiryData.status // Update status as well if it changed
                } 
              : inq
          );
          console.log('Updated inquiries list:', updated); // Debug log
          return updated;
        });
        
        toast.success(newAdminId ? 'Ticket assigned successfully' : 'Ticket unassigned successfully');
      } else {
        console.log('Assign failed:', res.error); // Debug log
        toast.error(res.error || 'Failed to assign ticket');
      }
    } catch (err: any) {
      console.log('Assign error:', err); // Debug log
      toast.error(err.message || 'Failed to assign ticket');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedInquiry(null);
  };

  // Helper function to get admin ID or name from assignedAdmin field
  const getAssignedAdminDisplay = (assignedAdmin: string | { _id: string; name: string; email: string; role: string; permissions?: Record<string, string> } | null | undefined) => {
    if (!assignedAdmin) return 'Unassigned';
    
    if (typeof assignedAdmin === 'string') {
      return assignedAdmin;
    } else {
      // If it's an object, return the name if available, otherwise the ID
      return assignedAdmin.name || assignedAdmin._id;
    }
  };

  if (viewMode === 'detail' && selectedInquiry) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">Inquiry Details</h1>
            <p className="text-gray-600">Inquiry ID: {selectedInquiry._id}</p>
          </div>
          <button
            onClick={handleBackToList}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information Card */}
          <DashboardCard>
            <h3 className="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">
              <FaUser className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{selectedInquiry.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedInquiry.email}</p>
              </div>
              {selectedInquiry.phoneNumber && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedInquiry.phoneNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Inquiry Type</p>
                <p className="font-medium">{selectedInquiry.inquiryType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInquiry.status)}`}>
                  {selectedInquiry.status ? selectedInquiry.status.charAt(0).toUpperCase() + selectedInquiry.status.slice(1) : 'Unknown'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned Admin</p>
                <p className="font-medium">
                  {getAssignedAdminDisplay(selectedInquiry.assignedAdmin)}
                </p>
              </div>
              {selectedInquiry.assignedAt && (
                <div>
                  <p className="text-sm text-gray-500">Assigned At</p>
                  <p className="font-medium">{new Date(selectedInquiry.assignedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </DashboardCard>

          {/* Inquiry Details Card */}
          <DashboardCard>
            <h3 className="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">
              <FaComments className="w-5 h-5" />
              Inquiry Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium">{selectedInquiry.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p className="font-medium">{selectedInquiry.message}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{new Date(selectedInquiry.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </DashboardCard>

          {/* Actions Card */}
          <DashboardCard>
            <h3 className="text-xl font-semibold mb-4 text-green-700">Actions</h3>
            <div className="space-y-4">
              <button
                onClick={() => handleUpdateStatus('in_progress')}
                disabled={isProcessing || selectedInquiry.status === 'in_progress'}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 ${
                  selectedInquiry.status === 'in_progress' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaUserCheck className="w-5 h-5" />
                {isProcessing ? 'Processing...' : 'Mark as In Progress'}
              </button>
              
              <button
                onClick={() => handleUpdateStatus('resolved')}
                disabled={isProcessing || selectedInquiry.status === 'resolved'}
                className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 ${
                  selectedInquiry.status === 'resolved' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaCheck className="w-5 h-5" />
                {isProcessing ? 'Processing...' : 'Mark as Resolved'}
              </button>
              
              <button
                onClick={() => handleUpdateStatus('pending')}
                disabled={isProcessing || selectedInquiry.status === 'pending'}
                className={`w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 ${
                  selectedInquiry.status === 'pending' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaClock className="w-5 h-5" />
                {isProcessing ? 'Processing...' : 'Mark as Pending'}
              </button>
              
              {/* Assignment Section */}
              {userRole === 'Super Admin' && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Assign to Admin</h4>
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (selectedValue === 'unassign') {
                          handleAssignTicket(null); // Pass null to unassign
                        } else if (selectedValue) {
                          handleAssignTicket(selectedValue);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={selectedInquiry.assignedAdmin && typeof selectedInquiry.assignedAdmin === 'object' ? 
                        selectedInquiry.assignedAdmin._id : 
                        (selectedInquiry.assignedAdmin || '')}
                    >
                      {selectedInquiry.assignedAdmin ? (
                        <>
                          <option value="unassign">Unassign Ticket</option>
                          <option value="" disabled>-- Select to reassign --</option>
                        </>
                      ) : (
                        <option value="" disabled>Select an admin...</option>
                      )}
                      {availableAdmins.map((admin: any) => (
                        <option 
                          key={admin._id} 
                          value={admin._id}
                        >
                          {admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.email || admin._id} 
                          {admin.role ? ` (${admin.role})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Support Tickets" />

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-full mr-4">
                <RiTicketLine className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-3 rounded-full mr-4">
                <FaClock className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-full mr-4">
                <FaExclamationTriangle className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-blue-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-800">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-full mr-4">
                <FaCheck className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-green-600">Resolved</p>
                <p className="text-2xl font-bold text-green-800">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiries List */}
      <DashboardCard>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-green-700">Customer Inquiries</h2>
          <p className="text-gray-600 mt-1">Manage customer support tickets</p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, email, subject or message"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 min-w-[240px] text-sm transition-colors"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={inquiryTypeFilter}
              onChange={(e) => setInquiryTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
            >
              <option value="">All Inquiry Types</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Product Question">Product Question</option>
              <option value="Order Support">Order Support</option>
              <option value="Partnership">Partnership</option>
              <option value="Complaint">Complaint</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Clear
            </button>
          </form>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 self-start md:self-auto"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading inquiries...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Inquiries Found</h3>
            <p className="text-gray-600">There are no customer inquiries to display.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-700">
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Inquiry Type
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Assigned Admin
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inquiry, index) => (
                  <tr
                    key={inquiry._id}
                    className={`transition ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-green-50`}
                  >
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center">
                        <FaUser className="mr-2 text-gray-400" />
                        {inquiry.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center">
                        <FaEnvelope className="mr-2 text-gray-400" />
                        {inquiry.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center">
                        <FaTag className="mr-2 text-gray-400" />
                        {inquiry.inquiryType}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          getStatusColor(inquiry.status)
                        }`}
                      >
                        {inquiry.status ? inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {getAssignedAdminDisplay(inquiry.assignedAdmin)}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <button
                        onClick={() => handleViewDetails(inquiry._id)}
                        className="text-green-600 font-semibold hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
