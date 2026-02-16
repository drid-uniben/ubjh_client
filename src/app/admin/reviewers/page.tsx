"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllReviewers, getReviewerById, checkOverdueReviews } from '@/services/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  User,
  Mail,
  Building,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Loader2,
  Calendar,
  Award,
  BarChart3,
  Bell,
} from 'lucide-react';

interface ReviewerStatistics {
  assigned: number;
  completed: number;
  completionRate: number;
}

interface Reviewer {
  _id: string;
  name: string;
  email: string;
  faculty: string;
  assignedFaculty: string;
  isActive: boolean;
  invitationStatus: 'pending' | 'accepted' | 'added' | 'expired';
  statistics: ReviewerStatistics;
  createdAt: string;
  lastLogin?: string;
}

interface Review {
  _id: string;
  manuscript?: { title: string };
  dueDate: string;
  completedAt: string;
}

interface ReviewerDetails extends Reviewer {
  affiliation: string;
  assignedReviews?: Review[];
  completedReviews?: Review[];
  inProgressReviews?: Review[];
  overdueReviews?: Review[];
  allAssignedReviews?: Review[];
}

export default function ManuscriptReviewersPage() {
  const { isAuthenticated } = useAuth();
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState<ReviewerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetails, setShowDetails] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    count: 0
  });
  const [isCheckingOverdue, setIsCheckingOverdue] = useState(false);
  const [overdueCheckResult, setOverdueCheckResult] = useState<{
    approachingDeadline?: number;
    overdue?: number;
  } | null>(null);
  const [showOverdueAlert, setShowOverdueAlert] = useState(false);

  const loadReviewers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: 1,
        limit: 20,
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };

      const response = await getAllReviewers(params);
      setReviewers(response.data || []);
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        count: response.count || 0
      });
      setError(null);
    } catch (err) {
      console.error('Failed to load reviewers:', err);
      setError('Failed to load reviewers');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (isAuthenticated) {
      loadReviewers();
    }
  }, [isAuthenticated, statusFilter, loadReviewers]);

  const loadReviewerDetails = async (id: string) => {
    try {
      setIsLoadingDetails(true);
      const existingReviewer = reviewers.find(r => r._id === id);
      const response = await getReviewerById(id);

      const mergedData: ReviewerDetails = {
        ...response.data,
        statistics: existingReviewer?.statistics || {
          assigned: 0,
          completed: 0,
          completionRate: 0
        }
      };

      setSelectedReviewer(mergedData);
      setShowDetails(true);
    } catch (err) {
      console.error('Failed to load reviewer details:', err);
      setError('Failed to load reviewer details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCheckOverdueReviews = async () => {
    try {
      setIsCheckingOverdue(true);
      const response = await checkOverdueReviews();
      setOverdueCheckResult(response.message);
      setShowOverdueAlert(true);

      setTimeout(() => {
        setShowOverdueAlert(false);
      }, 5000);
    } catch (err) {
      console.error('Failed to check overdue reviews:', err);
      setError('Failed to check overdue reviews');
    } finally {
      setIsCheckingOverdue(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'added':
        return 'bg-journal-rose text-journal-maroon';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'added':
        return <User className="h-4 w-4" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    if (rate >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredReviewers = reviewers.filter(reviewer => {
    const matchesSearch = (reviewer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reviewer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reviewer.faculty || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || reviewer.invitationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6 min-h-screen bg-gray-50">
        <div className="mx-auto px-4 sm:px-6 md:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reviewer Management</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and monitor reviewer activities</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleCheckOverdueReviews}
                disabled={isCheckingOverdue}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isCheckingOverdue ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Bell className="h-4 w-4 mr-2" />
                )}
                {isCheckingOverdue ? 'Checking...' : 'Check Overdue'}
              </button>

              <div className="bg-white px-3 py-2 rounded-lg shadow-sm border w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-journal-maroon" />
                  <span className="text-sm font-medium text-gray-700">
                    {pagination.count} Reviewers
                  </span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          {showOverdueAlert && overdueCheckResult && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-blue-800">
                    Review Deadline Check Completed
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span><span className="font-semibold">{overdueCheckResult.approachingDeadline || 0}</span> approaching deadline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span><span className="font-semibold">{overdueCheckResult.overdue || 0}</span> overdue reviews</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowOverdueAlert(false)}
                  className="inline-flex text-blue-500 hover:bg-blue-100 focus:outline-none rounded p-1 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex flex-col gap-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or faculty..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-journal-maroon focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-journal-maroon flex-1 sm:flex-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="accepted">Accepted</option>
                  <option value="pending">Pending</option>
                  <option value="added">Added</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviewers List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredReviewers.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reviewers found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                ) : (
                  filteredReviewers.map((reviewer) => (
                    <div
                      key={reviewer._id}
                      onClick={() => loadReviewerDetails(reviewer._id)}
                      className="p-4 sm:p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-journal-rose flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-journal-maroon" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                                {reviewer.name}
                              </h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(reviewer.invitationStatus)}`}>
                                {getStatusIcon(reviewer.invitationStatus)}
                                <span className="hidden sm:inline capitalize">{reviewer.invitationStatus}</span>
                                <span className="sm:hidden capitalize">{reviewer.invitationStatus.substring(0, 3)}</span>
                              </span>
                            </div>
                            <div className="mt-1 flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500">
                              <div className="flex items-center gap-1 truncate">
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="truncate">{reviewer.email}</span>
                              </div>
                              <div className="hidden lg:flex items-center gap-1 truncate">
                                <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="truncate">{reviewer.faculty}</span>
                              </div>
                              <div className="flex items-center gap-1 truncate">
                                <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="truncate">{reviewer.assignedFaculty}</span>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-4 text-xs sm:text-sm">
                              <div className="flex items-center text-blue-600">
                                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                <span className="font-medium">{reviewer.statistics.assigned}</span>
                                <span className="ml-0.5 hidden sm:inline">Assigned</span>
                              </div>
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                <span className="font-medium">{reviewer.statistics.completed}</span>
                                <span className="ml-0.5 hidden sm:inline">Completed</span>
                              </div>
                              <div className={`flex items-center ${getCompletionRateColor(reviewer.statistics.completionRate)}`}>
                                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                <span className="font-medium">{reviewer.statistics.completionRate}%</span>
                              </div>
                              <div className="hidden items-center text-gray-500 sm:flex">
                                                                                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                                                                              <span>Joined {new Date(reviewer.createdAt).toLocaleDateString()}</span>
                                                                                          </div>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 hidden sm:block" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviewer Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative mx-auto w-full max-w-4xl bg-white shadow-lg rounded-lg mt-8">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b bg-white rounded-t-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Reviewer Details
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                onClick={() => setShowDetails(false)}
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            {isLoadingDetails ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
              </div>
            ) : selectedReviewer ? (
              <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                {/* Reviewer Info */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-journal-rose flex items-center justify-center">
                        <User className="h-8 w-8 sm:h-10 sm:w-10 text-journal-maroon" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                          {selectedReviewer.name}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${getStatusColor(selectedReviewer.invitationStatus)}`}>
                          {getStatusIcon(selectedReviewer.invitationStatus)}
                          <span className="capitalize">{selectedReviewer.invitationStatus}</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-gray-600 min-w-0">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{selectedReviewer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 min-w-0">
                          <Building className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{selectedReviewer.faculty}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Joined {new Date(selectedReviewer.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                        <FileText className="h-6 w-6 text-blue-800" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Assigned Reviews</p>
                        <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                          {selectedReviewer.statistics.assigned}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                        <CheckCircle className="h-6 w-6 text-green-800" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Completed</p>
                        <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                          {selectedReviewer.statistics.completed}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 bg-journal-rose rounded-md p-2">
                        <Award className="h-6 w-6 text-journal-maroon" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Completion Rate</p>
                        <p className={`text-xl sm:text-2xl font-semibold ${getCompletionRateColor(selectedReviewer.statistics.completionRate)}`}>
                          {selectedReviewer.statistics.completionRate}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Breakdown */}
                {selectedReviewer.allAssignedReviews && selectedReviewer.allAssignedReviews.length > 0 && (
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Review Breakdown</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-900">In Progress</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedReviewer.inProgressReviews?.length || 0}
                        </p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-900">Completed</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          {selectedReviewer.completedReviews?.length || 0}
                        </p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-900">Overdue</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600">
                          {selectedReviewer.overdueReviews?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* In Progress Reviews */}
                {selectedReviewer.inProgressReviews && selectedReviewer.inProgressReviews.length > 0 && (
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3">In Progress Reviews</h4>
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="divide-y">
                        {selectedReviewer.inProgressReviews.map((review: Review) => (
                          <div key={review._id} className="p-3 sm:p-4 hover:bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                  {review.manuscript?.title || 'Untitled Manuscript'}
                                </h5>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                  Due: {new Date(review.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0 w-fit">
                                <Clock className="h-3 w-3" />
                                In Progress
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed Reviews */}
                {selectedReviewer.completedReviews && selectedReviewer.completedReviews.length > 0 && (
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3">Completed Reviews</h4>
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="divide-y">
                        {selectedReviewer.completedReviews.map((review: Review) => (
                          <div key={review._id} className="p-3 sm:p-4 hover:bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                  {review.manuscript?.title || 'Untitled Manuscript'}
                                </h5>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                  Completed: {new Date(review.completedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0 w-fit">
                                <CheckCircle className="h-3 w-3" />
                                Done
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Overdue Reviews */}
                {selectedReviewer.overdueReviews && selectedReviewer.overdueReviews.length > 0 && (
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3">Overdue Reviews</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                      <div className="divide-y divide-red-200">
                        {selectedReviewer.overdueReviews.map((review: Review) => (
                          <div key={review._id} className="p-3 sm:p-4 hover:bg-red-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                  {review.manuscript?.title || 'Untitled Manuscript'}
                                </h5>
                                <p className="text-xs sm:text-sm text-red-700 mt-1">
                                  Was due: {new Date(review.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800 flex-shrink-0 w-fit">
                                <AlertCircle className="h-3 w-3" />
                                Overdue
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}