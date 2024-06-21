import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../providers/AuthProviders';
import { useAxiosSecure } from '../hooks/useAxiosSecure';

export const DonationReqDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { data: donation, isLoading, error } = useQuery({
    queryKey: ['donation', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donationrequests/${id}`);
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async () => {
      await axiosSecure.put(`/donationrequests/${id}`, { status: 'inprogress' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['donation', id]);
      setModalIsOpen(false);
    }
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching donation details: {error.message}</p>;
  }

  const handleDonate = () => {
    mutation.mutate();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Donation Request Details</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <p><strong>Recipient Name:</strong> {donation.recipientName}</p>
        <p><strong>Location:</strong> {donation.recipientDistrict}, {donation.recipientUpazila}</p>
        <p><strong>Date:</strong> {donation.donationDate}</p>
        <p><strong>Time:</strong> {donation.donationTime}</p>
        <p><strong>Request Message:</strong> {donation.requestMessage}</p>
        <p><strong>Status:</strong> {donation.status}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setModalIsOpen(true)}
          disabled={donation.status !== 'pending'}
        >
          Donate
        </button>
      </div>

      {/* Modal */}
      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal modal-open">
            <div className="modal-box">
              <h2 className="text-2xl font-bold mb-4">Confirm Donation</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Donor Name</label>
                  <input
                    type="text"
                    value={user.displayName}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Donor Email</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleDonate}
                  >
                    Confirm Donation
                  </button>
                  <button
                    type="button"
                    className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={() => setModalIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationReqDetails;
