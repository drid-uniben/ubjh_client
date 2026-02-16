"use client";

import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  FileText,
  Loader2,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { manuscriptAdminApi, type Manuscript } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DecisionsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [showDecisionDialog, setShowDecisionDialog] = useState(false);
  const [decision, setDecision] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limit = 10;

  const loadManuscripts = useCallback(async () => {
  try {
    setIsLoading(true);
    const response = await manuscriptAdminApi.getManuscriptsForDecision({
      page: currentPage,
      limit,
    });
    setManuscripts(response.data);
    setTotalPages(response.totalPages);
  } catch (error) {
    console.error('Failed to load manuscripts:', error);
    toast.error('Failed to load manuscripts for decision');
  } finally {
    setIsLoading(false);
  }
}, [currentPage]);

  useEffect(() => {
    if (isAuthenticated) {
      loadManuscripts();
    }
  }, [isAuthenticated, currentPage, loadManuscripts]);

  const handleDecisionClick = (manuscript: Manuscript, status: string) => {
    setSelectedManuscript(manuscript);
    setDecision(status);
    setFeedback('');
    setShowDecisionDialog(true);
  };

  const handleSubmitDecision = async () => {
    if (!selectedManuscript || !feedback.trim()) {
      toast.error('Please provide feedback');
      return;
    }

    try {
      setIsSubmitting(true);
      await manuscriptAdminApi.updateManuscriptStatus(selectedManuscript._id, {
        status: decision,
        feedbackComments: feedback,
      });
      toast.success('Decision submitted successfully');
      setShowDecisionDialog(false);
      loadManuscripts();
    } catch (error) {
      console.error('Failed to submit decision:', error);
      toast.error('Failed to submit decision');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Final Decisions</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Review completed manuscripts and make final decisions
            </p>
          </div>
          <Button onClick={loadManuscripts} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
          </div>
        )}

        {/* Desktop View */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Manuscript
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!isLoading && manuscripts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">No manuscripts</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No manuscripts are ready for final decision
                    </p>
                  </td>
                </tr>
              ) : (
                manuscripts.map((manuscript) => (
                  <tr key={manuscript._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {manuscript.title}
                      </div>
                      {manuscript.revisedPdfFile && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                          Revised
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Ready for Decision
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => router.push(`/admin/decisions/${manuscript._id}`)}
                          variant="outline"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDecisionClick(manuscript, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="px-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleDecisionClick(manuscript, 'minor_revision')}>
                              Minor Revision
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDecisionClick(manuscript, 'major_revision')}>
                              Major Revision
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDecisionClick(manuscript, 'rejected')}>
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200 bg-white rounded-lg shadow">
          {!isLoading && manuscripts.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-sm font-medium text-gray-900">No manuscripts</h3>
              <p className="mt-1 text-sm text-gray-500">
                No manuscripts are ready for final decision
              </p>
            </div>
          ) : (
            manuscripts.map((manuscript) => (
              <div key={manuscript._id} className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {manuscript.title}
                    </h3>
                    {manuscript.revisedPdfFile && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                        Revised
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleDecisionClick(manuscript, 'approved')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDecisionClick(manuscript, 'rejected')}
                      className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                      variant="outline"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="px-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleDecisionClick(manuscript, 'minor_revision')}>
                          Minor Revision
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDecisionClick(manuscript, 'major_revision')}>
                          Major Revision
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/decisions/${manuscript._id}`)}>
                          View Details
                           </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 order-2 sm:order-1">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Decision Dialog */}
      {showDecisionDialog && selectedManuscript && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {decision === 'approved' ? 'Approve Manuscript' : 
                 decision === 'rejected' ? 'Reject Manuscript' :
                 decision === 'minor_revision' ? 'Request Minor Revision' :
                 'Request Major Revision'}
              </h2>
              
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Manuscript:</strong> {selectedManuscript.title}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decision Type
                </label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent"
                >
                  <option value="approved">Approve for Publication</option>
                  <option value="rejected">Reject</option>
                  <option value="minor_revision">Request Minor Revision</option>
                  <option value="major_revision">Request Major Revision</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback for Author *
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-journal-maroon focus:border-transparent"
                  placeholder="This is the '𝗖𝗼𝗺𝗺𝗲𝗻𝘁 𝗙𝗿𝗼𝗺 𝗔𝘂𝘁𝗵𝗼𝗿' that the author will recieve as feedback in his mail and dashboard, so you should make a detailed and constructive comment using all the '𝗖𝗼𝗺𝗺𝗲𝗻𝘁𝘀 𝗙𝗼𝗿 𝗔𝘂𝘁𝗵𝗼𝗿' review comments made by all the reviewers organized into one.  If the decision is a '𝗿𝗲𝗾𝘂𝗲𝘀𝘁 𝗳𝗼𝗿 𝗺𝗶𝗻𝗼𝗿' or '𝗺𝗮𝗷𝗼𝗿 𝗿𝗲𝘃𝗶𝘀𝗶𝗼𝗻' then you should use/copy the '𝗖𝗼𝗺𝗺𝗲𝗻𝘁 𝗙𝗼𝗿 𝗔𝘂𝘁𝗵𝗼𝗿' review comment of the reviewer who gave the review decision you are following."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowDecisionDialog(false)}
                  variant="outline"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitDecision}
                  disabled={isSubmitting || !feedback.trim()}
                  className={`flex-1 ${
                    decision === 'approved' ? 'bg-green-600 hover:bg-green-700' :
                    decision === 'rejected' ? 'bg-red-600 hover:bg-red-700' :
                    'bg-journal-maroon hover:bg-journal-maroon-dark'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Decision'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}