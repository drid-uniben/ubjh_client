import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken, saveTokens, saveUserData, clearAllData } from "./indexdb";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Response interfaces matching your backend
export interface LoginResponse {
  success: boolean;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  faculty?: string;
  affiliation?: string;
  orcid?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  user: {
    id: string;
    role: string;
  };
}

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export interface ManuscriptSubmissionData {
  title: string;
  abstract: string;
  keywords: string[];
  submitter: {
    name: string;
    email: string;
    faculty: string;
    affiliation: string;
    orcid?: string;
  };
  coAuthors?: {
    email: string;
    name: string;
    faculty: string;
    affiliation: string;
    orcid?: string;
  }[];
}

export interface ManuscriptSubmissionResponse {
  success: boolean;
  message?: string;
  data?: {
    manuscriptId: string;
  };
}

// Manuscript Interfaces
export interface Manuscript {
  _id: string;
  title: string;
  abstract: string;
  keywords: string[];
  status:
    | "submitted"
    | "under_review"
    | "in_reconciliation"
    | "approved"
    | "rejected"
    | "minor_revision"
    | "major_revision"
    | "revised";
  submitter: {
    _id: string;
    name: string;
    email: string;
    assignedFaculty?: string;
  };
  coAuthors?: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  pdfFile: string;
  revisedPdfFile?: string;
  originPdfFile?: string;
  originRevisedPdfFile?: string;
  createdAt: string;
  updatedAt: string;
  authorRole?: string;
  originalReviewer?: string | object;
  revisionType?: string;
  assignedReviewerCount?: number;
  isReviewProcessCompleted?: boolean;
}

export interface ManuscriptListResponse {
  success: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  data: Manuscript[];
}

export interface ManuscriptDetailResponse {
  success: boolean;
  data: Manuscript;
}

export interface EditManuscriptResponse {
  success: boolean;
  data: Manuscript;
  message?: string;
}

export interface ManuscriptStatistics {
  success: boolean;
  data: {
    total: number;
    byStatus: {
      [key: string]: number;
    };
  };
}

export interface Faculty {
  faculty: string;
  departments: string[];
}

export interface FacultiesResponse {
  success: boolean;
  data: Record<string, string[]>;
}

export interface AssignFacultyRequest {
  faculty: string;
  manuscriptId: string;
}

export interface AssignFacultyResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    assignedFaculty: string;
  };
}

export interface EligibleReviewer {
  _id: string;
  name: string;
  email: string;
  facultyTitle?: string;
  totalReviewsCount?: number;
  completionRate?: number;
}

export interface EligibleReviewersResponse {
  success: boolean;
  data: EligibleReviewer[];
}

export interface AssignReviewerRequest {
  assignmentType: "automatic" | "manual";
  reviewerId?: string;
}

export interface AssignReviewerResponse {
  success: boolean;
  message: string;
  data?: {
    reviewer: {
      id: string;
      name: string;
      email: string;
    };
    dueDate: Date;
  };
}

export interface ReassignReviewRequest {
  assignmentType: "automatic" | "manual";
  newReviewerId?: string;
}

export interface ExistingReviewForReassignment {
  reviewId: string;
  reviewer: {
    name: string;
  };
  reviewType: "human" | "reconciliation";
  status: string;
}

export interface ReassignReviewResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface ReviewerInvitation {
  id: string;
  email: string;
  status: "pending" | "accepted" | "expired" | "added";
  created: string;
  expires: string | null;
  assignedFaculty?: string;
  assignedReviews?: string[];
}

export interface ReviewerInvitationsResponse {
  success: boolean;
  data: ReviewerInvitation[];
}

export interface AddReviewerData {
  email: string;
  name: string;
  faculty: string;
  affiliation: string;
}

export interface AuthorInvitation {
  id: string;
  email: string;
  status: "pending" | "accepted" | "expired" | "added";
  created: string;
  expires: string | null;
}

export interface AuthorInvitationsResponse {
  success: boolean;
  data: AuthorInvitation[];
}

export interface Author {
  _id: string;
  name: string;
  email: string;
  faculty?: string;
  assignedFaculty?: string;
  affiliation?: string;
  orcid?: string;
  credentialsSent: boolean;
  credentialsSentAt?: string;
  lastLogin?: string;
  manuscriptCount?: number;
  isActive: boolean;
}

export interface AuthorsResponse {
  success: boolean;
  count: number;
  data: Author[];
}

export interface AuthorDetailsResponse {
  success: boolean;
  data: {
    author: Author;
    manuscripts: Manuscript[];
  };
}

export interface AddAuthorData {
  email: string;
  name: string;
  faculty: string;
  affiliation: string;
  orcid?: string;
}

export interface ManuscriptReview {
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

export interface ManuscriptReviewListResponse {
  success: boolean;
  count: number;
  data: ManuscriptReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ReviewDetail {
  _id: string;
  reviewType: "human" | "reconciliation";
  reviewer: {
    _id: string;
    name: string;
  };
  scores: ReviewScores;
  totalScore: number;
  reviewDecision: string;
  status: "in_progress" | "completed" | "overdue";
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  comments: {
    commentsForAuthor?: string;
    confidentialCommentsToEditor?: string;
  };
}

export interface ManuscriptReviewDetails {
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

export interface ManuscriptReviewStatistics {
  success: boolean;
  data: {
    totalWithReviews: number;
    underReview: number;
    reviewed: number;
    inReconciliation: number;
    withDiscrepancy: number;
    completionRate: number;
  };
}

export interface ReviewDecision {
  PUBLISHABLE: "publishable";
  NOT_PUBLISHABLE: "not_publishable";
  PUBLISHABLE_WITH_MINOR_REVISION: "publishable_with_minor_revision";
  PUBLISHABLE_WITH_MAJOR_REVISION: "publishable_with_major_revision";
}

export interface ReviewScores {
  originality: number; // 0-20
  methodology: number; // 0-20
  clarity: number; // 0-15
  relevance: number; // 0-15
  literature: number; // 0-10
  results: number; // 0-10
  contribution: number; // 0-10
}

export interface ManuscriptReviewWithDetails {
  _id: string;
  manuscript: {
    _id: string;
    title: string;
    abstract: string;
    keywords: string[];
    status: string;
    createdAt: string;
    submitter: {
      name: string;
      email: string;
      faculty: string;
      affiliation: string;
    };
    pdfFile: string;
  };
  reviewType: "human" | "reconciliation";
  scores: ReviewScores;
  totalScore: number;
  comments: {
    commentsForAuthor?: string;
    confidentialCommentsToEditor?: string;
  };
  reviewDecision?: string;
  status: "in_progress" | "completed" | "overdue";
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewerDashboardData {
  reviewer: {
    name: string;
    email: string;
    faculty: string;
  };
  statistics: {
    totalAssigned: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
  assignedReviews: Array<{
    _id: string;
    title: string;
    status: string;
    submitter: {
      name: string;
      email: string;
    };
  }>;
  completedReviews: ManuscriptReviewWithDetails[];
  inProgressReviews: ManuscriptReviewWithDetails[];
  overdueReviews: ManuscriptReviewWithDetails[];
}

export interface ReviewerAssignmentsResponse {
  success: boolean;
  count: number;
  data: ManuscriptReviewWithDetails[];
}

export interface ReviewerStatisticsResponse {
  success: boolean;
  data: {
    statistics: {
      totalAssigned: number;
      completed: number;
      pending: number;
      overdue: number;
    };
    recentActivity: ManuscriptReviewWithDetails[];
  };
}

export interface ReviewByIdResponse {
  success: boolean;
  data: ManuscriptReviewWithDetails;
}

export interface SubmitReviewRequest {
  scores: ReviewScores;
  comments: {
    commentsForAuthor?: string;
    confidentialCommentsToEditor?: string;
  };
  reviewDecision: string;
}

export interface SaveReviewProgressRequest {
  scores?: Partial<ReviewScores>;
  comments?: {
    commentsForAuthor?: string;
    confidentialCommentsToEditor?: string;
  };
  reviewDecision?: string;
}

export interface AdminReviewAssignment {
  _id: string;
  manuscript: {
    _id: string;
    title: string;
    status: string;
    createdAt: string;
  };
  reviewType: "human" | "reconciliation";
  status: "in_progress" | "completed" | "overdue";
  dueDate: string;
  completedAt?: string;
  totalScore: number;
}

export interface AdminReviewStatistics {
  totalAssigned: number;
  completed: number;
  pending: number;
  overdue: number;
}

export interface AdminReviewAssignmentsResponse {
  success: boolean;
  count: number;
  data: AdminReviewAssignment[];
}

export interface AdminReviewStatisticsResponse {
  success: boolean;
  data: {
    statistics: AdminReviewStatistics;
    recentActivity: AdminReviewAssignment[];
  };
}

export interface AdminReviewByIdResponse {
  success: boolean;
  data: ManuscriptReviewWithDetails;
}

export interface AdminSubmitReviewRequest {
  scores: ReviewScores;
  comments: {
    commentsForAuthor?: string;
    confidentialCommentsToEditor?: string;
  };
  reviewDecision: string;
}

export interface AdminSaveReviewProgressRequest {
  scores?: Partial<ReviewScores>;
  comments?: {
    commentsForAuthor?: string;
    confidentialCommentsToEditor?: string;
  };
  reviewDecision?: string;
}

export interface RevisedManuscript extends Manuscript {
  revisedPdfFile?: string;
  revisionType?: "minor" | "major";
  originalReviewer?: string;
  revisedFrom?: string;
}

export interface Volume {
  _id: string;
  volumeNumber: number;
  year: number;
  coverImage?: string;
  description?: string;
  publishDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  _id: string;
  volume: string | Volume;
  issueNumber: number;
  publishDate: string;
  description?: string;
  isActive: boolean;
  articleCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorSummary {
  _id: string;
  name: string;
  email: string;
}

export interface PublishedArticle {
  _id: string;
  title: string;
  abstract: string;
  keywords: string[];
  pdfFile: string;
  pdfUrl?: string;
  author: AuthorSummary;
  coAuthors: AuthorSummary[];
  affiliations?: string[];
  correspondingAuthor?: string;
  funding?: string;
  conflictsOfInterest?: string;
  references?: string[];
  manuscriptId?: string;
  publishDate: string;
  doi?: string;
  volume: Volume;
  issue: Issue;
  articleType: string;
  pages?: { start: number; end: number };
  views: { count: number; viewers: string[] };
  downloads: { count: number; downloaders: string[] };
  citations?: number;
  archiveUrls?: {
    internetArchive?: string;
    [key: string]: string | undefined;
  };
  license?: string;
  publicationOptions: {
    doiEnabled: boolean;
    internetArchiveEnabled: boolean;
    emailNotificationEnabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmailSubscriber {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  lastEmailSent?: string;
}

export interface FailedJob {
  _id: string;
  jobType: string;
  articleId: string;
  errorMessage: string;
  errorStack?: string;
  attemptCount: number;
  lastAttemptAt: string;
  data?: unknown;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface EmailRecipient {
  userId: string;
  name: string;
  email: string;
  role: string;
  manuscriptTitle?: string;
  manuscriptId?: string;
  manuscriptStatus?: string;
}

export interface EmailRecipientsResponse {
  success: boolean;
  data: EmailRecipient[];
}

export interface EmailPreviewRequest {
  recipientIds: string[];
  subject: string;
  headerTitle: string;
  bodyContent: string;
  attachments?: File[];
}

export interface EmailPreviewResponse {
  success: boolean;
  data: {
    previewHtml: string;
    previewRecipient: {
      name: string;
      email: string;
    };
    attachments?: Array<{
      filename: string;
      size: number;
      type: string;
    }>;
  };
}

export interface SendCampaignRequest {
  recipientIds: string[];
  subject: string;
  headerTitle: string;
  bodyContent: string;
  attachments?: File[];
}

export interface SendCampaignResponse {
  success: boolean;
  message: string;
  data: {
    sent: number;
    failed: number;
    errors: string[];
  };
}

export interface OverrideStatusRequest {
  status: string;
  reason: string;
  silentUpdate: boolean;
}

export interface OverrideStatusResponse {
  success: boolean;
  message: string;
  data: {
    manuscriptId: string;
    oldStatus: string;
    newStatus: string;
    overrideBy: string;
    reason: string;
  };
}

export interface BackendError {
  message?: string;
  error?: {
    errors?: Record<string, { message: string }>;
  };
  errors?: Array<{ msg?: string; message?: string }>;
}

export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as BackendError;
    
    if (data?.message) return data.message;
    
    if (data?.error?.errors) {
      const messages = Object.values(data.error.errors)
        .map((err) => err.message)
        .filter(Boolean);
      if (messages.length > 0) return messages.join(", ");
    }
    
    if (Array.isArray(data?.errors)) {
      const messages = data.errors.map((err) => err.msg || err.message).filter(Boolean);
      if (messages.length > 0) return messages.join(", ");
    }
    
    return error.message;
  }
  
  if (error instanceof Error) return error.message;
  
  return defaultMessage;
};

// Create API instance
const createApi = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Important for cookie-based auth
    timeout: 10000,
  });

  // Request interceptor - add access token from localStorage
  api.interceptors.request.use(
    async (config) => {
      // Skip auth for login endpoints
      const authEndpoints = [
        "/auth/admin-login",
        "/auth/author-login",
        "/auth/reviewer-login",
        "/auth/refresh-token",
      ];

      const skipAuth = authEndpoints.some((endpoint) =>
        config.url?.includes(endpoint),
      );

      if (!skipAuth) {
        const token = await getToken("accessToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor - handle token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomRequestConfig;

      // If 401 and not already retrying, try to refresh token
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        // Don't retry login requests
        const isLoginRequest = [
          "/auth/admin-login",
          "/auth/author-login",
          "/auth/reviewer-login",
        ].some((endpoint) => originalRequest.url?.includes(endpoint));

        if (isLoginRequest) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing && refreshPromise) {
          try {
            await refreshPromise;
            return api(originalRequest);
          } catch (refreshError) {
            console.error("Error refreshing access token:", refreshError);
            await handleAuthFailure();
            return Promise.reject(error);
          }
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken();

          try {
            await refreshPromise;
            return api(originalRequest);
          } catch (refreshError) {
            console.error("Error refreshing access token:", refreshError);
            await handleAuthFailure();
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
};

const api = createApi(API_URL);

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

// Refresh access token using the cookie-based refresh token
export const refreshAccessToken = async (): Promise<void> => {
  try {
    console.log("Attempting to refresh access token");

    const response = await api.post("/auth/refresh-token", {});

    if (response.data.success && response.data.accessToken) {
      console.log("Token refresh successful");
      await saveTokens(response.data.accessToken);
      return;
    }

    throw new Error("Token refresh failed");
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

let authFailureHandler: (() => Promise<void>) | null = null;

const handleAuthFailure = async () => {
  console.log("Handling authentication failure - clearing tokens");
  await clearAllData();

  if (authFailureHandler) {
    await authFailureHandler();
  } else if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

export const setAuthFailureHandler = (handler: () => Promise<void>) => {
  authFailureHandler = handler;
};

// Auth API methods
export const authApi = {
  // Admin login
  loginAdmin: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/admin-login", credentials);

      if (response.data.success && response.data.accessToken) {
        await saveTokens(response.data.accessToken);
        await saveUserData(response.data.user);
        return response.data;
      }

      throw new Error("Login failed: Invalid response structure");
    } catch (error) {
      console.error("Admin login failed:", error);
      throw error;
    }
  },

  // Author login
  loginAuthor: async (
    credentials: LoginCredentials,
  ): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/author-login", credentials);

      if (response.data.success && response.data.accessToken) {
        await saveTokens(response.data.accessToken);
        await saveUserData(response.data.user);
        return response.data;
      }

      throw new Error("Login failed: Invalid response structure");
    } catch (error) {
      console.error("Author login failed:", error);
      throw error;
    }
  },

  // Reviewer login
  loginReviewer: async (
    credentials: LoginCredentials,
  ): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/reviewer-login", credentials);

      if (response.data.success && response.data.accessToken) {
        await saveTokens(response.data.accessToken);
        await saveUserData(response.data.user);
        return response.data;
      }

      throw new Error("Login failed: Invalid response structure");
    } catch (error) {
      console.error("Reviewer login failed:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout", {});
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      await clearAllData();
    }
  },

  verifyToken: async (): Promise<VerifyTokenResponse> => {
    try {
      const response = await api.get("/auth/verify-token");
      return response.data;
    } catch (error) {
      console.error("Token verification failed:", error);
      throw error;
    }
  },
};

export const manuscriptApi = {
  submitManuscript: async (
    formData: FormData,
  ): Promise<ManuscriptSubmissionResponse> => {
    try {
      const response = await api.post("/submit/manuscript", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Manuscript submission failed:", error);
      throw error;
    }
  },

  reviseManuscript: async (
    manuscriptId: string,
    formData: FormData,
  ): Promise<ManuscriptSubmissionResponse> => {
    try {
      const response = await api.post(
        `/submit/manuscript/${manuscriptId}/revise`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Manuscript revision failed:", error);
      throw error;
    }
  },
};

export const manuscriptAdminApi = {
  // Get all manuscripts with filters
  getManuscripts: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    faculty?: string;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<ManuscriptListResponse> => {
    try {
      const response = await api.get("/admin/manuscripts", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch manuscripts:", error);
      throw error;
    }
  },

  // Get manuscript by ID
  getManuscriptById: async (id: string): Promise<ManuscriptDetailResponse> => {
    try {
      const response = await api.get(`/admin/manuscripts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch manuscript:", error);
      throw error;
    }
  },

  editManuscript: async (
    manuscriptId: string,
    file: File,
  ): Promise<EditManuscriptResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.put(
        `/admin/manuscripts/${manuscriptId}/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Failed to edit manuscript:", error);
      throw error;
    }
  },

  editRevisedManuscript: async (
    manuscriptId: string,
    file: File,
  ): Promise<EditManuscriptResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.put(
        `/admin/manuscripts/${manuscriptId}/edit-revised`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Failed to edit revised manuscript:", error);
      throw error;
    }
  },

  // Get manuscript statistics
  getStatistics: async (): Promise<ManuscriptStatistics> => {
    try {
      const response = await api.get("/admin/statistics");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      throw error;
    }
  },

  // Get faculties with data
  getFacultiesWithData: async (): Promise<FacultiesResponse> => {
    try {
      const response = await api.get("/admin/faculties/data");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch faculties data:", error);
      throw error;
    }
  },

  // Get faculties with manuscripts
  getFacultiesWithManuscripts: async (): Promise<FacultiesResponse> => {
    try {
      const response = await api.get("/admin/faculties-with-manuscripts");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch faculties with manuscripts:", error);
      throw error;
    }
  },

  // Assign faculty to manuscript
  assignFaculty: async (
    data: AssignFacultyRequest,
  ): Promise<AssignFacultyResponse> => {
    try {
      const response = await api.post("/admin/faculties/assign", data);
      return response.data;
    } catch (error) {
      console.error("Failed to assign faculty:", error);
      throw error;
    }
  },

  // Assign reviewer to manuscript
  assignReviewer: async (
    manuscriptId: string,
    data: AssignReviewerRequest,
  ): Promise<AssignReviewerResponse> => {
    try {
      const response = await api.post(
        `/admin/assign-review/${manuscriptId}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to assign reviewer:", error);
      throw error;
    }
  },

  // Get eligible reviewers for manuscript
  getEligibleReviewers: async (
    manuscriptId: string,
  ): Promise<EligibleReviewersResponse> => {
    try {
      const response = await api.get(
        `/admin/assign-review/${manuscriptId}/eligible-reviewers`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch eligible reviewers:", error);
      throw error;
    }
  },

  // Reassign regular review
  reassignRegularReview: async (
    reviewId: string,
    data: ReassignReviewRequest,
  ): Promise<ReassignReviewResponse> => {
    try {
      const response = await api.put(
        `/admin/reassign-review/${reviewId}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to reassign review:", error);
      throw error;
    }
  },

  // Reassign reconciliation review
  reassignReconciliationReview: async (
    reviewId: string,
    data: ReassignReviewRequest,
  ): Promise<ReassignReviewResponse> => {
    try {
      const response = await api.put(
        `/admin/reassign-review/${reviewId}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to reassign reconciliation review:", error);
      throw error;
    }
  },

  // Get existing reviewers for manuscript
  getExistingReviewers: async (
    manuscriptId: string,
  ): Promise<{
    success: boolean;
    data: { reviews: ExistingReviewForReassignment[] };
  }> => {
    try {
      const response = await api.get(
        `/admin/reassign-review/existing-reviewers/${manuscriptId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch existing reviewers:", error);
      throw error;
    }
  },

  // Get manuscripts pending decision (reviewed manuscripts)
  getManuscriptsForDecision: async (params: {
    page?: number;
    limit?: number;
  }): Promise<ManuscriptListResponse> => {
    try {
      const response = await api.get("/admin/decisions", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch manuscripts for decision:", error);
      throw error;
    }
  },

  // Update manuscript status (final decision)
  updateManuscriptStatus: async (
    manuscriptId: string,
    data: { status: string; feedbackComments: string },
  ): Promise<ManuscriptDetailResponse> => {
    try {
      const response = await api.put(
        `/admin/decisions/${manuscriptId}/status`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update manuscript status:", error);
      throw error;
    }
  },

  getEligibleReviewersForRevised: async (
    manuscriptId: string,
  ): Promise<EligibleReviewersResponse> => {
    try {
      const response = await api.get(
        `/admin/reassign-review/eligible-reviewers-revised/${manuscriptId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch eligible reviewers for revised manuscript:",
        error,
      );
      throw error;
    }
  },

  getReassignEligibleReviewers: async (
    manuscriptId: string,
  ): Promise<EligibleReviewersResponse> => {
    try {
      const response = await api.get(
        `/admin/reassign-review/eligible-reviewers/${manuscriptId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch eligible reviewers for revised manuscript:",
        error,
      );
      throw error;
    }
  },
  searchManuscripts: async (
    query: string,
    limit?: number,
  ): Promise<ManuscriptListResponse> => {
    try {
      const response = await api.get("/admin/manuscripts/search", {
        params: { query, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to search manuscripts:", error);
      throw error;
    }
  },

  overrideStatus: async (
    manuscriptId: string,
    data: OverrideStatusRequest,
  ): Promise<OverrideStatusResponse> => {
    try {
      const response = await api.post(
        `/admin/override-decision/${manuscriptId}/override`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to override status:", error);
      throw error;
    }
  },

  getOverrideHistory: async (manuscriptId: string) => {
    try {
      const response = await api.get(
        `/admin/override-decision/${manuscriptId}/override-history`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch override history:", error);
      throw error;
    }
  },
};

// Get all reviewer invitations
export const getReviewerInvitations =
  async (): Promise<ReviewerInvitationsResponse> => {
    try {
      const response = await api.get("/reviewer/invitations");
      return response.data;
    } catch (error) {
      console.error("Error fetching reviewer invitations:", error);
      throw error;
    }
  };

// Invite a reviewer
export const inviteReviewer = async (email: string) => {
  try {
    const response = await api.post("/reviewer/invite", { email });
    return response.data;
  } catch (error) {
    console.error("Error inviting reviewer:", error);
    throw error;
  }
};

// Add reviewer profile directly
export const addReviewerProfile = async (reviewerData: AddReviewerData) => {
  try {
    const response = await api.post("/reviewer/add", reviewerData);
    return response.data;
  } catch (error) {
    console.error("Error adding reviewer profile:", error);
    throw error;
  }
};

// Delete a reviewer
export const deleteReviewer = async (id: string) => {
  try {
    const response = await api.delete(`/reviewer/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting reviewer with ID ${id}:`, error);
    throw error;
  }
};

// Resend reviewer invitation
export const resendReviewerInvitation = async (id: string) => {
  try {
    const response = await api.post(`/reviewer/${id}/resend-invitation`);
    return response.data;
  } catch (error) {
    console.error(
      `Error resending invitation to reviewer with ID ${id}:`,
      error,
    );
    throw error;
  }
};

// Assign faculty to user (reviewer or author)
export const assignFacultyToUser = async (userId: string, faculty: string) => {
  try {
    const response = await api.post("/admin/faculties/assign", {
      faculty,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to assign faculty:", error);
    throw error;
  }
};

// ==================== AUTHOR API FUNCTIONS ====================

// Get all author invitations
export const getAuthorInvitations =
  async (): Promise<AuthorInvitationsResponse> => {
    try {
      const response = await api.get("/author/invitations");
      return response.data;
    } catch (error) {
      console.error("Error fetching author invitations:", error);
      throw error;
    }
  };

// Invite an author
export const inviteAuthor = async (email: string) => {
  try {
    const response = await api.post("/author/invite", { email });
    return response.data;
  } catch (error) {
    console.error("Error inviting author:", error);
    throw error;
  }
};

// Add author profile directly
export const addAuthorProfile = async (authorData: AddAuthorData) => {
  try {
    const response = await api.post("/author/add", authorData);
    return response.data;
  } catch (error) {
    console.error("Error adding author profile:", error);
    throw error;
  }
};

// Delete an author
export const deleteAuthor = async (id: string) => {
  try {
    const response = await api.delete(`/author/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting author with ID ${id}:`, error);
    throw error;
  }
};

// Resend author invitation
export const resendAuthorInvitation = async (id: string) => {
  try {
    const response = await api.post(`/author/${id}/resend-invitation`);
    return response.data;
  } catch (error) {
    console.error(`Error resending invitation to author with ID ${id}:`, error);
    throw error;
  }
};

// Get all authors
export const getAuthors = async (): Promise<AuthorsResponse> => {
  try {
    const response = await api.get("/admin/author-management/authors");
    return response.data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
};

// Get author details
export const getAuthorDetails = async (
  authorId: string,
): Promise<AuthorDetailsResponse> => {
  try {
    const response = await api.get(
      `/admin/author-management/authors/${authorId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching author details for ID ${authorId}:`, error);
    throw error;
  }
};

// Send author credentials
export const sendAuthorCredentials = async (authorId: string) => {
  try {
    const response = await api.post(
      `/admin/author-management/authors/${authorId}/send-credentials`,
    );
    return response.data;
  } catch (error) {
    console.error("Error sending author credentials:", error);
    throw error;
  }
};

// Resend author credentials
export const resendAuthorCredentials = async (authorId: string) => {
  try {
    const response = await api.post(
      `/admin/author-management/authors/${authorId}/resend-credentials`,
    );
    return response.data;
  } catch (error) {
    console.error("Error resending author credentials:", error);
    throw error;
  }
};

export interface CompleteReviewerProfileData {
  name: string;
  faculty: string;
  affiliation: string;
}

export const completeReviewerProfile = async (
  token: string,
  profileData: CompleteReviewerProfileData,
) => {
  try {
    const response = await api.post(
      `/reviewer/complete-profile/${token}`,
      profileData,
    );
    return response.data;
  } catch (error) {
    console.error("Error completing reviewer profile:", error);
    throw error;
  }
};

export interface CompleteAuthorProfileData {
  name: string;
  faculty: string;
  affiliation: string;
  orcid: string;
}

export const completeAuthorProfile = async (
  token: string,
  profileData: CompleteAuthorProfileData,
) => {
  try {
    const response = await api.post(
      `/author/complete-profile/${token}`,
      profileData,
    );
    return response.data;
  } catch (error) {
    console.error("Error completing author profile:", error);
    throw error;
  }
};

export const getAllReviewers = async (params = {}) => {
  try {
    const response = await api.get("/reviewer", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching all reviewers:", error);
    throw error;
  }
};

export const getReviewerById = async (id: string) => {
  try {
    const response = await api.get(`/reviewer/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviewer with ID ${id}:`, error);
    throw error;
  }
};

export const checkOverdueReviews = async () => {
  try {
    const response = await api.get("/admin/assign-review/check-overdue");
    return response.data;
  } catch (error) {
    console.error("Error checking overdue reviews:", error);
    throw error;
  }
};

// Manuscript Review API methods
export const manuscriptReviewApi = {
  // Get all manuscript reviews with pagination and filters
  getAllReviews: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    discrepancy?: string;
  }): Promise<ManuscriptReviewListResponse> => {
    try {
      const response = await api.get("/admin/manuscript-reviews", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch manuscript reviews:", error);
      throw error;
    }
  },

  // Get review details for a specific manuscript
  getReviewDetails: async (
    manuscriptId: string,
  ): Promise<{ success: boolean; data: ManuscriptReviewDetails }> => {
    try {
      const response = await api.get(
        `/admin/manuscript-reviews/${manuscriptId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch review details for manuscript ${manuscriptId}:`,
        error,
      );
      throw error;
    }
  },

  // Get review statistics
  getStatistics: async (): Promise<ManuscriptReviewStatistics> => {
    try {
      const response = await api.get("/admin/manuscript-reviews/statistics");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch review statistics:", error);
      throw error;
    }
  },
};

export const manuscriptReviewerApi = {
  // Get reviewer dashboard
  getReviewerDashboard: async (): Promise<{
    success: boolean;
    data: ReviewerDashboardData;
  }> => {
    try {
      const response = await api.get("/reviewer/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching reviewer dashboard:", error);
      throw error;
    }
  },

  // Get reviewer assignments
  getReviewerAssignments: async (): Promise<ReviewerAssignmentsResponse> => {
    try {
      const response = await api.get("/reviewsys/assignments");
      return response.data;
    } catch (error) {
      console.error("Error fetching reviewer assignments:", error);
      throw error;
    }
  },

  // Get reviewer statistics
  getReviewerStatistics: async (): Promise<ReviewerStatisticsResponse> => {
    try {
      const response = await api.get("/reviewsys/statistics");
      return response.data;
    } catch (error) {
      console.error("Error fetching reviewer statistics:", error);
      throw error;
    }
  },

  // Get review by ID
  getReviewById: async (reviewId: string): Promise<ReviewByIdResponse> => {
    try {
      const response = await api.get(`/reviewsys/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching review with ID ${reviewId}:`, error);
      throw error;
    }
  },

  // Submit review
  submitReview: async (
    reviewId: string,
    reviewData: SubmitReviewRequest,
  ): Promise<{
    success: boolean;
    message: string;
    data: ManuscriptReviewWithDetails;
  }> => {
    try {
      const response = await api.post(
        `/reviewsys/${reviewId}/submit`,
        reviewData,
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  },

  // Save review progress
  saveReviewProgress: async (
    reviewId: string,
    progressData: SaveReviewProgressRequest,
  ): Promise<{
    success: boolean;
    message: string;
    data: ManuscriptReviewWithDetails;
  }> => {
    try {
      const response = await api.patch(
        `/reviewsys/${reviewId}/save-progress`,
        progressData,
      );
      return response.data;
    } catch (error) {
      console.error("Error saving review progress:", error);
      throw error;
    }
  },

  getReviewWithHistory: async (
    reviewId: string,
  ): Promise<{
    success: boolean;
    data: {
      review: ManuscriptReviewWithDetails;
      previousReview?: ReviewDetail;
      isRevised: boolean;
      revisionType?: string;
    };
  }> => {
    try {
      const response = await api.get(`/reviewsys/${reviewId}/with-history`);
      return response.data;
    } catch (error) {
      console.error("Error fetching review with history:", error);
      throw error;
    }
  },

  getReconciliationData: async (
    reviewId: string,
  ): Promise<{
    success: boolean;
    data: {
      review: ManuscriptReviewWithDetails;
      conflictingReviews: Array<{
        reviewerId: string;
        reviewerName: string;
        reviewDecision: string;
        totalScore: number;
        completedAt: string;
      }>;
    };
  }> => {
    try {
      const response = await api.get(
        `/reviewsys/${reviewId}/reconciliation-data`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching reconciliation data:", error);
      throw error;
    }
  },
};

// Admin Review API methods
export const adminReviewApi = {
  // Get admin review assignments
  getAdminAssignments: async (): Promise<AdminReviewAssignmentsResponse> => {
    try {
      const response = await api.get("/admin/reviews");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin assignments:", error);
      throw error;
    }
  },

  // Get admin review statistics
  getAdminStatistics: async (): Promise<AdminReviewStatisticsResponse> => {
    try {
      const response = await api.get("/admin/reviews/statistics");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin statistics:", error);
      throw error;
    }
  },

  // Get admin review by ID
  getAdminReviewById: async (
    reviewId: string,
  ): Promise<AdminReviewByIdResponse> => {
    try {
      const response = await api.get(`/admin/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching admin review with ID ${reviewId}:`, error);
      throw error;
    }
  },

  // Submit admin review
  submitAdminReview: async (
    reviewId: string,
    reviewData: AdminSubmitReviewRequest,
  ): Promise<{
    success: boolean;
    message: string;
    data: ManuscriptReviewWithDetails;
  }> => {
    try {
      const response = await api.post(
        `/admin/reviews/${reviewId}/submit`,
        reviewData,
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting admin review:", error);
      throw error;
    }
  },

  // Save admin review progress
  saveAdminReviewProgress: async (
    reviewId: string,
    progressData: AdminSaveReviewProgressRequest,
  ): Promise<{
    success: boolean;
    message: string;
    data: ManuscriptReviewWithDetails;
  }> => {
    try {
      const response = await api.patch(
        `/admin/reviews/${reviewId}/save`,
        progressData,
      );
      return response.data;
    } catch (error) {
      console.error("Error saving admin review progress:", error);
      throw error;
    }
  },

  getReviewWithHistory: async (
    reviewId: string,
  ): Promise<{
    success: boolean;
    data: {
      review: ManuscriptReviewWithDetails;
      previousReview?: ReviewDetail;
      isRevised: boolean;
      revisionType?: string;
    };
  }> => {
    try {
      const response = await api.get(`/admin/reviews/${reviewId}/with-history`);
      return response.data;
    } catch (error) {
      console.error("Error fetching review with history:", error);
      throw error;
    }
  },

  getReconciliationData: async (
    reviewId: string,
  ): Promise<{
    success: boolean;
    data: {
      review: ManuscriptReviewWithDetails;
      conflictingReviews: Array<{
        reviewerId: string;
        reviewerName: string;
        reviewDecision: string;
        totalScore: number;
        completedAt: string;
      }>;
    };
  }> => {
    try {
      const response = await api.get(
        `/admin/reviews/${reviewId}/reconciliation-data`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching reconciliation data:", error);
      throw error;
    }
  },
};

// ==================== VOLUME API ====================
export const volumeApi = {
  // Create volume
  createVolume: async (formData: FormData) => {
    const response = await api.post("/publication/volumes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Get all volumes
  getVolumes: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }) => {
    const response = await api.get("/publication/volumes", { params });
    return response.data;
  },

  // Get public volumes
  getPublicVolumes: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/publication/public/volumes", { params });
    return response.data;
  },

  // Get volume by ID
  getVolumeById: async (id: string) => {
    const response = await api.get(`/publication/volumes/${id}`);
    return response.data;
  },

  // Update volume
  updateVolume: async (id: string, formData: FormData) => {
    const response = await api.put(`/publication/volumes/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete volume
  deleteVolume: async (id: string) => {
    const response = await api.delete(`/publication/volumes/${id}`);
    return response.data;
  },
};

// ==================== ISSUE API ====================
export const issueApi = {
  // Create issue
  createIssue: async (data: {
    volume: string;
    issueNumber: number;
    description?: string;
    publishDate?: string;
  }) => {
    const response = await api.post("/publication/issues", data);
    return response.data;
  },

  // Get all issues
  getIssues: async (params?: {
    page?: number;
    limit?: number;
    volume?: string;
    isActive?: boolean;
  }) => {
    const response = await api.get("/publication/issues", { params });
    return response.data;
  },

  // Get public issues
  getPublicIssues: async (params?: {
    page?: number;
    limit?: number;
    volume?: string;
  }) => {
    const response = await api.get("/publication/public/issues", { params });
    return response.data;
  },

  // Get issue by ID
  getIssueById: async (id: string) => {
    const response = await api.get(`/publication/issues/${id}`);
    return response.data;
  },

  // Get issues by volume
  getIssuesByVolume: async (volumeId: string) => {
    const response = await api.get(`/publication/volumes/${volumeId}/issues`);
    return response.data;
  },

  // Update issue
  updateIssue: async (
    id: string,
    data: {
      issueNumber?: number;
      description?: string;
      publishDate?: string;
      isActive?: boolean;
    },
  ) => {
    const response = await api.put(`/publication/issues/${id}`, data);
    return response.data;
  },

  // Delete issue
  deleteIssue: async (id: string) => {
    const response = await api.delete(`/publication/issues/${id}`);
    return response.data;
  },
};

// ==================== PUBLICATION API ====================
export const publicationApi = {
  // Get manuscripts ready for publication
  getPendingPublications: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/publication/publications/pending", {
      params,
    });
    return response.data;
  },

  // Publish an article
  publishArticle: async (
    articleId: string,
    data: {
      volumeId: string;
      issueId: string;
      articleType: string;
      pages?: { start: number; end: number };
      publishDate?: string;
      customDOI?: string;
    },
  ) => {
    const response = await api.post(
      `/publication/publications/${articleId}/publish`,
      data,
    );
    return response.data;
  },

  // Create and publish manual article
  createManualArticle: async (formData: FormData) => {
    const response = await api.post(
      "/publication/publications/manual",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  // Get published articles (public)
  getPublishedArticles: async (params?: {
    page?: number;
    limit?: number;
    volumeId?: string;
    issueId?: string;
    articleType?: string;
  }) => {
    const response = await api.get("/publication/articles", { params });
    return response.data;
  },

  // Get single published article (public)
  getPublishedArticle: async (id: string) => {
    const response = await api.get(`/publication/articles/${id}`);
    return response.data;
  },

  // Get articles by volume and issue (public)
  getArticlesByVolumeAndIssue: async (volumeId: string, issueId: string) => {
    const response = await api.get(
      `/publication/volumes/${volumeId}/issues/${issueId}/articles`,
    );
    return response.data;
  },

  // Get current issue (public)
  getCurrentIssue: async () => {
    const response = await api.get("/publication/current-issue");
    return response.data;
  },

  // Get archives (public)
  getArchives: async () => {
    const response = await api.get("/publication/archives");
    return response.data;
  },

  // Search articles
  searchArticles: async (params: {
    query: string;
    limit?: number;
    volumeId?: string;
    issueId?: string;
    volumeNumber?: string;
    issueNumber?: string;
    articleType?: string;
  }) => {
    const response = await api.get("/publication/articles/search", { params });
    return response.data;
  },
};

// ==================== EMAIL SUBSCRIPTION API ====================
export const emailSubscriptionApi = {
  // Subscribe to email alerts (public)
  subscribe: async (email: string) => {
    const response = await api.post("/publication/subscribe", { email });
    return response.data;
  },

  // Unsubscribe from email alerts (public)
  unsubscribe: async (token: string) => {
    const response = await api.get(`/publication/unsubscribe/${token}`);
    return response.data;
  },

  // Get all subscribers (admin)
  getSubscribers: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }) => {
    const response = await api.get("/publication/subscribers", { params });
    return response.data;
  },

  // Get subscriber statistics (admin)
  getStatistics: async () => {
    const response = await api.get("/publication/subscribers/statistics");
    return response.data;
  },
};

// ==================== FAILED JOBS API ====================
export const failedJobsApi = {
  // Get all failed jobs
  getFailedJobs: async (params?: {
    page?: number;
    limit?: number;
    jobType?: string;
    resolved?: boolean;
  }) => {
    const response = await api.get("/publication/failed-jobs", { params });
    return response.data;
  },

  // Get failed job statistics
  getStatistics: async () => {
    const response = await api.get("/publication/failed-jobs/statistics");
    return response.data;
  },

  // Get failed job by ID
  getFailedJobById: async (id: string) => {
    const response = await api.get(`/publication/failed-jobs/${id}`);
    return response.data;
  },

  // Retry a specific failed job
  retryFailedJob: async (id: string) => {
    const response = await api.post(`/publication/failed-jobs/${id}/retry`);
    return response.data;
  },

  // Retry all failed jobs
  retryAllFailedJobs: async () => {
    const response = await api.post("/publication/failed-jobs/retry-all");
    return response.data;
  },

  // Mark failed job as resolved
  markAsResolved: async (id: string) => {
    const response = await api.patch(`/publication/failed-jobs/${id}/resolve`);
    return response.data;
  },

  // Delete resolved jobs
  deleteResolvedJobs: async () => {
    const response = await api.delete("/publication/failed-jobs/resolved");
    return response.data;
  },
};

// ==================== CITATION API ====================
export const citationApi = {
  // Get citation in specific format (public)
  getCitation: async (articleId: string, format: string) => {
    const response = await api.get(
      `/publication/articles/${articleId}/citation`,
      {
        params: { format },
      },
    );
    return response.data;
  },

  // Download citation file (public)
  downloadCitation: async (articleId: string, format: "bibtex" | "ris") => {
    const response = await api.get(
      `/publication/articles/${articleId}/citation/download`,
      {
        params: { format },
        responseType: "blob",
      },
    );
    return response.data;
  },

  // Get all citation formats (public)
  getAllCitations: async (articleId: string) => {
    const response = await api.get(
      `/publication/articles/${articleId}/citations`,
    );
    return response.data;
  },

  // Get indexing metadata (public)
  getIndexingMetadata: async (
    articleId: string,
    format: "json-ld" | "google-scholar" | "oai-pmh",
  ) => {
    const response = await api.get(
      `/publication/articles/${articleId}/metadata`,
      {
        params: { format },
      },
    );
    return response.data;
  },
};

// ==================== EMAIL CAMPAIGN API ====================
export const emailCampaignApi = {
  getRecipients: async (params: {
    role?: string;
    manuscriptStatus?: string;
    search?: string;
  }): Promise<EmailRecipientsResponse> => {
    const response = await api.get("/admin/campaign/recipients", { params });
    return response.data;
  },

  previewEmail: async (
    data: EmailPreviewRequest,
  ): Promise<EmailPreviewResponse> => {
    const formData = new FormData();
    data.recipientIds.forEach((id) => {
      formData.append("recipientIds", id);
    });
    formData.append("subject", data.subject);
    formData.append("headerTitle", data.headerTitle);
    formData.append("bodyContent", data.bodyContent);

    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await api.post("/admin/campaign/preview", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  sendCampaign: async (
    data: SendCampaignRequest,
  ): Promise<SendCampaignResponse> => {
    const formData = new FormData();
    data.recipientIds.forEach((id) => {
      formData.append("recipientIds", id);
    });
    formData.append("subject", data.subject);
    formData.append("headerTitle", data.headerTitle);
    formData.append("bodyContent", data.bodyContent);

    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await api.post("/admin/campaign/send", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export default api;
