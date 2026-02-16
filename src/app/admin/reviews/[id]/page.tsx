"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  RefreshCw,
  Loader2,
  User,
  FileText,
  Calendar,
  MessageSquare,
  BarChart3,
  Mail,
} from 'lucide-react';
import { manuscriptReviewApi, type ReviewDetail } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewScore {
  originality?: number;
  methodology?: number;
  clarity?: number;
  relevance?: number;
  literature?: number;
  results?: number;
  contribution?: number;
}

interface ReviewComponentProps {
  _id: string;
  reviewType: 'human' | 'reconciliation';
  status: string;
  scores: ReviewScore;
  totalScore: number;
  comments: {
    commentsForAuthor?: string;
    confidentialCommentsToEditor?: string;
  };
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  reviewDecision: string;
  reviewer?: {
    name: string;
    email: string;
  };
}

interface ManuscriptReviewDetails {
  manuscript: {
    _id: string;
    title: string;
    abstract: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    submitter: {
      name: string;
      email: string;
    };
  };
  reviewSummary: {
    totalReviews: number;
    completedReviews: number;
    pendingReviews: number;
    hasHuman: boolean;
    hasReconciliation: boolean;
  };
  reviews: {
    human: ReviewDetail[];
    reconciliation: ReviewDetail[];
  };
}

const criteriaLabels: { [key: string]: string } = {
  originality: 'Originality',
  methodology: 'Methodology',
  clarity: 'Clarity',
  relevance: 'Relevance',
  literature: 'Literature Review',
  results: 'Results',
  contribution: 'Contribution',
};

const criteriaMaxScores: { [key: string]: number } = {
  originality: 20,
  methodology: 20,
  clarity: 15,
  relevance: 15,
  literature: 10,
  results: 10,
  contribution: 10,
};

export default function ManuscriptReviewDetailsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const manuscriptId = params.id as string;

  const [details, setDetails] = useState<ManuscriptReviewDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await manuscriptReviewApi.getReviewDetails(manuscriptId);
      setDetails(response.data);
    } catch (err) {
      console.error('Failed to load review details:', err);
      setError('Failed to load review details');
    } finally {
      setIsLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    if (isAuthenticated && manuscriptId) {
      loadDetails();
    }
  }, [isAuthenticated, manuscriptId, loadDetails]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle size={14} />
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
            <Clock size={14} />
            In Progress
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800">
            <AlertTriangle size={14} />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'publishable':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle size={14} />
            Publishable
          </span>
        );
      case 'not_publishable':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800">
            <AlertTriangle size={14} />
            Not Publishable
          </span>
        );
      case 'publishable_with_minor_revision':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle size={14} />
            Minor Revision
          </span>
        );
      case 'publishable_with_major_revision':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-100 text-orange-800">
            <AlertTriangle size={14} />
            Major Revision
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800">
            {decision}
          </span>
        );
    }
  };

  const renderScoreBreakdown = (review: ReviewComponentProps) => {
    const scores = Object.entries(review.scores || {});
    if (scores.length === 0) {
      return <p className="text-sm text-gray-500">No scores available</p>;
    }

    return (
      <div className="space-y-3">
        {scores.map(([criterion, score]) => {
          const maxScore = criteriaMaxScores[criterion] || 10;
          const percentage = score ? (score / maxScore) * 100 : 0;
          
          return (
            <div key={criterion}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {criteriaLabels[criterion] || criterion}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {score || 0}/{maxScore}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-journal-maroon h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">Total Score</span>
            <span className="text-lg font-bold text-journal-maroon">
              {review.totalScore}/100
            </span>
          </div>
        </div>
        {review.reviewDecision && (
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">Decision</span>
              {getDecisionBadge(review.reviewDecision)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReviewCard = (review: ReviewComponentProps, index: number) => {
    return (
      <div key={review._id} className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {review.reviewType === 'human' ? `Reviewer Review #${index + 1}` : 'Reconciliation Review'}
              </h3>
              {review.reviewer && (
                <div className="mt-2 space-y-1 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1 truncate">
                    <User size={14} className="flex-shrink-0" />
                    {review.reviewer.name}
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Mail size={14} className="flex-shrink-0" />
                    <span className="truncate">{review.reviewer.email}</span>
                  </div>
                </div>
              )}
            </div>
            {getStatusBadge(review.status)}
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score Breakdown */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base flex items-center gap-2">
                <BarChart3 size={16} />
                Score Breakdown
              </h4>
              {renderScoreBreakdown(review)}
            </div>

            {/* Comments and Details */}
            <div className="space-y-4">
              {/* Comments */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base flex items-center gap-2">
                  <MessageSquare size={16} />
                  Comments
                </h4>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 min-h-[100px] text-xs sm:text-sm">
                  {review.comments?.commentsForAuthor || review.comments ? (
                    <div className="space-y-2">
                      {review.comments?.commentsForAuthor && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">For Author:</p>
                          <p className="text-gray-600 whitespace-pre-wrap break-words">
                            {review.comments.commentsForAuthor}
                          </p>
                        </div>
                      )}
                      {review.comments?.confidentialCommentsToEditor && (
                        <div className="border-t pt-2 mt-2">
                          <p className="font-medium text-gray-700 mb-1">Confidential (Editor Only):</p>
                          <p className="text-gray-600 whitespace-pre-wrap break-words">
                            {review.comments.confidentialCommentsToEditor}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No comments provided</p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <Calendar size={14} className="flex-shrink-0" />
                    Due Date
                  </div>
                  <div className="font-medium text-gray-900">
                    {new Date(review.dueDate).toLocaleDateString()}
                  </div>
                </div>
                {review.completedAt && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-green-700 mb-1">
                      <CheckCircle size={14} className="flex-shrink-0" />
                      Completed
                    </div>
                    <div className="font-medium text-green-900">
                      {new Date(review.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
          <span className="ml-3 text-gray-600">Loading details...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error || !details) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            size="sm"
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error || 'Manuscript not found'}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const allReviews = [
    ...details.reviews.human,
    ...details.reviews.reconciliation,
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:items-center sm:justify-between">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <Button onClick={loadDetails} variant="outline" size="sm">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>

        {/* Manuscript Overview */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-journal-maroon to-[#5A0014] text-white p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              {details.manuscript.title}
            </h1>
            <p className="text-sm sm:text-base opacity-90 line-clamp-2">
              {details.manuscript.abstract}
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {/* Submitter Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Submitter</h3>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {details.manuscript.submitter.name}
                  </p>
                  <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm truncate">
                    <Mail size={14} />
                    <span className="truncate">{details.manuscript.submitter.email}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Submitted</h3>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {new Date(details.manuscript.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Status</h3>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {details.manuscript.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                <FileText className="h-5 w-5 text-blue-800" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Total Reviews</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {details.reviewSummary.totalReviews}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                <CheckCircle className="h-5 w-5 text-green-800" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {details.reviewSummary.completedReviews}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
                <Clock className="h-5 w-5 text-yellow-800" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {details.reviewSummary.pendingReviews}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                <BarChart3 className="h-5 w-5 text-purple-800" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Completion</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-900">
                  {details.reviewSummary.totalReviews > 0
                    ? Math.round((details.reviewSummary.completedReviews / details.reviewSummary.totalReviews) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border rounded-lg p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Review Progress</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-semibold text-gray-900">
                {details.reviewSummary.completedReviews}/{details.reviewSummary.totalReviews} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-journal-maroon to-[#5A0014] h-3 rounded-full transition-all"
                style={{ 
                  width: `${details.reviewSummary.totalReviews > 0 ? (details.reviewSummary.completedReviews / details.reviewSummary.totalReviews) * 100 : 0}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            All Reviews ({allReviews.length})
          </h2>

          {details.reviews.human.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Reviewer Reviews ({details.reviews.human.length})
              </h3>
              <div className="space-y-4">
                {details.reviews.human.map((review, index) => renderReviewCard(review as unknown as ReviewComponentProps, index))}
              </div>
            </div>
          )}

          {details.reviews.reconciliation.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <RefreshCw size={18} className="text-purple-600" />
                Reconciliation Review
              </h3>
              <div className="space-y-4">
                {details.reviews.reconciliation.map((review, index) => renderReviewCard(review as unknown as ReviewComponentProps, index))}
              </div>
            </div>
          )}

          {allReviews.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-sm font-medium text-gray-900">No Reviews Available</h3>
              <p className="mt-1 text-sm text-gray-600">
                This manuscript has not been reviewed yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}