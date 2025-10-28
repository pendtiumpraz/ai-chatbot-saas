import { requireRole } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { FiUsers, FiBookOpen, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import Card from '@/components/shared/Card';

export default async function SuperAdminDashboard() {
  await requireRole(['SUPER_ADMIN']);

  // Fetch dashboard statistics
  const [
    totalUsers,
    totalCourses,
    totalPayments,
    recentPayments,
    usersByRole,
    coursesByStatus,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.course.count({ where: { deletedAt: null } }),
    prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    }),
    prisma.payment.findMany({
      where: { status: 'PENDING' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { name: true, email: true } },
      },
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: true,
      where: { deletedAt: null },
    }),
    prisma.course.groupBy({
      by: ['status'],
      _count: true,
      where: { deletedAt: null },
    }),
  ]);

  const totalRevenue = totalPayments._sum.amount || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of system statistics and activities</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900">{totalUsers}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiUsers className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Courses</p>
              <h3 className="text-3xl font-bold text-gray-900">{totalCourses}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiBookOpen className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900">
                Rp {Number(totalRevenue).toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <h3 className="text-3xl font-bold text-gray-900">{recentPayments.length}</h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
          <div className="space-y-3">
            {usersByRole.map((item) => (
              <div key={item.role} className="flex items-center justify-between">
                <span className="text-gray-700">{item.role}</span>
                <span className="font-semibold text-gray-900">{item._count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Courses by Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses by Status</h3>
          <div className="space-y-3">
            {coursesByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-gray-700">{item.status}</span>
                <span className="font-semibold text-gray-900">{item._count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Pending Payments */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Pending Payments</h3>
        {recentPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invoice</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{payment.invoiceNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{payment.student.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Rp {Number(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No pending payments</p>
        )}
      </Card>
    </div>
  );
}
