import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useAxiosSecure } from '../hooks/useAxiosSecure'; // Ensure you have this custom hook implemented
import { Link, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Login } from './Login';

export const GiveFund = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch funds from the backend
  const { data: funds, isLoading, error } = useQuery({
    queryKey: ['funds'],
    queryFn: async () => {
      const response = await axiosSecure.get('/payments');
      return response.data;
    },
    
  });
  if (!user) {
    return <Login></Login>
   
    
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch funds. Please try again.',
    });
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4 relative top-12">
      <h2 className="text-3xl font-bold mb-4 text-center">All Funding</h2>
      <Link  to="/funding"><button className='btn btn-primary ml-[1120px] mb-9'>Give Fund</button></Link>

      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">User Name</th>
              <th className="border px-4 py-2">Fund Amount</th>
              <th className="border px-4 py-2">Funding Date</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund) => (
              <tr key={fund._id}>
                <td className="border px-4 py-2">{fund.name}</td>
                <td className="border px-4 py-2">${fund.amount.toFixed(2)}</td>
                <td className="border px-4 py-2">{new Date(fund.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
