import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const OwnerRequests = () => {
  const { axios } = useAppContext();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all users with 'Pending' status
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/pending-owners");
      if (data.success) {
        setPendingUsers(data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Approval (Changes role to 'owner' and status to 'Approved')
  const handleApprove = async (userId) => {
    try {
      const { data } = await axios.post(`/api/admin/approve-owner/${userId}`);
      if (data.success) {
        toast.success(data.message);
        // Remove from local list to update UI immediately
        setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve request."
      );
    }
  };

  // 3. Handle Rejection (Keeps role as 'user' and sets status to 'Rejected')
  const handleReject = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to reject this request? The user will be able to apply again."
      )
    ) {
      return;
    }

    try {
      const { data } = await axios.post(`/api/admin/reject-owner/${userId}`);
      if (data.success) {
        toast.success(data.message);
        // Remove from local list
        setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request.");
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Pending Owner Requests
      </h2>

      {pendingUsers.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-sm">
                <th className="px-6 py-4 text-left font-bold">User Details</th>
                <th className="px-6 py-4 text-left font-bold">Email</th>
                <th className="px-6 py-4 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {pendingUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-black">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {user._id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleApprove(user._id)}
                        className="bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 shadow-sm transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 shadow-sm transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No pending requests found.</p>
        </div>
      )}
    </div>
  );
};

export default OwnerRequests;
