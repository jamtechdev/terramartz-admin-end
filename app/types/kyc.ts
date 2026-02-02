// KYC Type Definitions

export type KYCStatus = 
  | 'not_started'
  | 'pending'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected';

export type DocumentType = 
  | 'passport'
  | 'driver_license'
  | 'business_license'
  | 'tax_id'
  | 'bank_statement'
  | 'utility_bill'
  | 'other';

export type DocumentStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_review';

export interface KYCDocument {
  id: string;
  type: DocumentType;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  status: DocumentStatus;
  uploadedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface KYCVerificationStep {
  id: string;
  name: string;
  description: string;
  status: KYCStatus;
  completedAt?: string;
  documents: KYCDocument[];
}

export interface KYCApplication {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  businessName?: string;
  status: KYCStatus;
  submittedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  verificationSteps: KYCVerificationStep[];
  totalDocuments: number;
  approvedDocuments: number;
  createdAt: string;
  updatedAt: string;
}

export interface KYCStats {
  totalApplications: number;
  pendingApplications: number;
  submittedApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  completionRate: number;
  averageReviewTime: number; // in hours
  recentActivity: {
    date: string;
    applications: number;
    approvals: number;
    rejections: number;
  }[];
}

export interface KYCReviewPayload {
  status: 'approved' | 'rejected';
  verificationSteps?: {
    identityVerified: boolean;
    businessVerified: boolean;
    financialVerified: boolean;
    addressVerified: boolean;
  };
  rejectionReason?: string;
}

export interface KYCFilterOptions {
  status?: KYCStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'submittedAt' | 'reviewedAt' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface KYCResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

export interface SellerKYCStatus {
  status: KYCStatus;
  applicationId?: string;
  verificationSteps: KYCVerificationStep[];
  nextStep?: string;
  progress: number; // 0-100
  canSubmit: boolean;
  lastUpdated: string;
}