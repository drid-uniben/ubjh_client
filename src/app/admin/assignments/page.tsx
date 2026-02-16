"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { adminReviewApi } from '@/services/api';
import {
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  TrendingUp,
  Award,
  RefreshCw,
} from 'lucide-react';

interface AdminReviewAssignment {
  _id: string;
  manuscript: {
    _id: string;
    title: string;
    status: string;
    createdAt: string;
  };
  reviewType: 'human' | 'reconciliation';
  status: 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  completedAt?: string;
  totalScore: number;
}

interface AdminReviewStats {
  totalAssigned: number;
  completed: number;
  pending: number;
  overdue: number;
}

const AdminAssignments: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [assignments, setAssignments] = useState<AdminReviewAssignment[]>([]);
  const [statistics, setStatistics] = useState<AdminReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'reconciliation'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsData, statsData] = await Promise.all([
        adminReviewApi.getAdminAssignments(),
        adminReviewApi.getAdminStatistics(),
      ]);
      
      setAssignments(assignmentsData.data || []);
      setStatistics(statsData.data.statistics || null);
    } catch (err: unknown) {
      console.error('Error fetching data:', err);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status !== 'completed';
    
    if (isOverdue) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Overdue
        </span>
      );
    }
    
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getPriorityLevel = (dueDate: string, reviewType: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (reviewType === 'reconciliation') return 'high';
    if (days < 0) return 'overdue';
    if (days <= 2) return 'high';
    if (days <= 7) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'overdue': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'reconciliation': return 'border-l-purple-500 bg-purple-50';
      default: return 'border-l-green-500 bg-green-50';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.manuscript.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filter) {
      case 'pending':
        return assignment.status === 'in_progress';
      case 'overdue':
        return new Date(assignment.dueDate) < new Date() && assignment.status !== 'completed';
      case 'reconciliation':
        return assignment.reviewType === 'reconciliation';
      default:
        return true;
    }
  }).sort((a, b) => new Date(b.manuscript.createdAt).getTime() - new Date(a.manuscript.createdAt).getTime());

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-journal-maroon border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-journal-maroon text-white px-4 py-2 rounded-lg hover:bg-journal-maroon-dark transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 md:p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Admin Review Assignments</h1>
              <p className="text-sm md:text-base text-gray-600">Manage your manuscript reviews and track progress</p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-full md:w-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="max-w-7xl mx-auto mb-6 md:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-600">Total Assigned</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">{statistics.totalAssigned}</p>
                  </div>
                  <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-xl md:text-2xl font-bold text-green-600">{statistics.completed}</p>
                  </div>
                  <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-xl md:text-2xl font-bold text-yellow-600">{statistics.pending}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 md:p-3 rounded-lg">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-xl md:text-2xl font-bold text-red-600">{statistics.overdue}</p>
                  </div>
                  <div className="bg-red-100 p-2 md:p-3 rounded-lg">
                    <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'overdue', 'reconciliation'].map((filterOption) => (
                      <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption as 'all' | 'pending' | 'overdue' | 'reconciliation')}
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-colors ${
                          filter === filterOption
                            ? 'bg-journal-maroon text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative w-full lg:w-auto">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search manuscripts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="max-w-7xl mx-auto">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
              <FileText className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-sm md:text-base text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'You have no review assignments at the moment'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => {
                const priority = getPriorityLevel(assignment.dueDate, assignment.reviewType);
                const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div
                    key={assignment._id}
                    className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${getPriorityColor(priority)}`}
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 break-words">
                                {assignment.manuscript.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                  {new Date(assignment.manuscript.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {assignment.reviewType === 'reconciliation' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <Award className="w-3 h-3 mr-1" />
                                  Reconciliation
                                </span>
                              )}
                              {getStatusBadge(assignment.status, assignment.dueDate)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                            <div className="flex items-center text-xs md:text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span className="truncate">
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                {daysUntilDue >= 0 ? (
                                  <span className="ml-1 text-green-600">({daysUntilDue} days left)</span>
                                ) : (
                                  <span className="ml-1 text-red-600">({Math.abs(daysUntilDue)} days overdue)</span>
                                )}
                              </span>
                            </div>

                            {assignment.totalScore > 0 && (
                              <div className="flex items-center text-xs md:text-sm text-gray-600">
                                <TrendingUp className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                <span>Score: {assignment.totalScore}/100</span>
                                <div className="ml-3 w-20 md:w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-journal-maroon rounded-full h-2"
                                    style={{ width: `${assignment.totalScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-6">
                          <Link
                            href={`/admin/assignments/${assignment._id}`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-journal-maroon text-white rounded-lg hover:bg-journal-maroon-dark transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {assignment.status === 'in_progress' ? 'Continue Review' : assignment.status === 'completed' ? 'View Review' : 'Start Review'}
                          </Link>
                          
                          {assignment.status === 'completed' && assignment.completedAt && (
                            <span className="text-xs text-gray-500 text-center lg:text-left">
                              Completed {new Date(assignment.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAssignments;