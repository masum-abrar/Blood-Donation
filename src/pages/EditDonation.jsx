import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import { useAxiosSecure } from '../hooks/useAxiosSecure';

export const EditDonation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: donationRequest = {}, isLoading, refetch } = useQuery({
    queryKey: ['donationRequest', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donationrequests/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedDonationRequest, setEditedDonationRequest] = useState({});

  useEffect(() => {
    if (donationRequest) {
      setEditedDonationRequest({ ...donationRequest });
    }
  }, [donationRequest]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode && donationRequest) {
      setEditedDonationRequest({ ...donationRequest });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDonationRequest({ ...editedDonationRequest, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasChanges = Object.keys(editedDonationRequest).some(
      (key) => editedDonationRequest[key] !== donationRequest[key]
    );

    if (!hasChanges) {
      Swal.fire({
        icon: 'info',
        title: 'Info',
        text: 'No changes were made',
      });
      return;
    }

    try {
      const res = await axiosSecure.patch(`/donationrequestsall/${id}`, editedDonationRequest);
      console.log('Backend Result:', res.data.result); // Added console log

      if (res.data.result && res.data.result.modifiedCount > 0) {
        refetch();
        setIsEditMode(false);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Updated donation request successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error updating donation request:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update donation request',
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const donation = donationRequest;

  return (
    <div className="p-8">
      <h1 className="text-center text-3xl font-black text-blue-800">Edit Donation Request</h1>
      <div className="flex justify-between gap-10 px-16 pr-24 py-12 w-full">
        <div className="w-40 ml-20">
          <img src={donation.photoURL} className="rounded-btn" alt="Avatar" />
        </div>
        <div className="py-12 space-y-4 w-full">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block font-bold">Recipient Name:</label>
              <input
                type="text"
                name="recipientName"
                value={editedDonationRequest.recipientName || ''}
                readOnly={!isEditMode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-bold">Recipient District:</label>
              <input
                type="text"
                name="recipientDistrict"
                value={editedDonationRequest.recipientDistrict || ''}
                readOnly={!isEditMode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-bold">Recipient Upazila:</label>
              <input
                type="text"
                name="recipientUpazila"
                value={editedDonationRequest.recipientUpazila || ''}
                readOnly={!isEditMode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-bold">Donation Date:</label>
              <input
                type="date"
                name="donationDate"
                value={editedDonationRequest.donationDate || ''}
                readOnly={!isEditMode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-bold">Donation Time:</label>
              <input
                type="time"
                name="donationTime"
                value={editedDonationRequest.donationTime || ''}
                readOnly={!isEditMode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-bold">Status:</label>
              <input
                type="text"
                name="status"
                value={editedDonationRequest.status || ''}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100"
              />
            </div>
            {isEditMode ? (
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={toggleEditMode}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Edit
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
