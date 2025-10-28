'use client';

export default function UsersPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all users in the system</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-medium">
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-sm text-gray-900">John Doe</td>
                <td className="py-4 px-4 text-sm text-gray-600">john@example.com</td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded">
                    STUDENT
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-success-100 text-success-700 text-xs font-semibold rounded">
                    Active
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm mr-3">Edit</button>
                  <button className="text-danger-600 hover:text-danger-700 text-sm">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
