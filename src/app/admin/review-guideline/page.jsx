import { AdminLayout } from '@/components/admin/AdminLayout';

export default function ReviewGuideline() {
    return (
        <AdminLayout>
            <div className="min-h-screen p-4 md:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
                    {/* Header */}
                    <div className=" text-black bg-accent p-6 md:p-8 rounded-t-lg">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Manuscript Review Guidelines</h1>
                        <p className="text-sm md:text-base text-gray-700">University of Benin Journal of Humanities</p>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Introduction */}
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">Introduction</h2>
                            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                                Thank you for serving as a reviewer for the University of Benin Journal of Humanities. Your expertise and careful evaluation are crucial to maintaining the high standards of our publication. This guide provides the framework for conducting thorough and constructive manuscript reviews.
                            </p>
                        </div>

                        {/* Review Criteria */}
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">Evaluation Criteria</h2>
                            <p className="text-sm md:text-base text-gray-600 mb-4">Each manuscript should be evaluated based on the following criteria (Total: 100 points):</p>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border border-gray-300 p-3 text-left font-semibold">Criterion</th>
                                            <th className="border border-gray-300 p-3 text-left font-semibold">Description</th>
                                            <th className="border border-gray-300 p-3 text-center font-semibold">Max Points</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-3 font-medium text-gray-800">
                                                <div className="flex items-center">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">1</span>
                                                    Originality and Innovation
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-gray-700">
                                                Assess the novelty of the research, its contribution to the field of humanities, and the creative approach to the subject matter. Consider whether the work presents new insights, theories, or methodologies.
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center font-bold text-purple-600">20</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-3 font-medium text-gray-800">
                                                <div className="flex items-center">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">2</span>
                                                    Methodology
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-gray-700">
                                                Evaluate the appropriateness, rigor, and feasibility of the research methods. Consider whether the methodology is suitable for addressing the research questions and whether it is clearly explained and justified.
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center font-bold text-purple-600">20</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-3 font-medium text-gray-800">
                                                <div className="flex items-center">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">3</span>
                                                    Clarity of Presentation
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-gray-700">
                                                Assess the organization, writing quality, and coherence of arguments. The manuscript should be well-structured with clear transitions, proper grammar, and appropriate academic style.
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center font-bold text-purple-600">15</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-3 font-medium text-gray-800">
                                                <div className="flex items-center">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">4</span>
                                                    Relevance and Significance
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-gray-700">
                                                Consider the importance of the research to the field of humanities and its potential impact. Does it address significant questions or problems? Will it advance scholarly understanding?
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center font-bold text-purple-600">15</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-3 font-medium text-gray-800">
                                                <div className="flex items-center">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">5</span>
                                                    Literature Review
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-gray-700">
                                                Evaluate the comprehensiveness and integration of relevant literature. The author should demonstrate familiarity with key works in the field and properly contextualize their research.
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center font-bold text-purple-600">10</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-3 font-medium text-gray-800">
                                                <div className="flex items-center">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">6</span>
                                                    Results and Analysis
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-gray-700">
                                                Assess the quality of data analysis and interpretation. Results should be presented clearly, analyzed thoroughly, and interpreted in light of the research questions.
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center font-bold text-purple-600">10</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-3 font-medium text-gray-800">
                                                <div className="flex items-center">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">7</span>
                                                    Overall Contribution
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-gray-700">
                                                Consider the overall scholarly contribution and potential for future research. Does the work open new avenues of inquiry? Will it be cited and used by other scholars?
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center font-bold text-purple-600">10</td>
                                        </tr>
                                        <tr className="bg-purple-50">
                                            <td colSpan={2} className="border border-gray-300 p-3 text-right font-bold text-gray-800">Total Points:</td>
                                            <td className="border border-gray-300 p-3 text-center font-bold text-purple-700 text-lg">100</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Review Decisions */}
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">Review Decisions</h2>
                            <p className="text-sm md:text-base text-gray-600 mb-4">Based on your evaluation, select one of the following recommendations:</p>
                            
                            <div className="space-y-4">
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                    <h3 className="font-bold text-green-800 mb-2">✓ Publishable</h3>
                                    <p className="text-sm text-green-700">The manuscript meets all publication standards and requires no significant revisions. Minor editorial corrections may be suggested.</p>
                                </div>
                                
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                                    <h3 className="font-bold text-yellow-800 mb-2">⚠ Publishable with Minor Revision</h3>
                                    <p className="text-sm text-yellow-700">The manuscript is generally sound but requires minor improvements such as clarification of certain points, correction of minor errors, or addition of missing references. Note that the revised manuscript submitted by the author might be reviewed by the editor since the revision is minor.</p>
                                </div>
                                
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                                    <h3 className="font-bold text-orange-800 mb-2">⚠ Publishable with Major Revision</h3>
                                    <p className="text-sm text-orange-700">The manuscript has potential but requires substantial revisions such as additional analysis, restructuring of arguments, or significant expansion of certain sections.
                                    Note that the revised manuscript submitted by the author might be reassigned to you or another reviewer for a second review since the revision is major.
                                    </p>
                                </div>
                                
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <h3 className="font-bold text-red-800 mb-2">✗ Not Publishable</h3>
                                    <p className="text-sm text-red-700">The manuscript does not meet the standards for publication due to fundamental flaws in methodology, lack of originality, insufficient evidence, or other critical issues.</p>
                                </div>
                            </div>
                        </div>

                        {/* Comments Guidelines */}
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">Writing Review Comments</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Comments for Author</h3>
                                    <p className="text-sm md:text-base text-gray-700 mb-2">Your comments should be:</p>
                                    <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700 ml-4">
                                        <li><strong>Constructive:</strong> Provide specific suggestions for improvement</li>
                                        <li><strong>Respectful:</strong> Maintain a professional and collegial tone</li>
                                        <li><strong>Specific:</strong> Reference particular sections, pages, or arguments</li>
                                        <li><strong>Balanced:</strong> Acknowledge strengths as well as weaknesses</li>
                                        <li><strong>Clear:</strong> Express your concerns and suggestions unambiguously</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Confidential Comments to Editor</h3>
                                    <p className="text-sm md:text-base text-gray-700">
                                        Use this section for any concerns or recommendations you wish to share only with the editor, such as questions about plagiarism, ethical concerns, or your overall assessment of the manuscript's suitability for the journal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Review Timeline */}
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">Review Timeline</h2>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <p className="text-sm md:text-base text-blue-800">
                                    <strong>Standard Review Period:</strong> 3 weeks from assignment<br />
                                    <strong>Reconciliation Review:</strong> 3 weeks from assignment<br /><br />
                                    Please contact the editor if you need an extension or are unable to complete the review.
                                </p>
                            </div>
                        </div>

                        {/* Ethical Considerations */}
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">Ethical Considerations</h2>
                            <div className="space-y-3 text-sm md:text-base text-gray-700">
                                <div className="flex items-start">
                                    <span className="text-purple-600 mr-2">•</span>
                                    <p><strong>Confidentiality:</strong> Treat all manuscripts as confidential documents. Do not share or discuss them with anyone except the editor.</p>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-purple-600 mr-2">•</span>
                                    <p><strong>Conflict of Interest:</strong> Disclose any potential conflicts of interest to the editor immediately.</p>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-purple-600 mr-2">•</span>
                                    <p><strong>Objectivity:</strong> Provide an unbiased evaluation based solely on the manuscript's scholarly merit.</p>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-purple-600 mr-2">•</span>
                                    <p><strong>Timeliness:</strong> Complete your review by the assigned deadline or notify the editor of any delays.</p>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-purple-600 mr-2">•</span>
                                    <p><strong>Plagiarism:</strong> Alert the editor immediately if you suspect plagiarism or other ethical violations.</p>
                                </div>
                            </div>
                        </div>

                        {/* Scoring Example */}
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">Scoring Example</h2>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3">Sample Evaluation:</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span>Originality and Innovation</span>
                                        <span className="font-bold text-purple-600">17/20</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Methodology</span>
                                        <span className="font-bold text-purple-600">16/20</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Clarity of Presentation</span>
                                        <span className="font-bold text-purple-600">13/15</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Relevance and Significance</span>
                                        <span className="font-bold text-purple-600">12/15</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Literature Review</span>
                                        <span className="font-bold text-purple-600">8/10</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Results and Analysis</span>
                                        <span className="font-bold text-purple-600">8/10</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Overall Contribution</span>
                                        <span className="font-bold text-purple-600">8/10</span>
                                    </div>
                                    <div className="pt-3 border-t-2 border-gray-300 flex justify-between items-center font-bold text-lg">
                                        <span>Total Score:</span>
                                        <span className="text-purple-700">82/100</span>
                                    </div>
                                </div>
                                <div className="mt-9 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <p className="text-lg text-yellow-800">
                                        <strong>Decision:</strong> Publishable with Minor Revision
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-bold text-gray-800 mb-2">Comments for Author:</h3>
                                    <div className="p-3 bg-gray-100 border border-gray-300 rounded">
                                        <p className="text-sm text-gray-700">
                                            This is a well-researched and engaging paper that makes a valuable contribution to the field. The methodology is robust and the central argument is compelling. I have a few suggestions for improvement:
                                            <br /><br />
                                            1.  **Clarity in Section 3:** The transition between your discussion of colonial-era policies and post-independence reforms could be clearer. Consider adding a paragraph that explicitly bridges these two historical periods.
                                            <br />
                                            2.  **Literature Engagement:** While the literature review is comprehensive, I encourage you to engage more deeply with the works of Okoro (2021) and Adebayo (2019), as their research directly challenges some of your secondary arguments.
                                            <br />
                                            3.  **Typographical Errors:** I noticed a few minor typos on pages 5 and 12. A final proofread would be beneficial.
                                            <br /><br />
                                            Overall, this is an excellent manuscript, and I look forward to seeing the revised version.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h3 className="font-bold text-gray-800 mb-2">Confidential Comments to Editor:</h3>
                                    <div className="p-3 bg-gray-100 border border-gray-300 rounded">
                                        <p className="text-sm text-gray-700">
                                            The author has done a commendable job, and the manuscript is nearly ready for publication. My primary concern is the need for a more direct engagement with recent scholarship that offers counterarguments to their claims. If the author can address this in their revision, I believe the paper will be a strong addition to the journal. I have no ethical concerns to report.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-purple-50 border-l-4 border-purple-600 p-4 md:p-6 rounded">
                            <h2 className="text-lg md:text-xl font-bold text-purple-900 mb-2">Questions or Concerns?</h2>
                            <p className="text-sm md:text-base text-purple-800">
                                If you have any questions about the review process or need clarification on any aspect of your assignment, please contact the editorial office at <a href="mailto:ubjh@uniben.edu" className="underline font-medium">ubjh@uniben.edu</a>
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
                            <p>© {new Date().getFullYear()} University of Benin Journal of Humanities. All rights reserved.</p>
                            <p className="mt-2">Thank you for your valuable contribution to scholarly publishing.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}