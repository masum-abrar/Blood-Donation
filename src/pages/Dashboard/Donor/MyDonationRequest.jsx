import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';

export const MyDonationRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'inprogress', 'done', 'canceled'

  const { data: donations = [], isLoading, error } = useQuery({
    queryKey: ['donationRequests', user?.email],
    queryFn: async () => {
      let endpoint = `/requestdonations?requesterEmail=${user.email}`;
      if (filter !== 'all') {
        endpoint += `&status=${filter}`;
      }
      const res = await axiosSecure.get(endpoint);
      return res.data;
    },
    enabled: !!user?.email, // Ensures the query only runs if user email is available
  });

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosSecure.patch(`/donationrequests/${id}`, { status });
      queryClient.invalidateQueries(['donationRequests', user?.email]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Updated donation request successfully!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error updating donation request:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update donation request",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/donationrequests/${id}`);
      queryClient.invalidateQueries(['donationRequests', user?.email]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Deleted donation request successfully!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error deleting donation request:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete donation request",
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching donation requests: {error.message}</p>;
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredDonations = filter === 'all' ? donations : donations.filter(donation => donation.status === filter);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">All Donation Requests</h2>
      <div className="mb-4">
        <label className="font-bold mr-2">Filter by Status:</label>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>
      {filteredDonations.length > 0 && (
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
            {filteredDonations.map((donation) => (
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
      )}
      {filteredDonations.length === 0 && (
        <p>No donation requests found.</p>
      )}
    </div>
  );
};
