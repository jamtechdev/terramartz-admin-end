"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { logsService } from "@/app/services/logs.service";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import {
  FiRefreshCw,
  FiX,
  FiEye,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import type { Log } from "@/app/types/logs.types";

export default function LogsPage() {
  const { token, hasPermission } = useAuth();

  // State
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [advancedMode, setAdvancedMode] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [limit] = useState(50);

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [actionTypeFilter, setActionTypeFilter] = useState<string>(""); // Changed from methodFilter
  const [resultFilter, setResultFilter] = useState<string>(""); // Changed from statusFilter
  const [adminEmailFilter, setAdminEmailFilter] = useState<string>("");

  // Detail modal
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Check permissions
  useEffect(() => {
    if (!hasPermission("Dashboard", "View")) {
      toast.error("You don't have permission to view logs");
    }
  }, [hasPermission]);

  // Fetch available dates on mount
  useEffect(() => {
    if (token) {
      fetchAvailableDates();
    }
  }, [token]);

  // Fetch logs when filters change
  useEffect(() => {
    if (token) {
      fetchLogs();
    }
  }, [
    token,
    currentPage,
    selectedDate,
    startDate,
    endDate,
    actionTypeFilter,
    resultFilter,
    adminEmailFilter,
  ]);

  const fetchAvailableDates = async () => {
    if (!token) return;

    const result = await logsService.getAvailableLogDates(token);

    if (result.success) {
      setAvailableDates(result.data.dates);
    } else {
      toast.error("Failed to fetch available dates");
    }
  };

  const fetchLogs = async () => {
    if (!token) return;

    setLoading(true);

    try {
      let result;

      const params = {
        page: currentPage,
        limit,
        method: actionTypeFilter || undefined,
        status: resultFilter || undefined,
        adminEmail: adminEmailFilter || undefined,
      };

      if (selectedDate) {
        result = await logsService.getLogsByDate(token, selectedDate, params);
      } else {
        result = await logsService.getAllLogs(token, {
          ...params,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
      }

      if (result.success) {
        setLogs(result.data.logs);
        setTotalLogs(result.data.total);
        setTotalPages(Math.ceil(result.data.total / limit));
      } else {
        toast.error(result.message || "Failed to fetch logs");
        setLogs([]);
      }
    } catch (error) {
      toast.error("An error occurred while fetching logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAvailableDates();
    await fetchLogs();
    setRefreshing(false);
    toast.success("Logs refreshed");
  };

  const handleClearFilters = () => {
    setSelectedDate("");
    setStartDate("");
    setEndDate("");
    setActionTypeFilter("");
    setResultFilter("");
    setAdminEmailFilter("");
    setCurrentPage(1);
  };

  const handleViewDetails = (log: Log) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  // Helper function to get user-friendly action type
  const getActionTypeFriendly = (method?: string) => {
    const types: Record<string, string> = {
      GET: "View/Read",
      POST: "Create/Add",
      PUT: "Update",
      PATCH: "Edit",
      DELETE: "Delete/Remove",
    };
    return types[method?.toUpperCase() || ""] || method || "Unknown";
  };

  // Helper function to get user-friendly result
  const getResultFriendly = (status?: number) => {
    if (!status) return "Unknown";
    if (status >= 200 && status < 300) return "Success";
    if (status === 401 || status === 403) return "Access Denied";
    if (status === 404) return "Not Found";
    if (status >= 400 && status < 500) return "Failed";
    if (status >= 500) return "Error";
    return `Code ${status}`;
  };

  // Get icon for result
  const getResultIcon = (status?: number) => {
    if (!status) return <FiInfo className="inline h-4 w-4" />;
    if (status >= 200 && status < 300)
      return <FiCheckCircle className="inline h-4 w-4" />;
    if (status >= 400) return <FiXCircle className="inline h-4 w-4" />;
    return <FiAlertCircle className="inline h-4 w-4" />;
  };

  const getStatusBadgeColor = (status?: number) => {
    if (!status) return "bg-gray-100 text-gray-800";
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800";
    if (status >= 400 && status < 500) return "bg-orange-100 text-orange-800";
    if (status >= 500) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getMethodBadgeColor = (method?: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-100 text-blue-800",
      POST: "bg-green-100 text-green-800",
      PUT: "bg-yellow-100 text-yellow-800",
      PATCH: "bg-orange-100 text-orange-800",
      DELETE: "bg-red-100 text-red-800",
    };
    return colors[method?.toUpperCase() || ""] || "bg-gray-100 text-gray-800";
  };

  const getLevelBadgeColor = (level?: string) => {
    const colors: Record<string, string> = {
      info: "bg-blue-100 text-blue-800",
      warn: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      debug: "bg-gray-100 text-gray-800",
    };
    return colors[level?.toLowerCase() || ""] || "bg-gray-100 text-gray-800";
  };

  // Get user-friendly activity description
  const getActivityDescription = (log: Log) => {
    const action = getActionTypeFriendly(log.method);
    const path = log.url || log.path || "";

    // Try to extract meaningful info from path
    if (path.includes("/users")) return `${action} user data`;
    if (path.includes("/products")) return `${action} product data`;
    if (path.includes("/categories")) return `${action} category data`;
    if (path.includes("/staffs")) return `${action} staff data`;
    if (path.includes("/blogs")) return `${action} blog data`;
    if (path.includes("/kyc")) return `${action} KYC data`;
    if (path.includes("/transactions")) return `${action} transaction data`;
    if (path.includes("/tickets")) return `${action} ticket data`;
    if (path.includes("/settings")) return `${action} settings`;
    if (path.includes("/dashboard")) return `${action} dashboard`;
    if (path.includes("/login")) return "Login attempt";
    if (path.includes("/logout")) return "Logout";

    return `${action} operation`;
  };

  // Format date to be more readable
  const formatDateTime = (timestamp?: string) => {
    if (!timestamp) return "Unknown time";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader title="Activity Logs" />
        <button
          onClick={() => setAdvancedMode(!advancedMode)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {advancedMode ? "Simple View" : "Advanced View"}
        </button>
      </div>

      {/* Info Banner */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FiInfo className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              What are Activity Logs?
            </h4>
            <p className="text-sm text-blue-800">
              Activity logs show all actions performed by administrators in the system. 
              This helps track who did what and when, ensuring accountability and security.
            </p>
          </div>
        </div>
      </div> */}

      {/* Filters Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Logs
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Narrow down the logs to find specific activities
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClearFilters}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiX className="h-4 w-4" />
                Clear All
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiRefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Specific Date
                <span className="text-gray-400 font-normal ml-1">
                  (Optional)
                </span>
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
              >
                <option value="">All available dates</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
                <span className="text-gray-400 font-normal ml-1">
                  (Optional)
                </span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={!!selectedDate}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
                <span className="text-gray-400 font-normal ml-1">
                  (Optional)
                </span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={!!selectedDate}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Other Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Type
                <span className="text-gray-400 font-normal ml-1">
                  (What was done)
                </span>
              </label>
              <select
                value={actionTypeFilter}
                onChange={(e) => setActionTypeFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
              >
                <option value="">All actions</option>
                <option value="GET">View/Read data</option>
                <option value="POST">Create/Add new items</option>
                <option value="PUT">Update existing items</option>
                <option value="PATCH">Edit items</option>
                <option value="DELETE">Delete/Remove items</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Result
                <span className="text-gray-400 font-normal ml-1">
                  (Success or failed)
                </span>
              </label>
              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
              >
                <option value="">All results</option>
                <option value="200">✓ Success</option>
                <option value="401">✗ Access Denied</option>
                <option value="404">✗ Not Found</option>
                <option value="500">✗ Error</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
                <span className="text-gray-400 font-normal ml-1">
                  (Who did it)
                </span>
              </label>
              <input
                type="text"
                placeholder="Search by admin email"
                value={adminEmailFilter}
                onChange={(e) => setAdminEmailFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Activity Records
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Showing {logs.length} of {totalLogs} total activities
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-700 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-500">Loading activity logs...</p>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <FiInfo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No activities found
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto">
                  <div className="min-w-[800px]">
                <table className="w-full text-sm rounded-xl border border-gray-200 bg-white shadow-sm">
                  <thead>
                    <tr className="bg-green-700 text-white">
                      <th className="px-6 py-4 text-left font-semibold">
                        When
                      </th>
                      {!advancedMode && (
                        <th className="px-6 py-4 text-left font-semibold">
                          Activity
                        </th>
                      )}
                      {advancedMode && (
                        <>
                          <th className="px-6 py-4 text-left font-semibold">
                            Level
                          </th>
                          <th className="px-6 py-4 text-left font-semibold">
                            Method
                          </th>
                        </>
                      )}
                      <th className="px-6 py-4 text-left font-semibold">
                        Result
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        URL Path
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Admin
                      </th>
                      {advancedMode && (
                        <th className="px-6 py-4 text-left font-semibold">
                          Response Time
                        </th>
                      )}
                      <th className="px-6 py-4 text-left font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {logs.map((log, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatDateTime(log.timestamp || log.time)}
                        </td>
                        {!advancedMode && (
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {getActivityDescription(log)}
                          </td>
                        )}
                        {advancedMode && (
                          <>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(log.level)}`}
                              >
                                {log.level}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {log.method ? (
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded ${getMethodBadgeColor(log.method)}`}
                                >
                                  {log.method}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getResultIcon(log.status)}
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(log.status)}`}
                            >
                              {getResultFriendly(log.status)}
                              {advancedMode && log.status && ` (${log.status})`}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-700 max-w-xs"
                          title={log.url || log.path || "-"}
                        >
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {log.url || log.path || "-"}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {log.adminEmail || log.adminName || "System"}
                        </td>
                        {advancedMode && (
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {log.responseTime || log.durationMs
                              ? `${log.responseTime || log.durationMs}ms`
                              : "-"}
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetails(log)}
                            className="flex items-center gap-1 text-green-700 hover:text-green-800 transition-colors font-medium text-sm"
                            title="View full details"
                          >
                            <FiEye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1 || loading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages || loading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Activity Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Complete information about this activity
                  </p>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Summary
                </h4>
                <p className="text-sm text-blue-800">
                  <strong>{selectedLog.adminEmail || "System"}</strong>{" "}
                  performed a{" "}
                  <strong>{getActivityDescription(selectedLog)}</strong> action
                  which{" "}
                  <strong>
                    {getResultFriendly(selectedLog.status).toLowerCase()}
                  </strong>
                  .
                </p>
              </div>

              {/* Key Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Key Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      When
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {formatDateTime(
                        selectedLog.timestamp || selectedLog.time,
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Result
                    </p>
                    <div className="flex items-center gap-2">
                      {getResultIcon(selectedLog.status)}
                      <span className="text-sm text-gray-900 font-medium">
                        {getResultFriendly(selectedLog.status)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Action Type
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {getActionTypeFriendly(selectedLog.method)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Performed By
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {selectedLog.adminEmail ||
                        selectedLog.adminName ||
                        "System"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Description */}
              {(selectedLog.url || selectedLog.path) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    What Happened
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">
                      {getActivityDescription(selectedLog)}
                    </p>
                    <p className="text-xs text-gray-600 mt-2 font-mono">
                      {selectedLog.url || selectedLog.path}
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Details (Advanced) */}
              {advancedMode && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Technical Details
                  </h4>
                  <div className="space-y-3">
                    {(selectedLog.url || selectedLog.path) && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          API Path / URL
                        </p>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg break-all text-gray-900 font-mono">
                          {selectedLog.url || selectedLog.path}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {selectedLog.method && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            HTTP Method
                          </p>
                          <p className="text-sm text-gray-900">
                            {selectedLog.method}
                          </p>
                        </div>
                      )}

                      {selectedLog.status && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Status Code
                          </p>
                          <p className="text-sm text-gray-900">
                            {selectedLog.status}
                          </p>
                        </div>
                      )}

                      {selectedLog.ip && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            IP Address
                          </p>
                          <p className="text-sm text-gray-900 font-mono">
                            {selectedLog.ip}
                          </p>
                        </div>
                      )}

                      {(selectedLog.responseTime || selectedLog.durationMs) && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Response Time
                          </p>
                          <p className="text-sm text-gray-900">
                            {selectedLog.responseTime || selectedLog.durationMs}
                            ms
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedLog.message && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Message
                        </p>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg text-gray-900">
                          {selectedLog.message}
                        </p>
                      </div>
                    )}

                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                        View Raw JSON Data
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                        {JSON.stringify(selectedLog, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200 flex justify-end gap-3">
              {!advancedMode && (
                <button
                  onClick={() => setAdvancedMode(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Show Technical Details
                </button>
              )}
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
