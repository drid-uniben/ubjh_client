"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { manuscriptAdminApi } from '@/services/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, PieLabelRenderProps } from 'recharts';
import { Loader2, FileText, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface StatisticsData {
  total: number;
  byStatus: {
    [key: string]: number;
  };
}

const STATUS_COLORS = {
  submitted: '#3B82F6',
  under_review: '#F59E0B',
  in_reconciliation: '#8B5CF6',
  approved: '#10B981',
  rejected: '#EF4444',
  minor_revision: '#F97316',
  major_revision: '#DC2626',
  revised: '#06B6D4',
};

const STATUS_LABELS: { [key: string]: string } = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  in_reconciliation: 'In Reconciliation',
  approved: 'Approved',
  rejected: 'Rejected',
  minor_revision: 'Minor Revision',
  major_revision: 'Major Revision',
  revised: 'Revised',
};

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadStatistics = async () => {
      if (!isAuthenticated) return;
      try {
        setIsLoading(true);
        const data = await manuscriptAdminApi.getStatistics();
        setStatistics(data.data);
      } catch (err) {
        console.error('Failed to load statistics:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, [isAuthenticated]);

  const getStatusChartData = () => {
    if (!statistics?.byStatus) return [];
    
    return Object.entries(statistics.byStatus).map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6B7280',
    }));
  };

  const getPieChartData = () => {
    if (!statistics?.byStatus) return [];
    
    return Object.entries(statistics.byStatus)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        name: STATUS_LABELS[status] || status,
        value: count,
        color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6B7280',
      }));
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
            </div>
          ) : statistics ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-journal-maroon">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-journal-rose rounded-md p-3">
                        <FileText className="h-6 w-6 text-journal-maroon" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Manuscripts</dt>
                          <dd>
                            <div className="text-2xl font-bold text-gray-900">{statistics.total}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-blue-500">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Under Review</dt>
                          <dd>
                            <div className="text-2xl font-bold text-gray-900">
                              {(statistics.byStatus.under_review || 0) + (statistics.byStatus.in_reconciliation || 0)}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-green-500">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                          <dd>
                            <div className="text-2xl font-bold text-gray-900">
                              {statistics.byStatus.approved || 0}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-orange-500">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Needs Revision</dt>
                          <dd>
                            <div className="text-2xl font-bold text-gray-900">
                              {(statistics.byStatus.minor_revision || 0) + (statistics.byStatus.major_revision || 0)}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Bar Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Manuscripts by Status</h2>
                    <TrendingUp className="h-5 w-5 text-journal-maroon" />
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getStatusChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {getStatusChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h2>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPieChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: PieLabelRenderProps) => {
                            const { name, percent } = props;
                            return `${name}: ${( (percent as number) * 100).toFixed(0)}%`;
                          }}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getPieChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => router.push('/admin/manuscripts')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-journal-maroon text-white rounded-lg hover:bg-journal-maroon-dark transition-colors"
                  >
                    <FileText className="h-5 w-5" />
                    View All Manuscripts
                  </button>
                  <button
                    onClick={() => router.push('/admin/manuscripts?status=submitted')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Clock className="h-5 w-5" />
                    New Submissions
                  </button>
                  <button
                    onClick={() => router.push('/admin/manuscripts?status=under_review')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    In Review
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </AdminLayout>
  );
}