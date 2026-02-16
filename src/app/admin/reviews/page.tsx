"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Eye,  
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  RefreshCw,
  Loader2,
  FileText,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { manuscriptReviewApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface ManuscriptReview {
  _id: string;
  title: string;
  status: string;
  totalReviews: number;
  completedReviews: number;
  hasDiscrepancy: boolean;
  createdAt: string;
  updatedAt: string;
  submitter: {
    name: string;
    email: string;
  };
}

interface ReviewStatistics {
  totalWithReviews: number;
  underReview: number;
  reviewed: number;
  inReconciliation: number;
  withDiscrepancy: number;
  completionRate: number;
}

interface ManuscriptReviewParams {
  page: number;
  limit: number;
  status?: string;
  discrepancy?: string;
}

export default function ManuscriptReviewsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [manuscripts, setManuscripts] = useState<ManuscriptReview[]>([]);
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [discrepancyFilter, setDiscrepancyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDiscrepancyOnly, setShowDiscrepancyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'progress'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const limit = 10;

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load statistics
      const statsResponse = await manuscriptReviewApi.getStatistics();
      setStatistics(statsResponse.data);

      // Build params
      const params: ManuscriptReviewParams = {
        page: currentPage,
        limit,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (discrepancyFilter !== 'all') {
        params.discrepancy = discrepancyFilter;
      }

      if (showDiscrepancyOnly) {
        params.discrepancy = 'true';
      }

      // Load manuscripts
      const response = await manuscriptReviewApi.getAllReviews(params);

      let manuscripts = response.data;

      // Client-side search
      if (searchQuery) {
        manuscripts = manuscripts.filter(m =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.submitter.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Client-side sorting
      manuscripts.sort((a, b) => {
        let compareValue = 0;
        
        switch (sortBy) {
          case 'title':
            compareValue = a.title.localeCompare(b.title);
            break;
          case 'progress':
            const progressA = a.totalReviews > 0 ? a.completedReviews / a.totalReviews : 0;
            const progressB = b.totalReviews > 0 ? b.completedReviews / b.totalReviews : 0;
            compareValue = progressA - progressB;
            break;
          case 'date':
          default:
            compareValue = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }

        return sortOrder === 'asc' ? compareValue : -compareValue;
      });

      setManuscripts(manuscripts);
      setTotalPages(response.pagination.pages);
      setTotalCount(response.pagination.total);

    } catch (err) {
      console.error('Failed to load manuscript reviews:', err);
      setError('Failed to load manuscript reviews');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, discrepancyFilter, showDiscrepancyOnly, statusFilter, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, currentPage, statusFilter, discrepancyFilter, showDiscrepancyOnly, searchQuery, sortBy, sortOrder, loadData]);

  const handleViewDetails = (manuscriptId: string) => {
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(manuscriptId);
    if (!isValidObjectId) {
      console.error("Invalid manuscript ID format:", manuscriptId);
      // Optionally, show an error message to the user here.
      return;
    }
    router.push(`/admin/reviews/${manuscriptId}`);
  };

  const getStatusBadge = (status: string, hasDiscrepancy: boolean) => {
    const baseClasses = "inline-flex items-center gap-1 text-xs font-medium";
    
    if (hasDiscrepancy) {
      return (
        <div className={`${baseClasses} bg-orange-100 text-orange-800 px-2.5 py-1.5 rounded-full`}>
          <AlertTriangle size={14} />
          <span className="hidden sm:inline">Discrepancy</span>
          <span className="sm:hidden">Flag</span>
        </div>
      );
    }

    switch (status) {
      case 'under_review':
        return (
          <div className={`${baseClasses} bg-blue-100 text-blue-800 px-2.5 py-1.5 rounded-full`}>
            <Clock size={14} />
            <span className="hidden sm:inline">Under Review</span>
            <span className="sm:hidden">Review</span>
          </div>
        );
      case 'reviewed':
        return (
          <div className={`${baseClasses} bg-green-100 text-green-800 px-2.5 py-1.5 rounded-full`}>
            <CheckCircle size={14} />
            <span className="hidden sm:inline">Reviewed</span>
            <span className="sm:hidden">Done</span>
          </div>
        );
      case 'in_reconciliation':
        return (
          <div className={`${baseClasses} bg-purple-100 text-purple-800 px-2.5 py-1.5 rounded-full`}>
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Reconciliation</span>
            <span className="sm:hidden">Recon.</span>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} bg-gray-100 text-gray-800 px-2.5 py-1.5 rounded-full`}>
            {status}
          </div>
        );
    }
  };

  const SortButton = ({ column, label }: { column: 'title' | 'date' | 'progress'; label: string }) => (
    <button
      onClick={() => {
        if (sortBy === column) {
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          setSortBy(column);
          setSortOrder('desc');
        }
      }}
      className="inline-flex items-center gap-1 hover:text-journal-maroon transition-colors"
    >
      {label}
      {sortBy === column && (
        sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
      )}
    </button>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {showDiscrepancyOnly ? 'Flagged Manuscripts' : 'Manuscript Reviews'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {showDiscrepancyOnly 
                ? 'Manuscripts flagged for discrepancy requiring reconciliation'
                : 'Monitor and manage manuscript review progress'
              }
            </p>
          </div>
          <Button
            onClick={() => {
              setShowDiscrepancyOnly(!showDiscrepancyOnly);
              setCurrentPage(1);
            }}
            variant={showDiscrepancyOnly ? "default" : "outline"}
            className={`w-full sm:w-auto ${
              showDiscrepancyOnly 
                ? "bg-orange-600 hover:bg-orange-700" 
                : "border-orange-200 text-orange-700 hover:bg-orange-50"
            }`}
          >
            <AlertTriangle size={16} className="mr-2" />
            <span className="hidden sm:inline">
              {showDiscrepancyOnly ? 'Show All Reviews' : 'Show Discrepancies Only'}
            </span>
            <span className="sm:hidden">
              {showDiscrepancyOnly ? 'Show All' : 'Discrepancies'}
            </span>
          </Button>
        </div>

        {/* Statistics Cards */}
        {statistics && !showDiscrepancyOnly && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistics.totalWithReviews}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-journal-maroon flex-shrink-0 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">In Progress</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{statistics.underReview}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Completed</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">{statistics.reviewed}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Recon.</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">{statistics.inReconciliation}</p>
                </div>
                <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0 opacity-50" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Flags</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{statistics.withDiscrepancy}</p>
                </div>
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0 opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search manuscripts or submitters..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-journal-maroon focus:border-transparent"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {!showDiscrepancyOnly && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="in_reconciliation">Reconciliation</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={discrepancyFilter} onValueChange={(v) => { setDiscrepancyFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue placeholder="Discrepancies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Has Discrepancy</SelectItem>
                    <SelectItem value="false">No Discrepancy</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={loadData} 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
            <span className="ml-3 text-gray-600 text-sm sm:text-base">Loading manuscripts...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
            <p>{error}</p>
          </div>
        )}

        {/* Manuscripts Table */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <SortButton column="title" label="Manuscript" />
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Submitter
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <SortButton column="progress" label="Progress" />
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      <SortButton column="date" label="Updated" />
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {manuscripts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900">No manuscripts found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {showDiscrepancyOnly 
                            ? 'No manuscripts with discrepancies found.'
                            : 'No manuscripts match your current filters.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    manuscripts.map((manuscript) => (
                      <tr key={manuscript._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {manuscript.title}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {manuscript.submitter.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {manuscript.submitter.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 w-24">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-xs font-medium text-gray-600">
                                  {manuscript.completedReviews}/{manuscript.totalReviews}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-journal-maroon h-2 rounded-full transition-all"
                                  style={{ 
                                    width: `${manuscript.totalReviews > 0 ? (manuscript.completedReviews / manuscript.totalReviews) * 100 : 0}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          {getStatusBadge(manuscript.status, manuscript.hasDiscrepancy)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                          {new Date(manuscript.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <Button
                            onClick={() => handleViewDetails(manuscript._id)}
                            size="sm"
                            variant="outline"
                            className="border-journal-maroon text-journal-maroon hover:bg-journal-rose"
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="md:hidden divide-y divide-gray-200">
              {manuscripts.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-sm font-medium text-gray-900">No manuscripts found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {showDiscrepancyOnly 
                      ? 'No manuscripts with discrepancies found.'
                      : 'No manuscripts match your current filters.'}
                  </p>
                </div>
              ) : (
                manuscripts.map((manuscript) => (
                  <div key={manuscript._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="space-y-3">
                      {/* Title and Status */}
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {manuscript.title}
                        </h3>
                        <div className="mt-2">
                          {getStatusBadge(manuscript.status, manuscript.hasDiscrepancy)}
                        </div>
                      </div>

                      {/* Submitter */}
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium">{manuscript.submitter.name}</p>
                        <p className="text-gray-500 text-xs truncate">{manuscript.submitter.email}</p>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">Review Progress</span>
                          <span className="text-xs font-semibold text-gray-900">
                            {manuscript.completedReviews}/{manuscript.totalReviews}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-journal-maroon h-2 rounded-full transition-all"
                            style={{ 
                              width: `${manuscript.totalReviews > 0 ? (manuscript.completedReviews / manuscript.totalReviews) * 100 : 0}%` 
                            }}
                          />
                        </div>
                      </div>

                      {/* Updated Date and Action */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-gray-500">
                          Updated {new Date(manuscript.updatedAt).toLocaleDateString()}
                        </span>
                        <Button
                          onClick={() => handleViewDetails(manuscript._id)}
                          size="sm"
                          variant="outline"
                          className="border-journal-maroon text-journal-maroon hover:bg-journal-rose"
                        >
                          <Eye size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} results
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                Previous
              </Button>
              <span className="text-xs sm:text-sm text-gray-600 px-2 whitespace-nowrap">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}