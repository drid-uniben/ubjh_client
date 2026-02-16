"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReviewerLayout } from '@/components/reviewers/ReviewerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { manuscriptReviewerApi } from '@/services/api';
import type { ManuscriptReviewWithDetails } from '@/services/api';
import {
  CheckCircle,
  FileText,
  Calendar,
  Award,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Star,
  BarChart3,
  Clock,
  MessageSquare,
} from 'lucide-react';

const CompletedReviews: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [completedReviews, setCompletedReviews] = useState<ManuscriptReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'title'>('recent');
  const [filterType, setFilterType] = useState<'all' | 'human' | 'reconciliation'>('all');

  const fetchCompletedReviews = async () => {
    try {
      setLoading(true);
      const response = await manuscriptReviewerApi.getReviewerAssignments();
      const allAssignments = response.data || [];
      
      const completed = allAssignments.filter(
        (assignment: ManuscriptReviewWithDetails) => assignment.status === 'completed'
      );
      
      setCompletedReviews(completed);
    } catch (err: unknown) {
      console.error('Error fetching completed reviews:', err);
      setError('Failed to load completed reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCompletedReviews();
    }
  }, [isAuthenticated]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const sortReviews = (reviews: ManuscriptReviewWithDetails[]) => {
    switch (sortBy) {
      case 'recent':
        return [...reviews].sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
      case 'score':
        return [...reviews].sort((a, b) => b.totalScore - a.totalScore);
      case 'title':
        return [...reviews].sort((a, b) => a.manuscript.title.localeCompare(b.manuscript.title));
      default:
        return reviews;
    }
  };

  const filteredAndSortedReviews = sortReviews(
    completedReviews.filter(review => {
      const matchesSearch = review.manuscript.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || review.reviewType === filterType;
      return matchesSearch && matchesFilter;
    })
  );

  const getReviewTypeStats = () => {
    const human = completedReviews.filter((r: ManuscriptReviewWithDetails) => r.reviewType === 'human').length;
    const reconciliation = completedReviews.filter((r: ManuscriptReviewWithDetails) => r.reviewType === 'reconciliation').length;
    return { human, reconciliation };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ReviewerLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-journal-maroon border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading completed reviews...</p>
          </div>
        </div>
      </ReviewerLayout>
    );
  }

  if (error) {
    return (
      <ReviewerLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-lg mb-4">
              <p className="text-red-600">{error}</p>
            </div>
            <button
              onClick={fetchCompletedReviews}
              className="bg-journal-maroon text-white px-4 py-2 rounded-lg hover:bg-journal-maroon-dark transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </ReviewerLayout>
    );
  }

  const reviewTypeStats = getReviewTypeStats();

  return (
    <ReviewerLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 md:p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Completed Reviews</h1>
              <p className="text-sm md:text-base text-gray-600">Review history and performance overview</p>
            </div>
            <button
              onClick={fetchCompletedReviews}
              className="inline-flex items-center justify-center px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-full md:w-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="max-w-7xl mx-auto mb-6 md:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Total Completed</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{completedReviews.length}</p>
                </div>
                <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Regular Reviews</p>
                  <p className="text-xl md:text-2xl font-bold text-journal-maroon">{reviewTypeStats.human}</p>
                </div>
                <div className="bg-journal-rose p-2 md:p-3 rounded-lg">
                  <FileText className="w-5 h-5 md:w-6 md:h-6 text-journal-maroon" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">Reconciliation Reviews</p>
                  <p className="text-xl md:text-2xl font-bold text-purple-600">{reviewTypeStats.reconciliation}</p>
                </div>
                <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
                  <Award className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'score' | 'title')}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-journal-maroon focus:border-transparent text-sm w-full sm:w-auto"
                  >
                    <option value="recent">Sort by Recent</option>
                    <option value="score">Sort by Score</option>
                    <option value="title">Sort by Title</option>
                  </select>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['all', 'human', 'reconciliation'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type as 'all' | 'human' | 'reconciliation')}
                      className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-colors ${
                        filterType === type
                          ? 'bg-journal-maroon text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full lg:w-auto">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search completed reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Completed Reviews List */}
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
              <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No completed reviews found</h3>
              <p className="text-sm md:text-base text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'You haven\'t completed any reviews yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 break-words">
                              {review.manuscript.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-2">  
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                Completed: {review.completedAt ? formatDate(review.completedAt) : 'N/A'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            {review.reviewType === 'reconciliation' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <Award className="w-3 h-3 mr-1" />
                                Reconciliation
                              </span>
                            )}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-2 text-yellow-500" />
                              <span className="text-xs md:text-sm font-medium text-gray-700">Score</span>
                            </div>
                            <div className="text-right">
                              <span className={`text-base md:text-lg font-bold ${getScoreColor(review.totalScore)}`}>
                                {review.totalScore}/100
                              </span>
                              <p className="text-xs text-gray-500">{getScoreGrade(review.totalScore)}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="text-xs md:text-sm font-medium text-gray-700">Due Date</span>
                            </div>
                            <span className="text-xs md:text-sm text-gray-600">
                              {formatDate(review.dueDate)}
                            </span>
                          </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4">
                          <div className="flex items-center mb-3">
                            <BarChart3 className="w-4 h-4 mr-2 text-journal-maroon" />
                            <span className="text-xs md:text-sm font-medium text-gray-700">Score Breakdown</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div
                              className="bg-gradient-to-r from-journal-maroon to-blue-500 rounded-full h-3 transition-all duration-500"
                              style={{ width: `${review.totalScore}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>0</span>
                            <span className="font-medium">{review.totalScore}/100</span>
                            <span>100</span>
                          </div>
                        </div>

                        {/* Comments Preview */}
                        {review.comments?.commentsForAuthor && (
                          <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                            <div className="flex items-start">
                              <MessageSquare className="w-4 h-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">Review Comments</p>
                                <p className="text-xs md:text-sm text-gray-600 line-clamp-3 break-words">
                                  {review.comments.commentsForAuthor.length > 150 
                                    ? `${review.comments.commentsForAuthor.substring(0, 150)}...` 
                                    : review.comments.commentsForAuthor}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 lg:ml-6">
                        <Link
                          href={`/reviewer/assignments/${review._id}`}
                          className="inline-flex items-center justify-center px-4 py-2 bg-journal-maroon text-white rounded-lg hover:bg-journal-maroon-dark transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ReviewerLayout>
  );
};

export default CompletedReviews;