'use client';

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { KYCApplication, KYCStatus } from '@/app/types/kyc';
import { motion } from 'motion/react';

interface ApplicationListProps {
  applications: KYCApplication[];
  loading: boolean;
  onSelectApplication: (id: string) => void;
  currentPage: number;
  totalPages: number;
  totalApplications: number;
  onPageChange: (page: number) => void;
}

export default function ApplicationList({
  applications,
  loading,
  onSelectApplication,
  currentPage,
  totalPages,
  totalApplications,
  onPageChange
}: ApplicationListProps) {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);

  const getStatusConfig = (status: KYCStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          variant: 'secondary' as const,
          icon: Clock,
          color: 'text-yellow-600'
        };
      case 'submitted':
        return {
          label: 'Submitted',
          variant: 'default' as const,
          icon: Clock,
          color: 'text-blue-600'
        };
      case 'under_review':
        return {
          label: 'Under Review',
          variant: 'default' as const,
          icon: Search,
          color: 'text-indigo-600'
        };
      case 'approved':
        return {
          label: 'Approved',
          variant: 'default' as const,
          icon: CheckCircle,
          color: 'text-green-600'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          variant: 'destructive' as const,
          icon: XCircle,
          color: 'text-red-600'
        };
      default:
        return {
          label: 'Unknown',
          variant: 'secondary' as const,
          icon: Filter,
          color: 'text-gray-600'
        };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map(app => app.id));
    }
  };

  const handleSelectApplication = (id: string) => {
    setSelectedApplications(prev => 
      prev.includes(id) 
        ? prev.filter(appId => appId !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status: KYCStatus) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
        <p className="text-gray-600">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedApplications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-blue-800">
              <span className="font-medium">{selectedApplications.length}</span> applications selected
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Approve Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Reject Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedApplications([])}
                className="text-blue-700 hover:bg-blue-100"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Applications Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedApplications.length === applications.length && applications.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </TableHead>
              <TableHead className="font-medium text-gray-900">Seller</TableHead>
              <TableHead className="font-medium text-gray-900">Business</TableHead>
              <TableHead className="font-medium text-gray-900">Status</TableHead>
              <TableHead className="font-medium text-gray-900">Documents</TableHead>
              <TableHead className="font-medium text-gray-900">Submitted</TableHead>
              <TableHead className="font-medium text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application, index) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.tr
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onSelectApplication(application.id)}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(application.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectApplication(application.id);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </TableCell>
                  
                  <TableCell className="font-medium text-gray-900">
                    <div>
                      <div>{application.sellerName}</div>
                      <div className="text-sm text-gray-500">{application.sellerEmail}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-gray-900">
                      {application.businessName || 'N/A'}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`${getStatusColor(application.status)} font-medium`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {application.approvedDocuments}/{application.totalDocuments}
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${(application.approvedDocuments / application.totalDocuments) * 100 || 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      <div>{formatDate(application.submittedAt)}</div>
                      <div className="text-xs text-gray-500">
                        {formatTimeAgo(application.submittedAt)}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectApplication(application.id);
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalApplications)} of {totalApplications} applications
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={pageNum === currentPage 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}