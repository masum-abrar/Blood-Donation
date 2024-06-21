import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

export const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: profile = [], isLoading, refetch } = useQuery({
    queryKey: ['profile', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/user?email=${user.email}`);
      return res.data;
    }
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    // Update editedProfile whenever profile data changes
    if (profile[0]) {
      setEditedProfile({ ...profile[0] });
    }
  }, [profile]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    // Reset editedProfile to current profile when entering edit mode
    if (!isEditMode && profile[0]) {
      setEditedProfile({ ...profile[0] });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosSecure.patch(`/users/${profile[0]?._id}`, editedProfile);

      if (res.data.modifiedCount > 0) {
        refetch();
        setIsEditMode(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Updated ${profile[0]?.name}'s Profile!`,
          showConfirmButton: false,
          timer: 1500
        });
      }
      //  else {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Error",
      //     text: "Failed to update profile",
      //   });
      // }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile",
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const userProfile = profile[0];

  return (
    <div className="p-8">
      <h1 className="text-center text-3xl font-black text-blue-800">My Profile</h1>
      <div className="flex justify-between gap-10 px-16 pr-24 py-12 w-full">
        <div className="w-40 ml-20">
          <img src={userProfile?.image} className="rounded-btn" alt="Avatar" />
        </div>
        <div className="py-12 space-y-4">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block font-bold">Name:</label>
              <input
                type="text"
                name="name"
                value={editedProfile.name || ''}
                readOnly={!isEditMode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-bold">Email:</label>
              <input
                type="email"
                name="email"
                value={editedProfile.email || ''}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-bold">District:</label>
              <input
                type="text"
                name="district"
                value={editedProfile.district || ''}
                readOnly={!isEditMode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-bold">Upazila:</label>
              <input
                type="text"
                name="upazila"
                value={editedProfile.upazila || ''}
                readOnly={!isEditMode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block font-bold">Blood Group:</label>
              <input
                type="text"
                name="bloodGroup"
                value={editedProfile.bloodGroup || ''}
                readOnly={!isEditMode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-full"
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
