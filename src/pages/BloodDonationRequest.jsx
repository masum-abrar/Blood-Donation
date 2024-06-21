import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../providers/AuthProviders';
import { useAxiosSecure } from '../hooks/useAxiosSecure';

export const BloodDonationRequest = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: donations = [], isLoading, error } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/alldonationrequests');
      console.log("API Response:", res.data); // Debugging log
      return Array.isArray(res.data) ? res.data.filter(donation => donation.status === 'pending') : []; // Filter to show only pending requests
    },
    // enabled: !!user, // Ensures the query only runs if the user is available
  });

  if (isLoading) {
    return <p>Loading...</p>; // Show loading indicator while fetching data
  }

  if (error) {
    return <p>Error fetching donation requests: {error.message}</p>; // Show error message
  }

  if (!Array.isArray(donations)) {
    return <p>Error: Unexpected response format</p>; // Handle unexpected response format
  }

  return (
    <div className="container mx-auto p-4 relative top-20">
      <h2 className="text-5xl mb-6">Pending Donation Requests: {donations.length}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {donations.map((donation, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">{donation.recipientName}</h3>
            <p className="text-gray-700"><strong>Location:</strong> {donation.recipientDistrict}, {donation.recipientUpazila}</p>
            <p className="text-gray-700"><strong>Date:</strong> {donation.donationDate}</p>
            <p className="text-gray-700"><strong>Time:</strong> {donation.donationTime}</p>
            <Link to={`/details/${donation._id}`}>
              <button 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
