import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const OwnerRequests = () => {
  const { axios } = useAppContext();
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchPendingRequests = async () => {
    try {
      // Updated path to match adminRouter.js: '/pending-owners'
      const { data } = await axios.get("/api/admin/pending-owners");
      if (data.success) {
        setPendingUsers(data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch requests.");
    }
  };

  const handleApprove = async (userId) => {
    try {
      // Updated to .post to match adminRouter.js method
      const { data } = await axios.post(`/api/admin/approve-owner/${userId}`);
      if (data.success) {
        toast.success(data.message);
        // Remove the approved user from the local list
        setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve request."
      );
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Pending Owner Requests
      </h2>
      {pendingUsers.length > 0 ? (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {pendingUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="bg-green-500 text-white px-4 py-1.5 rounded-full font-medium hover:bg-green-600 transition-colors shadow-sm"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500">
          No pending requests at this time.
        </div>
      )}
    </div>
  );
};

export default OwnerRequests;
