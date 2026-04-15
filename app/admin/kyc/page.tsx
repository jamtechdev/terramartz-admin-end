'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import {
  getAdminKYCStats,
  getAdminKYCApplications,
  getAdminKYCApplication,
  reviewKYCApplication
} from '@/app/actions/kyc.action';
import { KYCReviewPayload, KYCStatus } from '@/app/types/kyc';
import {
  setStats,
  setApplications,
  setAdminError,
  setSelectedApplication,
  updateApplication
} from '@/app/store/slices/kyc.slice';
import { Button } from '@/app/components/ui/button';
import StatsCard from '@/app/components/dashboard/StatsCard';
import {
  RefreshCw,
  XCircle,
  FileText,
  User,
  Calendar,
  File,
  Check,
  X,
  AlertTriangle,
  Search,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Circle,
  Building2,
  Mail,
  Clock,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { FaUserCheck, FaUserClock, FaUserTimes, FaFileAlt } from 'react-icons/fa';
import { getReadableAccessError } from '@/app/utils/accessError';

// Transform backend application data to frontend KYCApplication format
function transformBackendApplication(backendApp: any): any {
  const seller = backendApp.sellerId;
  const sellerIsPopulated =
    seller != null && typeof seller === 'object' && seller._id != null;
  const sellerIdStr = sellerIsPopulated
    ? String(seller._id)
    : typeof seller === 'string'
      ? seller
      : '';

  return {
    id: backendApp._id,
    sellerId: sellerIdStr,
    sellerName: sellerIsPopulated
      ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 'Unknown seller'
      : 'Unknown seller (missing user)',
    sellerEmail: sellerIsPopulated ? seller.email || '—' : '—',
    businessName: sellerIsPopulated
      ? seller.businessDetails?.businessName || 'N/A'
      : 'N/A',
    status: backendApp.status,
    submittedAt: backendApp.submittedAt,
    createdAt: backendApp.createdAt,
    updatedAt: backendApp.updatedAt,
    totalDocuments: backendApp.documents?.length || 0,
    approvedDocuments: backendApp.documents?.filter((doc: any) => doc.verified).length || 0,
    documents: backendApp.documents || [],
    approvedAt: backendApp.approvedAt,
    rejectedAt: backendApp.rejectedAt,
    rejectionReason: backendApp.rejectionReason,
    reviewedByLabel:
      backendApp.reviewedBy != null && typeof backendApp.reviewedBy === 'object'
        ? `${backendApp.reviewedBy.firstName || ''} ${backendApp.reviewedBy.lastName || ''}`.trim() ||
          backendApp.reviewedBy.email ||
          null
        : null,
    verificationSteps: {
      identityVerified: backendApp.verificationSteps?.identityVerified || false,
      businessVerified: backendApp.verificationSteps?.businessVerified || false,
      addressVerified: backendApp.verificationSteps?.addressVerified || false,
      financialVerified: backendApp.verificationSteps?.financialVerified || false
    }
  };
}

function formatKycStatusLabel(status: string) {
  return status?.replace(/_/g, ' ') || '—';
}

function kycStatusBadgeClass(status: string) {
  const s = status?.toLowerCase() || '';
  const map: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
    rejected: 'bg-rose-50 text-rose-800 ring-rose-600/20',
    submitted: 'bg-amber-50 text-amber-900 ring-amber-600/25',
    under_review: 'bg-sky-50 text-sky-800 ring-sky-600/20',
    pending: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  };
  return map[s] || 'bg-slate-100 text-slate-700 ring-slate-500/20';
}

function formatDateTime(value: string | Date | undefined | null) {
  if (value == null) return null;
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return null;
  }
}

function documentLooksLikeImage(fileName: string) {
  return /\.(png|jpe?g|gif|webp|bmp)$/i.test(fileName || '');
}

function docVerificationBadgeClass(verified: boolean) {
  return verified
    ? 'bg-emerald-50 text-emerald-800 ring-emerald-600/20'
    : 'bg-amber-50 text-amber-900 ring-amber-600/25';
}

export default function AdminKYCPage() {
  const dispatch = useDispatch();

  const {
    stats,
    applications,
    adminError,
    totalApplications,
  } = useSelector((state: RootState) => state.kyc);

  const searchParams = useSearchParams();
  const kycId = searchParams.get('id');

  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionReasonError, setRejectionReasonError] = useState('');

  const [listPage, setListPage] = useState(1);
  const [listLimit, setListLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<KYCStatus | ''>('');
  const [searchInput, setSearchInput] = useState('');
  const [listLoading, setListLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (searchInput.trim()) n++;
    if (statusFilter) n++;
    if (listLimit !== 10) n++;
    return n;
  }, [searchInput, statusFilter, listLimit]);

  const loadStats = useCallback(async () => {
    const statsResponse = await getAdminKYCStats();
    if (statsResponse.status === 'success' && statsResponse.data) {
      dispatch(setStats(statsResponse.data));
    }
  }, [dispatch]);

  const loadApplications = useCallback(async () => {
    setListLoading(true);
    dispatch(setAdminError(null));
    try {
      const payload: {
        page: number;
        limit: number;
        status?: KYCStatus;
        search?: string;
      } = {
        page: listPage,
        limit: listLimit,
      };
      if (statusFilter) payload.status = statusFilter;
      const q = searchInput.trim();
      if (q) payload.search = q;

      const appsResponse = await getAdminKYCApplications(payload);

      if (appsResponse.status === 'success' && appsResponse.data) {
        const transformedApps = appsResponse.data.applications.map(transformBackendApplication);
        dispatch(
          setApplications({
            applications: transformedApps,
            total: appsResponse.data.total,
            page: appsResponse.data.page,
            limit: appsResponse.data.limit,
          }),
        );
      } else {
        dispatch(setAdminError(appsResponse.error || 'Failed to load applications'));
      }
    } catch (err: any) {
      dispatch(setAdminError(err.message || 'Failed to load applications'));
    } finally {
      setListLoading(false);
    }
  }, [dispatch, listPage, listLimit, statusFilter, searchInput]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadStats();
      await loadApplications();
      toast.success('Data refreshed successfully');
    } catch (err: any) {
      toast.error(getReadableAccessError(err, 'Failed to refresh data'));
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter((value || '') as KYCStatus | '');
    setListPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setListPage(1);
  };

  const handleLimitChange = (value: number) => {
    setListLimit(value);
    setListPage(1);
  };

  const handleResetListFilters = () => {
    setSearchInput('');
    setStatusFilter('');
    setListLimit(10);
    setListPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalApplications / listLimit));

  const handleViewDetails = async (applicationId: string) => {
    try {
      const response = await getAdminKYCApplication(applicationId);
      if (response.status === 'success' && response.data) {
        const transformedApp = transformBackendApplication(response.data);
        setSelectedApp(transformedApp);
        setViewMode('detail');
        dispatch(setSelectedApplication(transformedApp));
      } else {
        toast.error(getReadableAccessError(response.error, 'Failed to load application details'));
      }
    } catch (err: any) {
      toast.error(getReadableAccessError(err, 'Failed to load application details'));
    }
  };

  // Handle direct navigation to details via query param
  useEffect(() => {
    if (kycId) {
      handleViewDetails(kycId);
    }
  }, [kycId]);

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
        toast.error(getReadableAccessError(response.error, 'Failed to approve application'));
      }
    } catch (err: any) {
      toast.error(getReadableAccessError(err, 'Failed to approve application'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    if (!selectedApp) return;
    setRejectionReason('');
    setRejectionReasonError('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedApp) return;
    const reason = rejectionReason.trim();
    if (!reason) {
      setRejectionReasonError('Rejection reason is required');
      return;
    }
    if (reason.length < 8) {
      setRejectionReasonError('Please provide at least 8 characters');
      return;
    }
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
        setShowRejectModal(false);
        setRejectionReason('');
        setRejectionReasonError('');
        toast.success('Application rejected successfully');
      } else {
        toast.error(getReadableAccessError(response.error, 'Failed to reject application'));
      }
    } catch (err: any) {
      toast.error(getReadableAccessError(err, 'Failed to reject application'));
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
    const canReview = ['submitted', 'under_review'].includes(selectedApp.status);
    const submittedLabel = formatDateTime(selectedApp.submittedAt);
    const updatedLabel = formatDateTime(selectedApp.updatedAt);
    const approvedLabel = formatDateTime(selectedApp.approvedAt);
    const rejectedLabel = formatDateTime(selectedApp.rejectedAt);

    const verificationRows = [
      { label: 'Identity verification', done: !!selectedApp.verificationSteps?.identityVerified },
      { label: 'Business verification', done: !!selectedApp.verificationSteps?.businessVerified },
      { label: 'Address verification', done: !!selectedApp.verificationSteps?.addressVerified },
      { label: 'Financial verification', done: !!selectedApp.verificationSteps?.financialVerified },
    ];

    return (
      <div className="px-4 sm:px-6 lg:px-8 pb-12 max-w-6xl mx-auto space-y-6">
        <button
          type="button"
          onClick={handleBackToList}
          className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to applications
        </button>

        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
          <div className="px-5 sm:px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/40 via-white to-slate-50/60">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Seller verification
            </p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
                  {selectedApp.sellerName}
                </h1>
                <p className="text-sm text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden />
                  <span className="truncate">{selectedApp.sellerEmail}</span>
                </p>
                <p className="text-xs font-mono text-slate-400 mt-3 break-all max-w-full">
                  Application ID · {selectedApp.id}
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ring-1 ring-inset ${kycStatusBadgeClass(selectedApp.status)}`}
                >
                  {formatKycStatusLabel(selectedApp.status)}
                </span>
                {updatedLabel && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" aria-hidden />
                    Last updated {updatedLabel}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x divide-slate-100">
            <div className="lg:col-span-2 p-5 sm:p-8 space-y-10">
              <section>
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-emerald-600" />
                  Seller &amp; business
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Business</dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900 flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" aria-hidden />
                      {selectedApp.businessName || '—'}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Documents on file</dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">
                      {selectedApp.totalDocuments} files ·{' '}
                      <span className="text-emerald-700">{selectedApp.approvedDocuments} verified</span>
                    </dd>
                  </div>
                </dl>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Timeline
                </h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3 bg-white">
                    <span className="text-slate-500">Submitted</span>
                    <span className="font-medium text-slate-900 text-right">
                      {submittedLabel || 'Not submitted'}
                    </span>
                  </li>
                  {selectedApp.status === 'approved' && approvedLabel && (
                    <li className="flex justify-between gap-4 rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3">
                      <span className="text-emerald-800">Approved</span>
                      <span className="font-medium text-emerald-900 text-right">{approvedLabel}</span>
                    </li>
                  )}
                  {selectedApp.status === 'rejected' && rejectedLabel && (
                    <li className="flex justify-between gap-4 rounded-xl border border-rose-100 bg-rose-50/40 px-4 py-3">
                      <span className="text-rose-800">Rejected</span>
                      <span className="font-medium text-rose-900 text-right">{rejectedLabel}</span>
                    </li>
                  )}
                  {selectedApp.reviewedByLabel && (
                    <li className="flex justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3 bg-slate-50/30">
                      <span className="text-slate-500">Reviewed by</span>
                      <span className="font-medium text-slate-900 text-right">{selectedApp.reviewedByLabel}</span>
                    </li>
                  )}
                </ul>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Verification checklist
                </h2>
                <ul className="rounded-xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden bg-white">
                  {verificationRows.map((row) => (
                    <li key={row.label} className="flex items-center gap-3 px-4 py-3.5">
                      {row.done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0" aria-hidden />
                      )}
                      <span className="text-sm font-medium text-slate-800 flex-1">{row.label}</span>
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ring-1 ring-inset shrink-0 ${
                          row.done
                            ? 'text-emerald-800 bg-emerald-50 ring-emerald-600/15'
                            : 'text-slate-500 bg-slate-50 ring-slate-200'
                        }`}
                      >
                        {row.done ? 'Complete' : 'Incomplete'}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <File className="w-4 h-4 text-emerald-600" />
                  Submitted documents
                </h2>
                {selectedApp.documents?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedApp.documents.map((doc: any) => {
                      const isImg = documentLooksLikeImage(doc.fileName);
                      const key = doc._id || doc.documentUrl || doc.fileName;
                      return (
                        <div
                          key={key}
                          className="group flex gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/30 p-4 hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all"
                        >
                          <div className="w-20 h-20 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                            {isImg && doc.documentUrl ? (
                              <img
                                src={doc.documentUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileText className="w-8 h-8 text-slate-300" aria-hidden />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col">
                            <p className="font-semibold text-sm text-slate-900 truncate" title={doc.fileName}>
                              {doc.fileName}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Type ·{' '}
                              <span className="text-slate-700 font-medium">
                                {String(doc.documentType || '').replace(/_/g, ' ') || '—'}
                              </span>
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ring-1 ring-inset ${docVerificationBadgeClass(!!doc.verified)}`}
                              >
                                {doc.verified ? 'Verified' : 'Pending review'}
                              </span>
                            </div>
                            {doc.verificationNotes ? (
                              <p className="text-xs text-slate-600 mt-2 line-clamp-2" title={doc.verificationNotes}>
                                {doc.verificationNotes}
                              </p>
                            ) : null}
                            <div className="mt-auto pt-3">
                              <button
                                type="button"
                                onClick={() => window.open(doc.documentUrl, '_blank', 'noopener,noreferrer')}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                              >
                                Open document
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center text-sm text-slate-500">
                    No documents uploaded.
                  </div>
                )}
              </section>
            </div>

            <aside className="lg:col-span-1 p-5 sm:p-8 bg-slate-50/50 lg:bg-slate-50/30">
              <div className="lg:sticky lg:top-6 space-y-4">
                <h2 className="text-sm font-semibold text-slate-900">Review</h2>

                {canReview ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Approve only after you have checked identity, business, and supporting files. Rejections should include a clear reason for the seller.
                    </p>
                    <Button
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 h-auto flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Check className="w-5 h-5" />
                      {isProcessing ? 'Processing…' : 'Approve application'}
                    </Button>
                    <Button
                      onClick={handleReject}
                      disabled={isProcessing}
                      variant="outline"
                      className="w-full rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 py-3 h-auto flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Reject application
                    </Button>
                  </div>
                ) : selectedApp.status === 'approved' ? (
                  <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-semibold">Application approved</span>
                    </div>
                    <p className="text-xs text-emerald-900/80 leading-relaxed">
                      This seller passed KYC. No further action is required unless you receive a compliance request.
                    </p>
                    {approvedLabel && (
                      <p className="text-xs text-emerald-800/90">
                        <span className="font-medium">Decided on</span> {approvedLabel}
                      </p>
                    )}
                  </div>
                ) : selectedApp.status === 'rejected' ? (
                  <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-rose-900">
                      <XCircle className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-semibold">Application rejected</span>
                    </div>
                    {selectedApp.rejectionReason ? (
                      <div className="rounded-lg bg-white/80 border border-rose-100 px-3 py-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-600 mb-1">
                          Reason recorded
                        </p>
                        <p className="text-sm text-slate-800 leading-snug">{selectedApp.rejectionReason}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-rose-800/90">No rejection reason was stored for this record.</p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-800">Awaiting seller</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      This application is still <strong>{formatKycStatusLabel(selectedApp.status)}</strong>. Open documents
                      above once the seller submits everything needed for review.
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {showRejectModal && (
          <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  Reject application
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Provide a clear reason. It may be shown to the seller and is kept for audit purposes.
                </p>
              </div>
              <div className="p-5 sm:p-6 space-y-3">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (rejectionReasonError) setRejectionReasonError('');
                  }}
                  rows={4}
                  placeholder="Explain what is missing or incorrect…"
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    rejectionReasonError
                      ? 'border-rose-400 focus:ring-rose-500/30'
                      : 'border-slate-200 focus:ring-emerald-500/25 focus:border-emerald-500'
                  }`}
                />
                {rejectionReasonError && <p className="text-sm text-rose-600">{rejectionReasonError}</p>}
              </div>
              <div className="p-5 sm:p-6 border-t border-slate-100 flex flex-wrap justify-end gap-2 bg-slate-50/50">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    if (!isProcessing) {
                      setShowRejectModal(false);
                      setRejectionReasonError('');
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmReject}
                  disabled={isProcessing}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {isProcessing ? 'Rejecting…' : 'Confirm reject'}
                </Button>
              </div>
            </div>
          </div>
        )}
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
          disabled={refreshing || listLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
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

      {/* Applications list (products-style toolbar + card grid) */}
      <div className="px-0 sm:px-1 pb-12 max-w-[1680px] mx-auto">
        <div className="rounded-2xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-4 sm:px-6 py-5">
            <h2 className="text-xl font-bold text-green-700">All KYC applications</h2>
            <p className="text-sm text-gray-600 mt-1">
              Every status in one place — filter, search, and paginate like the product catalog.
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  aria-hidden
                />
                <input
                  type="search"
                  placeholder="Search seller name, email, or business…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((o) => !o)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                  {filtersOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleResetListFilters}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {filtersOpen && (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 sm:p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4">
                  Refine results
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600 mb-1.5 block">Application status</span>
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                      value={statusFilter}
                      onChange={(e) => handleStatusFilterChange(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="pending">Pending</option>
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600 mb-1.5 block">Per page</span>
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                      value={listLimit}
                      onChange={(e) => handleLimitChange(Number(e.target.value))}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">{applications.length}</span>
                <span className="text-slate-500"> of </span>
                <span className="font-semibold text-slate-900">{totalApplications}</span>
                <span className="text-slate-500"> applications</span>
              </p>
              <p className="text-slate-500">
                Page {listPage} / {totalPages}
              </p>
            </div>

            {listLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Loading applications…</p>
              </div>
            ) : adminError ? (
              <div className="text-center py-16">
                <div className="text-red-500 mb-4">
                  <XCircle className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Could not load applications</h3>
                <p className="text-gray-600 mb-4">{adminError}</p>
                <Button
                  type="button"
                  onClick={() => loadApplications()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Try again
                </Button>
              </div>
            ) : applications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium text-slate-800">No applications match these filters</p>
                <p className="text-sm mt-1">Adjust search or status, or reset filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {applications.map((application: any) => (
                    <article
                      key={application.id}
                      className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md hover:border-slate-300/90"
                    >
                      <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-50 shrink-0 flex items-center justify-center">
                        <FileText className="w-14 h-14 text-slate-300" aria-hidden />
                        <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-lg ring-1 ring-inset shrink-0 ${kycStatusBadgeClass(application.status)}`}
                          >
                            {formatKycStatusLabel(application.status)}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-lg bg-white/95 text-slate-700 ring-1 ring-slate-200/80 shadow-sm">
                            {application.totalDocuments} docs
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 p-4 pt-3">
                        <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">
                          {application.sellerName || 'Unknown seller'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1" title={application.sellerEmail}>
                          {application.sellerEmail}
                        </p>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                          <span className="text-slate-400">Business · </span>
                          {application.businessName || '—'}
                        </p>
                        <p className="text-xs text-slate-400 mt-3">
                          Submitted{' '}
                          {application.submittedAt
                            ? new Date(application.submittedAt).toLocaleDateString()
                            : '—'}
                        </p>
                        <div className="mt-auto pt-4">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(application.id)}
                            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
                          >
                            <Eye className="w-4 h-4" />
                            View details
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {totalApplications > listLimit && (
                  <nav
                    className="flex justify-center items-center gap-2 mt-10"
                    aria-label="Pagination"
                  >
                    <button
                      type="button"
                      onClick={() => setListPage((p) => Math.max(1, p - 1))}
                      disabled={listPage <= 1}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-slate-600 tabular-nums">
                      {listPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
                      disabled={listPage >= totalPages}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}