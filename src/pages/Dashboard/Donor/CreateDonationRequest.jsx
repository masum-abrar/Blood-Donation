import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../providers/AuthProviders';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import district from '../../../../public/District.json'; // Adjust the path as per your project structure
import upazila from '../../../../public/Upazila.json'; // Adjust the path as per your project structure

export const CreateDonationRequest = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [districtOptions, setDistrictOptions] = useState([]);
  const [upazilaOptions, setUpazilaOptions] = useState([]);
 

  useEffect(() => {
    const districts = district.map(district => district.name);
    setDistrictOptions(districts);
}, []);

useEffect(() => {
  const upazilas = upazila.map(upazila => upazila.name);
  setUpazilaOptions(upazilas);
}, []);

  const handleDistrictChange = e => {
    const district = e.target.value;
    setSelectedDistrict(district);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const requesterName = user ? user.displayName : '';
    const requesterEmail = user ? user.email : '';
    const recipientName = form.recipientName.value;
    const recipientDistrict = form.recipientDistrict.value;
    const recipientUpazila = form.recipientUpazila.value;
    const hospitalName = form.hospitalName.value;
    const fullAddress = form.fullAddress.value;
    const donationDate = form.donationDate.value;
    const donationTime = form.donationTime.value;
    const requestMessage = form.requestMessage.value;
    const bloodGroup = form.bloodGroup.value;

    const newDonationRequest = {
      requesterName,
      requesterEmail,
      recipientName,
      recipientDistrict,
      recipientUpazila,
      hospitalName,
      fullAddress,
      donationDate,
      donationTime,
      requestMessage,
      bloodGroup,
      status: 'pending'
    };

    axiosSecure.post("/donation-requests", newDonationRequest)
      .then(res => {
        const data = res.data;
        if (data.insertedId) {
          Swal.fire({
            title: 'Success',
            text: 'Donation Request Created Successfully',
            icon: 'success',
            confirmButtonText: 'Done'
          });
          form.reset();
        }
      })
      .catch(error => {
        console.error('Error creating donation request:', error);
        Swal.fire({
          title: 'Error',
          text: 'There was an error creating the donation request',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      });
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Donation Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Requester Name</label>
          <input
            type="text"
            name="requesterName"
            value={user ? user.displayName : ''}
            readOnly
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Requester Email</label>
          <input
            type="email"
            name="requesterEmail"
            value={user ? user.email : ''}
            readOnly
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            required
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Recipient District</label>
          <select
            name="recipientDistrict"
            required
            onChange={handleDistrictChange}
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Select District</option>
            {districtOptions.map((district, index) => (
                                        <option key={index} value={district}>{district}</option>
                                    ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Recipient Upazila</label>
          <select
            name="recipientUpazila"
            required
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          >
            {upazilaOptions.map((upazila, index) => (
                                        <option key={index} value={upazila}>{upazila}</option>
                                    ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            required
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Address</label>
          <input
            type="text"
            name="fullAddress"
            required
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Donation Date</label>
          <input
            type="date"
            name="donationDate"
            required
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Donation Time</label>
          <input
            type="time"
            name="donationTime"
            required
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Request Message</label>
          <textarea
            name="requestMessage"
            required
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <select
            name="bloodGroup"
            required
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Request
        </button>
      </form>
    </div>
  );
};
