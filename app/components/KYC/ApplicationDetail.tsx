'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/core/components/ui/card';
import { Button } from '@/modules/core/components/ui/button';
import { Badge } from '@/modules/core/components/ui/badge';
import { Textarea } from '@/modules/core/components/ui/textarea';
import { Label } from '@/modules/core/components/ui/label';
import { 
  ArrowLeft, 
  User, 
  Building, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';
import { KYCApplication, KYCReviewPayload } from '@/modules/core/types/kyc';
import { motion } from 'motion/react';
import DocumentGallery from './DocumentGallery';
import ActionPanel from './ActionPanel';

interface ApplicationDetailProps {
  application: KYCApplication;
  onBack: () => void;
  onReview: (payload: KYCReviewPayload) => void;
}

export default function ApplicationDetail({
  application,
  onBack,
  onReview
}: ApplicationDetailProps) {
  const [reviewNotes, setReviewNotes] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onReview({
        applicationId: application.id,
        action: 'approve',
        notes: reviewNotes
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await onReview({
        applicationId: application.id,
        action: 'reject',
        notes: reviewNotes,
        reason: 'Manual rejection by admin'
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-gray-100 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600">Review and process seller verification</p>
          </div>
        </div>
        
        <Badge className={`${getStatusColor(application.status)} text-sm font-medium px-3 py-1`}>
          {application.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Seller Information */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                Seller Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Name</Label>
                <p className="text-gray-900">{application.sellerName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="text-gray-900">{application.sellerEmail}</p>
              </div>
              {application.businessName && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Business Name</Label>
                  <p className="text-gray-900">{application.businessName}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Timeline */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                  <p className="text-xs text-gray-500">{formatDate(application.submittedAt)}</p>
                </div>
              </div>
              
              {application.reviewedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Under Review</p>
                    <p className="text-xs text-gray-500">{formatDate(application.reviewedAt)}</p>
                  </div>
                </div>
              )}
              
              {application.approvedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Approved</p>
                    <p className="text-xs text-gray-500">{formatDate(application.approvedAt)}</p>
                  </div>
                </div>
              )}
              
              {application.rejectedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rejected</p>
                    <p className="text-xs text-gray-500">{formatDate(application.rejectedAt)}</p>
                    {application.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">{application.rejectionReason}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Summary */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Document Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Documents</span>
                  <span className="font-medium">{application.totalDocuments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="font-medium text-green-600">{application.approvedDocuments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Review</span>
                  <span className="font-medium text-yellow-600">
                    {application.totalDocuments - application.approvedDocuments}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(application.approvedDocuments / application.totalDocuments) * 100 || 0}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1">
                    {Math.round((application.approvedDocuments / application.totalDocuments) * 100 || 0)}% Complete
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Notes */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Review Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about this application..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Action Panel */}
          <ActionPanel
            application={application}
            onApprove={handleApprove}
            onReject={handleReject}
            isApproving={isApproving}
            isRejecting={isRejecting}
          />
        </div>

        {/* Document Gallery */}
        <div className="lg:col-span-2">
          <DocumentGallery 
            application={application}
            onDocumentAction={(docId, action) => {
              console.log('Document action:', docId, action);
              // Handle document-specific actions
            }}
          />
        </div>
      </div>
    </div>
  );
}