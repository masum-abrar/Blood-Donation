import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { AuthContext } from '../../../providers/AuthProviders';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';

export const DonorHome = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: donations = [], isLoading, error } = useQuery({
    queryKey: ['donations', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/requestdonations?requesterEmail=${user.email}&limit=3`);
      return res.data;
    },
    enabled: !!user?.email, // Ensures the query only runs if user email is available
  });

  const handleUpdateStatus = async (id, status) => {
    await axiosSecure.patch(`/donationrequests/${id}`, { status });
    queryClient.invalidateQueries(['donations', user?.email]);
  };

  const handleDelete = async (id) => {
    await axiosSecure.delete(`/donationrequests/${id}`);
    queryClient.invalidateQueries(['donations', user?.email]);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching donation requests: {error.message}</p>;
  }

  const recentDonations = donations.slice(0, 3); // Only take the first three donations

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Welcome, {user.displayName}</h2>
      {recentDonations.length > 0 && (
        <>
          <h3 className="text-2xl mb-4"> Recent Donation Requests</h3>
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th>Recipient Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.recipientName}</td>
                  <td>{`${donation.recipientDistrict}, ${donation.recipientUpazila}`}</td>
                  <td>{donation.donationDate}</td>
                  <td>{donation.donationTime}</td>
                  <td>{donation.status}</td>
                  <td>
                    {donation.status === 'inprogress' && (
                      <>
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                          onClick={() => handleUpdateStatus(donation._id, 'done')}
                        >
                          Done
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                          onClick={() => handleUpdateStatus(donation._id, 'canceled')}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <Link to={`/edit/${donation._id}`}>
                      <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2">
                        Edit
                      </button>
                    </Link>
                    <button
                      className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
                      onClick={() => handleDelete(donation._id)}
                    >
                      Delete
                    </button>
                    <Link to={`/details/${donation._id}`}>
                      <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {recentDonations.length === 0 ? (
        <p>You have not made any donation requests yet.</p>
      ) : (
        <Link to="/dashboard/my-donation-requests">
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            View All Requests
          </button>
        </Link>
      )}
    </div>
  );
};
