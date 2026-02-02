'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/core/components/ui/card';
import { Button } from '@/modules/core/components/ui/button';
import { Badge } from '@/modules/core/components/ui/badge';
import { 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Image as ImageIcon,
  AlertCircle,
  ZoomIn,
  RotateCcw
} from 'lucide-react';
import { KYCApplication, KYCDocument, DocumentStatus } from '@/modules/core/types/kyc';
import { motion } from 'motion/react';

interface DocumentGalleryProps {
  application: KYCApplication;
  onDocumentAction?: (documentId: string, action: 'view' | 'download' | 'approve' | 'reject') => void;
}

export default function DocumentGallery({
  application,
  onDocumentAction
}: DocumentGalleryProps) {
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getStatusConfig = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: 'Approved'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          label: 'Rejected'
        };
      case 'needs_review':
        return {
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          label: 'Needs Review'
        };
      case 'pending':
      default:
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          label: 'Pending'
        };
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    } else if (mimeType === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleViewDocument = (doc: KYCDocument) => {
    setSelectedDocument(doc);
    setZoomLevel(1);
    onDocumentAction?.(doc.id, 'view');
  };

  const handleDownloadDocument = (doc: KYCDocument) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.originalName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDocumentAction?.(doc.id, 'download');
  };

  const handleApproveDocument = (documentId: string) => {
    onDocumentAction?.(documentId, 'approve');
  };

  const handleRejectDocument = (documentId: string) => {
    onDocumentAction?.(documentId, 'reject');
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const groupedDocuments = application.verificationSteps.map(step => ({
    step,
    documents: step.documents
  }));

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Document Gallery</span>
            <span className="text-sm text-gray-500">
              {application.totalDocuments} documents
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {groupedDocuments.map((group, groupIndex) => (
              <div key={group.step.id} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {group.step.name}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className="capitalize"
                  >
                    {group.step.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.documents.map((doc, docIndex) => {
                    const statusConfig = getStatusConfig(doc.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (groupIndex * 0.1) + (docIndex * 0.05) }}
                      >
                        <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start space-x-3">
                                {getFileIcon(doc.mimeType)}
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 truncate max-w-[160px]">
                                    {doc.originalName}
                                  </p>
                                  <p className="text-xs text-gray-500 capitalize">
                                    {doc.type.replace('_', ' ')}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Badge 
                                  variant="outline" 
                                  className={`${statusConfig.bgColor} ${statusConfig.color} text-xs`}
                                >
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                              <span>{formatFileSize(doc.size)}</span>
                              <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDocument(doc)}
                                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadDocument(doc)}
                                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                            
                            {doc.status === 'rejected' && doc.rejectionReason && (
                              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                <div className="font-medium">Rejection Reason:</div>
                                {doc.rejectionReason}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDocument.originalName}
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ZoomIn className="w-4 h-4 rotate-180" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetZoom}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDocument(null)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-auto">
              <div 
                className="flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              >
                {selectedDocument.mimeType.startsWith('image/') ? (
                  <img 
                    src={selectedDocument.url} 
                    alt={selectedDocument.originalName}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                ) : selectedDocument.mimeType === 'application/pdf' ? (
                  <iframe 
                    src={selectedDocument.url} 
                    className="w-full h-[70vh] border"
                    title={selectedDocument.originalName}
                  />
                ) : (
                  <div className="text-center p-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">This document type cannot be previewed in the browser.</p>
                    <p className="text-sm text-gray-500 mt-2">Please download to view.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Type: {selectedDocument.type.replace('_', ' ')}</span>
                <span>Size: {formatFileSize(selectedDocument.size)}</span>
                <span>Status: 
                  <Badge 
                    variant="outline" 
                    className={`ml-1 capitalize ${getStatusConfig(selectedDocument.status).bgColor} ${getStatusConfig(selectedDocument.status).color}`}
                  >
                    {getStatusConfig(selectedDocument.status).label}
                  </Badge>
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleApproveDocument(selectedDocument.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectDocument(selectedDocument.id)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}