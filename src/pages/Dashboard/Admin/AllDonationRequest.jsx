import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../providers/AuthProviders';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import { UseAdmin } from '../../../hooks/UseAdmin';
import { UseVolunteer } from '../../../hooks/UseVolunteer';

export const AllDonationRequest = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'inprogress', 'done', 'canceled'
  const [isAdmin] = UseAdmin();
  const [isVolunteer] = UseVolunteer();

  const fetchDonations = async (axiosSecure, isAdmin, isVolunteer, filter) => {
    let endpoint;
    if (isAdmin) {
      endpoint = '/admin/donationrequests';
    } else if (isVolunteer) {
      endpoint = '/volunteer/donationrequests';
    } 
    if (filter !== 'all') {
      endpoint += `?status=${filter}`;
    }
    const res = await axiosSecure.get(endpoint);
    return res.data;
  };

  const { data: donations = [], isLoading, error, refetch } = useQuery({
    queryKey: ['donations', filter, isAdmin, isVolunteer],
    queryFn: () => fetchDonations(axiosSecure, isAdmin, isVolunteer, filter),
    enabled: !!user, // Always enabled to fetch data if user is available
  });

  useEffect(() => {
    refetch();
  }, [filter, refetch]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosSecure.patch(`/donationrequests/${id}`, { status });
      queryClient.invalidateQueries(['donations', filter, isAdmin, isVolunteer]);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Updated donation request successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error updating donation request:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update donation request',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/donationrequests/${id}`);
      queryClient.invalidateQueries(['donations', filter, isAdmin, isVolunteer]);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Deleted donation request successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error deleting donation request:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete donation request',
      });
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Ensure donations is an array and filter based on the status
  const filteredDonations = Array.isArray(donations)
    ? (filter === 'all' ? donations : donations.filter(donation => donation.status === filter))
    : [];

  if (isLoading) {
    return <p>Loading...</p>; // Show loading indicator while fetching data
  }

  if (error) {
    return <p>Error fetching donation requests: {error.message}</p>;
  }

  return (
    <div>
      <h2 className="text-5xl mb-6">All Donation Requests: {donations.length}</h2>
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
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Recipient Name</th>
              <th>Recipient Address</th>
              <th>Donation Date</th>
              <th>Donation Time</th>
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
                  {isAdmin && (
                    <Link to={`/edit/${donation._id}`}>
                      <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2">
                        Edit
                      </button>
                    </Link>
                  )}
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
        {filteredDonations.length === 0 && <p>No donation requests found.</p>}
      </div>
    </div>
  );
};
