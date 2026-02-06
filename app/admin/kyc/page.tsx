'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import {
  getAdminKYCStats,
  getAdminKYCApplications,
  getAdminKYCApplication,
  reviewKYCApplication
} from '@/app/actions/kyc.action';
import { KYCReviewPayload } from '@/app/types/kyc';
import { 
  setStats,
  setApplications,
  setAdminLoading,
  setAdminError,
  setSelectedApplication,
  updateApplication
} from '@/app/store/slices/kyc.slice';
import { Button } from '@/app/components/ui/button';
import DashboardCard from '@/app/components/common/DashboardCard';
import StatsCard from '@/app/components/dashboard/StatsCard';
import { RefreshCw, Clock, CheckCircle, XCircle, FileText, User, Building, Calendar, File, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { FaUserCheck, FaUserClock, FaUserTimes, FaFileAlt } from 'react-icons/fa';

// Transform backend application data to frontend KYCApplication format
function transformBackendApplication(backendApp: any): any {
  return {
    id: backendApp._id,
    sellerId: backendApp.sellerId._id,
    sellerName: `${backendApp.sellerId.firstName || ''} ${backendApp.sellerId.lastName || ''}`.trim() || 'Unknown Seller',
    sellerEmail: backendApp.sellerId.email,
    businessName: backendApp.sellerId.businessDetails?.businessName || 'N/A',
    status: backendApp.status,
    submittedAt: backendApp.submittedAt,
    createdAt: backendApp.createdAt,
    updatedAt: backendApp.updatedAt,
    totalDocuments: backendApp.documents?.length || 0,
    approvedDocuments: backendApp.documents?.filter((doc: any) => doc.verified).length || 0,
    documents: backendApp.documents || [],
    verificationSteps: {
      identityVerified: backendApp.verificationSteps?.identityVerified || false,
      businessVerified: backendApp.verificationSteps?.businessVerified || false,
      addressVerified: backendApp.verificationSteps?.addressVerified || false,
      financialVerified: backendApp.verificationSteps?.financialVerified || false
    }
  };
}

export default function AdminKYCPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { 
    stats, 
    applications, 
    adminLoading, 
    adminError,
    filters
  } = useSelector((state: RootState) => state.kyc);

  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setAdminLoading(true));
        
        // Fetch stats
        const statsResponse = await getAdminKYCStats();
        if (statsResponse.status === 'success' && statsResponse.data) {
          dispatch(setStats(statsResponse.data));
        }
        
        // Fetch applications with submitted status
        const appsResponse = await getAdminKYCApplications({
          ...filters,
          status: 'submitted',
          page: 1,
          limit: 10
        });
        
        if (appsResponse.status === 'success' && appsResponse.data) {
          // Transform backend data to frontend format
          const transformedApps = appsResponse.data.applications.map(transformBackendApplication);
          dispatch(setApplications({
            applications: transformedApps,
            total: appsResponse.data.total,
            page: appsResponse.data.page,
            limit: appsResponse.data.limit
          }));
        }
      } catch (err: any) {
        dispatch(setAdminError(err.message || 'Failed to load data'));
      } finally {
        dispatch(setAdminLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  const handleRefresh = async () => {
    try {
      // Refresh stats
      const statsResponse = await getAdminKYCStats();
      if (statsResponse.status === 'success' && statsResponse.data) {
        dispatch(setStats(statsResponse.data));
      }
      
      // Refresh applications
      const appsResponse = await getAdminKYCApplications({
        ...filters,
        status: 'submitted',
        page: 1,
        limit: 10
      });
      
      if (appsResponse.status === 'success' && appsResponse.data) {
        const transformedApps = appsResponse.data.applications.map(transformBackendApplication);
        dispatch(setApplications({
          applications: transformedApps,
          total: appsResponse.data.total,
          page: appsResponse.data.page,
          limit: appsResponse.data.limit
        }));
      }
      
      toast.success('Data refreshed successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to refresh data');
    }
  };

  const handleViewDetails = async (applicationId: string) => {
    try {
      const response = await getAdminKYCApplication(applicationId);
      if (response.status === 'success' && response.data) {
        const transformedApp = transformBackendApplication(response.data);
        setSelectedApp(transformedApp);
        setViewMode('detail');
        dispatch(setSelectedApplication(transformedApp));
      } else {
        toast.error(response.error || 'Failed to load application details');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load application details');
    }
  };

  const handleApprove = async () => {
    if (!selectedApp) return;
    
    setIsProcessing(true);
    try {
      const payload: KYCReviewPayload = {
        status: 'approved',
        verificationSteps: {
          identityVerified: true,
          businessVerified: true,
          financialVerified: true,
          addressVerified: true
        }
      };
      
      const response = await reviewKYCApplication(selectedApp.id, payload);
      if (response.status === 'success' && response.data) {
        const transformedApp = transformBackendApplication(response.data);
        setSelectedApp(transformedApp);
        dispatch(updateApplication(transformedApp));
        toast.success('Application approved successfully');
      } else {
        toast.error(response.error || 'Failed to approve application');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    
    const reason = prompt('Please provide a rejection reason:');
    if (!reason) return;
    
    setIsProcessing(true);
    try {
      const payload: KYCReviewPayload = {
        status: 'rejected',
        rejectionReason: reason
      };
      
      const response = await reviewKYCApplication(selectedApp.id, payload);
      if (response.status === 'success' && response.data) {
        const transformedApp = transformBackendApplication(response.data);
        setSelectedApp(transformedApp);
        dispatch(updateApplication(transformedApp));
        toast.success('Application rejected successfully');
      } else {
        toast.error(response.error || 'Failed to reject application');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedApp(null);
    dispatch(setSelectedApplication(null));
  };

  if (viewMode === 'detail' && selectedApp) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">KYC Application Details</h1>
            <p className="text-gray-600">Application ID: {selectedApp.id}</p>
          </div>
          <Button
            onClick={handleBackToList}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            ← Back to List
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seller Information Card */}
          <DashboardCard>
            <h3 className="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">
              <User className="w-5 h-5" />
              Seller Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{selectedApp.sellerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedApp.sellerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Business</p>
                <p className="font-medium">{selectedApp.businessName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedApp.status === 'approved' ? 'bg-green-100 text-green-800' :
                  selectedApp.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  selectedApp.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Submission Details Card */}
          <DashboardCard>
            <h3 className="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Submission Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Submitted Date</p>
                <p className="font-medium">{new Date(selectedApp.submittedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Documents</p>
                <p className="font-medium">{selectedApp.totalDocuments} total ({selectedApp.approvedDocuments} approved)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Verification Steps</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedApp.verificationSteps?.identityVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={selectedApp.verificationSteps?.identityVerified ? 'text-green-600' : 'text-gray-500'}>
                      Identity Verification
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedApp.verificationSteps?.businessVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={selectedApp.verificationSteps?.businessVerified ? 'text-green-600' : 'text-gray-500'}>
                      Business Verification
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedApp.verificationSteps?.addressVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={selectedApp.verificationSteps?.addressVerified ? 'text-green-600' : 'text-gray-500'}>
                      Address Verification
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedApp.verificationSteps?.financialVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={selectedApp.verificationSteps?.financialVerified ? 'text-green-600' : 'text-gray-500'}>
                      Financial Verification
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </DashboardCard>

          {/* Action Card */}
          <DashboardCard>
            <h3 className="text-xl font-semibold mb-4 text-green-700">Actions</h3>
            <div className="space-y-4">
              {selectedApp.status === 'submitted' ? (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Approve Application'}
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Reject Application'}
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">
                    Application is already {selectedApp.status}
                  </p>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        {/* Documents Card - Full Width */}
        <DashboardCard>
          <h3 className="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">
            <File className="w-5 h-5" />
            Submitted Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedApp.documents && selectedApp.documents.map((doc: any) => (
              <div key={doc._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{doc.fileName}</p>
                    <p className="text-xs text-gray-600 mt-1">Type: {doc.documentType}</p>
                    <p className="text-xs text-gray-600">
                      Status: 
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        doc.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.verified ? 'Verified' : 'Pending'}
                      </span>
                    </p>
                    {doc.verificationNotes && (
                      <p className="text-xs text-gray-600 mt-1">Notes: {doc.verificationNotes}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.documentUrl, '_blank')}
                    className="ml-2"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">KYC Management</h1>
          <p className="text-gray-600">Manage seller verification applications</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={adminLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${adminLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={<FaFileAlt size={32} />}
            BgColor="bg-blue-100"
            BorderColor="border-blue-500"
          />
          <StatsCard
            title="Submitted"
            value={stats.submittedApplications}
            icon={<FaUserClock size={32} />}
            BgColor="bg-yellow-100"
            BorderColor="border-yellow-500"
          />
          <StatsCard
            title="Approved"
            value={stats.approvedApplications}
            icon={<FaUserCheck size={32} />}
            BgColor="bg-green-100"
            BorderColor="border-green-500"
          />
          <StatsCard
            title="Rejected"
            value={stats.rejectedApplications}
            icon={<FaUserTimes size={32} />}
            BgColor="bg-red-100"
            BorderColor="border-red-500"
          />
        </div>
      )}

      {/* Applications List */}
      <DashboardCard>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-green-700">Submitted Applications</h2>
          <p className="text-gray-600 mt-1">All submitted KYC applications</p>
        </div>
        
        <div>
          {adminLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading applications...</p>
              </div>
            </div>
          ) : adminError ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <XCircle className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-600 mb-4">{adminError}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Try Again
              </Button>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-gray-600">There are no submitted KYC applications to display.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application: any) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.sellerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.sellerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.businessName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'approved' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          application.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.totalDocuments} total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          onClick={() => handleViewDetails(application.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}