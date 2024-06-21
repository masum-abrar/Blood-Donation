import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import districtData from "../../public/District.json";
import upazilaData from "../../public/Upazila.json";

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const fetchDonationRequests = async ({ queryKey }) => {
  const [_key, { bloodGroup, district, upazila }] = queryKey;
  const { data } = await axios.get('http://localhost:5000/donation-requests', {
    params: { bloodGroup, district, upazila },
  });
  return data;
};

export const Search = () => {
  const queryClient = useQueryClient();

  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [districtOptions, setDistrictOptions] = useState([]);
  const [upazilaOptions, setUpazilaOptions] = useState([]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['donationRequests', { bloodGroup, district, upazila }],
    queryFn: fetchDonationRequests,
    enabled: false, 
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  useEffect(() => {
    
    const districts = districtData.map(district => district.name);
    setDistrictOptions(districts);
  }, []);

  useEffect(() => {
    const upazilas = upazilaData.map(upazila => upazila.name);
    setUpazilaOptions(upazilas);
  }, []);

  return (
    <div>
      <h2 className="text-3xl mb-4 relative p-12 top-12 text-center">Search Donors</h2>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Blood Group</label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">District</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          >
            <option value="">Select District</option>
            {districtOptions.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Upazila</label>
          <select
            value={upazila}
            onChange={(e) => setUpazila(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
            disabled={!district}
          >
            <option value="">Select Upazila</option>
            {upazilaOptions.map((upazila, index) => (
              <option key={index} value={upazila}>
                {upazila}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Search
        </button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {data?.length > 0 ? (
        <div>
          <h3 className="text-2xl mb-4 text-center">Donors List</h3>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Blood Group</th>
                <th className="px-4 py-2">District</th>
                <th className="px-4 py-2">Upazila</th>
              </tr>
            </thead>
            <tbody>
              {data.map((donor) => (
                <tr key={donor._id}>
                  <td className="border px-4 py-2">{donor.recipientName}</td>
                  <td className="border px-4 py-2">{donor.bloodGroup}</td>
                  <td className="border px-4 py-2">{donor.recipientDistrict}</td>
                  <td className="border px-4 py-2">{donor.recipientUpazila}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No donation requests found.</p>
      )}
    </div>
  );
};
