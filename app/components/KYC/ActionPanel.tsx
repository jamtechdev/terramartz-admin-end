'use client';

import { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Shield,
  Send,
  AlertCircle
} from 'lucide-react';
import { KYCApplication, KYCStatus } from '../../types/kyc';

interface ActionPanelProps {
  application: KYCApplication;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export default function ActionPanel({
  application,
  onApprove,
  onReject,
  isApproving,
  isRejecting
}: ActionPanelProps) {
  const [rejectionReason, setRejectionReason] = useState('');

  const getStatusConfig = (status: KYCStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          label: 'Pending',
          description: 'Application is awaiting review'
        };
      case 'submitted':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          label: 'Submitted',
          description: 'Documents have been submitted for review'
        };
      case 'under_review':
        return {
          icon: Clock,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100',
          label: 'Under Review',
          description: 'Application is being reviewed by our team'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: 'Approved',
          description: 'Application has been approved'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          label: 'Rejected',
          description: 'Application has been rejected'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          label: 'Unknown',
          description: 'Unknown status'
        };
    }
  };

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  const canTakeAction = application.status === 'submitted' || application.status === 'under_review';

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-600" />
          Application Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            <span className="font-medium text-gray-900">{statusConfig.label}</span>
          </div>
          <Badge 
            variant="outline" 
            className={`${statusConfig.bgColor} ${statusConfig.color} capitalize`}
          >
            {application.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {canTakeAction ? (
            <>
              <Button
                onClick={onApprove}
                disabled={isApproving || isRejecting}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isApproving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </>
                )}
              </Button>

              <Button
                variant="destructive"
                onClick={onReject}
                disabled={isApproving || isRejecting}
              >
                {isRejecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                This application has already been {application.status.replace('_', ' ')}
              </p>
            </div>
          )}
        </div>

        {/* Rejection Reason */}
        {application.status === 'rejected' && application.rejectionReason && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-1">Rejection Reason</h4>
            <p className="text-sm text-red-700">{application.rejectionReason}</p>
          </div>
        )}

        {/* Warning Message */}
        {!canTakeAction && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                This application cannot be modified as it has already been processed. 
                If you need to make changes, please contact support.
              </p>
            </div>
          </div>
        )}

        {/* Action Summary */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Send className="w-4 h-4" />
            Action Summary
          </h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div className="flex justify-between">
              <span>Total Documents:</span>
              <span className="font-medium">{application.totalDocuments}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved:</span>
              <span className="font-medium text-green-600">{application.approvedDocuments}</span>
            </div>
            <div className="flex justify-between">
              <span>Steps Completed:</span>
              <span className="font-medium">
                {application.verificationSteps.filter(s => s.status === 'approved').length}/{application.verificationSteps.length}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}