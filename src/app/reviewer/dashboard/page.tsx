"use client";

import React, { useState, useEffect } from 'react';
import { ReviewerLayout } from '@/components/reviewers/ReviewerLayout';
import {
  CheckCircle,
  AlertTriangle,
  Award,
  TrendingUp,
  RefreshCw,
  Clock
} from 'lucide-react';
import { isAxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { manuscriptReviewerApi } from '@/services/api';
import type { ReviewerDashboardData } from '@/services/api';

const ReviewerDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState<ReviewerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await manuscriptReviewerApi.getReviewerDashboard();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } else {
        setError('Failed to load dashboard data');
      }
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  if (loading) {
    return (
      <ReviewerLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-journal-maroon border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </ReviewerLayout>
    );
  }

  if (error) {
    return (
      <ReviewerLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-journal-maroon text-white px-4 py-2 rounded-lg hover:bg-journal-maroon-dark transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </ReviewerLayout>
    );
  }

  if (!dashboardData) {
    return (
      <ReviewerLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </ReviewerLayout>
    );
  }

  const { reviewer, statistics } = dashboardData;

  return (
    <ReviewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                  Welcome back, {reviewer.name}
                </h1>
                <p className="text-sm md:text-base text-gray-600 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Reviewer • {reviewer.faculty || 'Faculty'}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 w-full sm:w-auto"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-l-journal-maroon">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Total Assigned</p>
                  <p className="text-xl md:text-2xl font-bold text-journal-maroon">{statistics.totalAssigned}</p>
                </div>
                <div className="bg-journal-rose p-2 md:p-3 rounded-lg">
                  <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-journal-maroon" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl md:text-2xl font-bold text-blue-600">{statistics.inProgress}</p>
                </div>
                <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                  <Clock className="w-5 h-5 md:w-8 md:h-8 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">{statistics.completed}</p>
                </div>
                <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 md:w-8 md:h-8 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-l-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-xl md:text-2xl font-bold text-red-600">{statistics.overdue}</p>
                </div>
                <div className="bg-red-100 p-2 md:p-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5 md:w-8 md:h-8 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 text-center">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                <p className="text-xl md:text-2xl font-bold text-journal-maroon">
                  {Math.round((statistics.completed / (statistics.totalAssigned || 1)) * 100)}%
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Completion Rate</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <p className="text-xl md:text-2xl font-bold text-blue-600">
                  {statistics.totalAssigned - statistics.completed - statistics.overdue}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Remaining Reviews</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  {statistics.overdue === 0 ? 'On Track' : `${statistics.overdue} Overdue`}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Review Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReviewerLayout>
  );
};

export default ReviewerDashboard;