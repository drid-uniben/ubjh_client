"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Clock, AlertCircle, Save, Send, FileText, Award } from 'lucide-react';
import { toast, Toaster } from "sonner";
import { ReviewerLayout } from '@/components/reviewers/ReviewerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { manuscriptReviewerApi } from '@/services/api';
import type { ReviewScores } from '@/services/api';
import ManuscriptDiscrepancyAlert from '@/components/reviewers/DiscrepancyAlert';

interface ReviewCriteria {
  id: keyof ReviewScores;
  name: string;
  description: string;
  maxScore: number;
  scoreGiven?: number;
}

interface ManuscriptReviewDetails {
  _id: string;
  manuscript: {
    _id: string;
    title: string;
    abstract: string;
    keywords: string[];
    pdfFile?: string;
    revisedPdfFile?: string;
    revisionType?: 'minor' | 'major';
    status: string;
  };
  reviewType: 'human' | 'reconciliation';
  status: 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  totalScore: number;
  scores: ReviewScores;
  comments?: {
    commentsForAuthor?: string;
    confidentialCommentsToEditor?: string;
  };
  reviewDecision?: string;
}

interface PreviousReview {
  totalScore: number;
  reviewDecision: string;
  comments?: {
    commentsForAuthor?: string;
  };
}



const ManuscriptReviewForm: React.FC = () => {

  const { isAuthenticated } = useAuth();

  const router = useRouter();

  const params = useParams();

  const reviewId = params.id as string;



  const [reviewData, setReviewData] = useState<ManuscriptReviewDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);



  const [previousReview, setPreviousReview] = useState<PreviousReview | null>(null);
const [isRevised, setIsRevised] = useState(false);
interface ConflictingReview {
  reviewerId: string;
  reviewerName: string;
  totalScore: number;
  reviewDecision: string;
  completedAt: string;
}

const [conflictingReviews, setConflictingReviews] = useState<ConflictingReview[]>([]);

  const [reviewCriteria, setReviewCriteria] = useState<ReviewCriteria[]>([
    {
      id: 'originality',
      name: 'Originality and Innovation',
      description: 'Novelty of research; contribution to knowledge; creative approach',
      maxScore: 20,
    },
    {
      id: 'methodology',
      name: 'Methodology',
      description: 'Appropriateness, rigor, and feasibility of research methods and design',
      maxScore: 20,
    },
    {
      id: 'clarity',
      name: 'Clarity of Presentation',
      description: 'Organization, writing quality, and coherence of arguments',
      maxScore: 15,
    },
    {
      id: 'relevance',
      name: 'Relevance and Significance',
      description: 'Importance to the field and potential impact',
      maxScore: 15,
    },
    {
      id: 'literature',
      name: 'Literature Review',
      description: 'Comprehensiveness and integration of relevant literature',
      maxScore: 10,
    },
    {
      id: 'results',
      name: 'Results and Analysis',
      description: 'Quality of data analysis and interpretation',
      maxScore: 10,
    },
    {
      id: 'contribution',
      name: 'Overall Contribution',
      description: 'Scholarly contribution and potential for future research',
      maxScore: 10,
    },
  ]);

  const [commentsForAuthor, setCommentsForAuthor] = useState('');
  const [confidentialComments, setConfidentialComments] = useState('');
  const [reviewDecision, setReviewDecision] = useState<string>('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    const allScoresEntered = reviewCriteria.every(criteria => criteria.scoreGiven !== undefined);
    const anyScoreEntered = reviewCriteria.some(criteria => criteria.scoreGiven !== undefined);
    const anyFieldFilled = anyScoreEntered || commentsForAuthor.trim() !== '' || confidentialComments.trim() !== '' || reviewDecision !== '';

    setIsSaveDisabled(!anyFieldFilled);
    setIsSubmitDisabled(!(allScoresEntered && commentsForAuthor.trim() !== '' && confidentialComments.trim() !== '' && reviewDecision !== ''));
  }, [reviewCriteria, commentsForAuthor, confidentialComments, reviewDecision]);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!reviewId || !isAuthenticated) return;

      try {
        setLoading(true);
        const response = await manuscriptReviewerApi.getReviewById(reviewId);
        
        if (response.success) {
          const review = response.data as ManuscriptReviewDetails;
          setReviewData(review);

          // Check if reconciliation review
        if (review.reviewType === 'reconciliation') {
          const reconData = await manuscriptReviewerApi.getReconciliationData(reviewId);
          if (reconData.success) {
            setConflictingReviews(reconData.data.conflictingReviews);
          }
        }
        
        // Check if revised manuscript
        if (review.manuscript.revisedPdfFile) {
          setIsRevised(true);
          // Fetch previous review if exists
          const historyResponse = await manuscriptReviewerApi.getReviewWithHistory(reviewId);
          if (historyResponse.success && historyResponse.data.previousReview) {
            setPreviousReview(historyResponse.data.previousReview);
          }
        }

          setCommentsForAuthor(review.comments?.commentsForAuthor || '');
          setConfidentialComments(review.comments?.confidentialCommentsToEditor || '');
          setReviewDecision(review.reviewDecision || '');
          
          setReviewCriteria(prev => 
            prev.map(criteria => ({
              ...criteria,
              scoreGiven: review.scores[criteria.id] || undefined
            }))
          );
        } else {
          setError('Failed to load review data');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [reviewId, isAuthenticated]);

  const handleScoreChange = (id: keyof ReviewScores, score: number) => {
    setReviewCriteria(prev => 
      prev.map(criteria => 
        criteria.id === id 
          ? { ...criteria, scoreGiven: score } 
          : criteria
      )
    );
  };

  const calculateTotalScore = () => {
    return reviewCriteria.reduce((total, criteria) => 
      total + (criteria.scoreGiven || 0), 0
    );
  };

  const calculateMaxTotalScore = () => {
    return reviewCriteria.reduce((total, criteria) => 
      total + criteria.maxScore, 0
    );
  };

  const handleSaveProgress = async () => {
    if (!reviewData) return;

    try {
      setSaving(true);
      
      const scores: Partial<ReviewScores> = {};
      reviewCriteria.forEach(criteria => {
        if (criteria.scoreGiven !== undefined) {
          scores[criteria.id] = criteria.scoreGiven;
        }
      });

      const progressData: Partial<ManuscriptReviewDetails> = {};
      if (Object.keys(scores).length > 0) progressData.scores = scores as ReviewScores;
      if (commentsForAuthor || confidentialComments) {
        progressData.comments = {
          commentsForAuthor: commentsForAuthor || undefined,
          confidentialCommentsToEditor: confidentialComments || undefined,
        };
      }
      if (reviewDecision) progressData.reviewDecision = reviewDecision;

      const response = await manuscriptReviewerApi.saveReviewProgress(reviewData._id, progressData);
      
      if (response.success) {
        toast.success('Progress saved successfully');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save progress');
      toast.error(err instanceof Error ? err.message : 'Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!reviewData) return;

    const allScoresEntered = reviewCriteria.every(criteria => 
      criteria.scoreGiven !== undefined
    );

    if (!allScoresEntered) {
      setError('Please enter scores for all criteria');
      return;
    }

    if (!commentsForAuthor.trim() || !confidentialComments.trim()) {
      setError('Please provide comments for the author and confidential comments for the editor');
      return;
    }

    if (!reviewDecision) {
      setError('Please select a review decision');
      return;
    }

    try {
      setSubmitting(true);
      
      const scores: ReviewScores = {
        originality: 0,
        methodology: 0,
        clarity: 0,
        relevance: 0,
        literature: 0,
        results: 0,
        contribution: 0,
      };

      reviewCriteria.forEach(criteria => {
        scores[criteria.id] = criteria.scoreGiven || 0;
      });

      const response = await manuscriptReviewerApi.submitReview(reviewData._id, {
        scores,
        comments: {
          commentsForAuthor,
          confidentialCommentsToEditor: confidentialComments || undefined,
        },
        reviewDecision,
      });

      if (response.success) {
        toast.success('Review submitted successfully');
        router.push('/reviewer/assignments');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
      toast.error(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setReviewCriteria(prev => 
      prev.map(criteria => ({ ...criteria, scoreGiven: undefined }))
    );
    setCommentsForAuthor('');
    setConfidentialComments('');
    setReviewDecision('');
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
            <p className="text-gray-600">Loading review...</p>
          </div>
        </div>
      </ReviewerLayout>
    );
  }

  if (error && !reviewData) {
    return (
      <ReviewerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/reviewer/assignments')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </ReviewerLayout>
    );
  }

  if (!reviewData) {
    return (
      <ReviewerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Review not found</p>
          </div>
        </div>
      </ReviewerLayout>
    );
  }

  const isCompleted = reviewData.status === 'completed';
  const isReconciliation = reviewData.reviewType === 'reconciliation';

  return (
    <ReviewerLayout>
      <Toaster />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                  {isCompleted ? 'Review Details' : 'Review Manuscript'}
                </h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-xs md:text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Due: {formatDate(reviewData.dueDate)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reviewData.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : reviewData.status === 'overdue'
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reviewData.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {isReconciliation && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      RECONCILIATION REVIEW
                    </span>
                  )}
                </div>
              </div>
              <Link 
                href="/reviewer/review-guideline" 
                target="_blank" 
                className="bg-gray-100 px-4 py-2 rounded-lg text-journal-maroon hover:text-journal-maroon-dark text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Review Guidelines
              </Link>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Reconciliation Alert */}
{isReconciliation && conflictingReviews.length > 0 && (
  <ManuscriptDiscrepancyAlert conflictingReviews={conflictingReviews} />
)}

{/* Revised Manuscript Notice */}
{isRevised && (
  <div className="bg-purple-50 border border-purple-200 rounded-lg shadow-md p-4 sm:p-6 mb-6">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
      </div>
      <div className="flex-1">
        <h2 className="text-base sm:text-lg font-bold text-purple-800 mb-2">
          Revised Manuscript Submission
        </h2>
        <p className="text-sm text-purple-700 mb-3">
          This is a revised version of a manuscript you previously reviewed. 
          {reviewData.manuscript.revisionType === 'minor' && ' The author has addressed minor revision requests.'}
          {reviewData.manuscript.revisionType === 'major' && ' The author has addressed major revision requests.'}
        </p>
        
        {previousReview && (
          <div className="bg-white rounded-lg p-4 mb-3">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">Your Previous Review:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Score:</span>
                <span className="font-bold text-purple-700">{previousReview.totalScore}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Decision:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  previousReview.reviewDecision === 'publishable' ? 'bg-green-100 text-green-800' :
                  previousReview.reviewDecision === 'publishable_with_minor_revision' ? 'bg-yellow-100 text-yellow-800' :
                  previousReview.reviewDecision === 'publishable_with_major_revision' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {previousReview.reviewDecision?.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t">
                <span className="text-gray-600 block mb-1">Your Comments:</span>
                <p className="text-gray-700 text-xs bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                  {previousReview.comments?.commentsForAuthor || 'No comments available'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          {reviewData.manuscript.revisedPdfFile && (
            <button
              onClick={() => window.open(reviewData.manuscript.revisedPdfFile, '_blank')}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Revised PDF
            </button>
          )}
          <button
            onClick={() => window.open(reviewData.manuscript.pdfFile, '_blank')}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 text-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Original PDF
          </button>
        </div>
      </div>
    </div>
  </div>
)}

          {/* Manuscript Details */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            <h2 className="text-lg md:text-xl font-bold text-journal-maroon mb-4 border-b pb-2">Manuscript Details</h2>
            
            <div className="mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">{reviewData.manuscript.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-journal-maroon" />
                  <h4 className="font-semibold text-gray-700">Manuscript Information</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize">{reviewData.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{formatDate(reviewData.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Keywords:</span>
                    <span className="font-medium">{reviewData.manuscript.keywords.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Abstract</h4>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">{reviewData.manuscript.abstract}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {reviewData.manuscript.keywords.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {reviewData.manuscript.pdfFile && (
                <div className="bg-gray-50 rounded-lg p-4">
                    <a
                        href={reviewData.manuscript.pdfFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                    >
                        <h4 className="font-semibold text-gray-700 mb-2">Manuscript to be Reviewed</h4>
                        <div className="inline-flex items-center px-4 py-2 bg-journal-maroon text-white rounded-lg hover:bg-journal-maroon-dark transition-colors text-sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Click here to View Manuscript PDF
                        </div>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Review Scoring Section */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-lg md:text-xl font-bold text-journal-maroon">
                {isCompleted ? 'Your Review Scores' : 'Manuscript Scoring'}
              </h2>
              {isCompleted && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total Score</div>
                  <div className="text-xl md:text-2xl font-bold text-journal-maroon">
                    {reviewData.totalScore}/{calculateMaxTotalScore()}
                  </div>
                </div>
              )}
            </div>

            {/* Scoring Criteria */}
            <div className="space-y-4 mb-6">
              {reviewCriteria.map((criteria) => (
                <div key={criteria.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">
                        {criteria.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-2">
                        {criteria.description}
                      </p>
                      <span className="text-xs text-gray-500">Max Score: {criteria.maxScore}</span>
                    </div>
                    <div className="flex items-center md:ml-4">
                      {isCompleted ? (
                        <div className="text-right">
                          <div className="text-base md:text-lg font-bold text-journal-maroon">
                            {reviewData.scores[criteria.id]}/{criteria.maxScore}
                          </div>
                          <div className="w-20 md:w-24 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-journal-maroon rounded-full h-2" 
                              style={{ 
                                width: `${(reviewData.scores[criteria.id] / criteria.maxScore) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <input 
                          type="number"
                          min="0"
                          max={criteria.maxScore}
                          value={criteria.scoreGiven ?? ''}
                          onChange={(e) => {
                            const score = parseInt(e.target.value);
                            handleScoreChange(
                              criteria.id, 
                              isNaN(score) ? 0 : Math.min(score, criteria.maxScore)
                            );
                          }}
                          className="w-16 md:w-20 p-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-journal-maroon"
                          placeholder={`0-${criteria.maxScore}`}
                        />
                      )}
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <div className="bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-journal-maroon rounded-full h-2 transition-all duration-300" 
                        style={{ 
                          width: `${criteria.scoreGiven 
                            ? (criteria.scoreGiven / criteria.maxScore) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Score */}
            {!isCompleted && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-6 flex justify-between items-center">
                <span className="font-bold text-base md:text-lg text-gray-800">Total Score</span>
                <span className="text-xl md:text-2xl font-bold text-journal-maroon">
                  {calculateTotalScore()}/{calculateMaxTotalScore()}
                </span>
              </div>
            )}

            {/* Review Decision */}
            <div className="mb-6">
              <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2">
                Review Decision
              </label>
              {isCompleted ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    reviewData.reviewDecision === 'publishable' ? 'bg-green-100 text-green-800' :
                    reviewData.reviewDecision === 'not_publishable' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reviewData.reviewDecision?.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              ) : (
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-journal-maroon"
                >
                  <option value="">Select a decision...</option>
                  <option value="publishable">Publishable</option>
                  <option value="not_publishable">Not Publishable</option>
                  <option value="publishable_with_minor_revision">Publishable with Minor Revision</option>
                  <option value="publishable_with_major_revision">Publishable with Major Revision</option>
                </select>
              )}
            </div>

            {/* Review Comments */}
            <div className="mb-6">
              <label 
                htmlFor="comments-author" 
                className="block text-base md:text-lg font-semibold text-gray-700 mb-2"
              >
                Comments for Author
              </label>
              {isCompleted ? (
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
                    {reviewData.comments?.commentsForAuthor || 'No comments provided.'}
                  </p>
                </div>
              ) : (
                <textarea 
                  id="comments-author"
                  value={commentsForAuthor}
                  onChange={(e) => setCommentsForAuthor(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-journal-maroon resize-vertical text-sm md:text-base"
                  placeholder="Provide detailed comments for the author..."
                />
              )}
            </div>

            <div className="mb-6">
              <label 
                htmlFor="comments-editor" 
                className="block text-base md:text-lg font-semibold text-gray-700 mb-2"
              >
                Confidential Comments to Editor
              </label>
              {isCompleted ? (
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
                    {reviewData.comments?.confidentialCommentsToEditor || 'No confidential comments provided.'}
                  </p>
                </div>
              ) : (
                <textarea 
                  id="comments-editor"
                  value={confidentialComments}
                  onChange={(e) => setConfidentialComments(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-journal-maroon resize-vertical text-sm md:text-base"
                  placeholder="Confidential comments for the editor only..."
                />
              )}
            </div>

            {/* Action Buttons */}
            {!isCompleted && (
              <div className="bg-blue-50 border border-journal-maroon rounded-lg p-4 mb-6 text-sm text-journal-maroon">
                <p><strong>Note:</strong> You can only submit the review after filling all the fields. However, you can save your progress at any time and come back later to continue.</p>
              </div>
            )}
            {!isCompleted && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleSaveProgress}
                  disabled={saving || isSaveDisabled}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Progress
                    </>
                  )}
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={submitting || isSubmitDisabled}
                  className="flex-1 bg-journal-maroon text-white py-3 px-4 rounded-lg hover:bg-journal-maroon-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
                </button>
                <button 
                  onClick={handleReset}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Completion Message */}
            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="font-medium text-sm md:text-base">
                    Review completed on {reviewData.completedAt ? formatDate(reviewData.completedAt) : 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ReviewerLayout>
  );
};

export default ManuscriptReviewForm;