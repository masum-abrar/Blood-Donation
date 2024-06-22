import React, { useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProviders';
import { useQuery } from '@tanstack/react-query';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import { FaUsers, FaDollarSign, FaHeartbeat } from 'react-icons/fa';

export const AdminHome = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    
    const { data: totalUsers = 0 } = useQuery({
        queryKey: ['totalUsers'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/count');
            return res.data.count;
        }
    });

   
    const { data: totalFunding = 0 } = useQuery({
        queryKey: ['totalFunding'],
        queryFn: async () => {
            const res = await axiosSecure.get('/funds/total');
            return res.data.total;
        }
    });


    const { data: totalRequests = 0 } = useQuery({
        queryKey: ['totalRequests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/requestdonations/count');
            return res.data.count;
        }
    });

    return (
        <div className="container mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">Welcome, {user?.displayName || 'Admin'}!</h1>
                <p className="text-xl mt-2">Here's an overview of the current statistics:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-500 text-white rounded-lg shadow-md">
                    <div className="flex items-center">
                        <FaUsers className="text-4xl mr-4" />
                        <div>
                            <p className="text-2xl font-bold">{totalUsers}</p>
                            <p className="text-lg">Total Donors</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-green-500 text-white rounded-lg shadow-md">
                    <div className="flex items-center">
                        <FaDollarSign className="text-4xl mr-4" />
                        <div>
                            <p className="text-2xl font-bold">${totalFunding}</p>
                            <p className="text-lg">Total Funding</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-red-500 text-white rounded-lg shadow-md">
                    <div className="flex items-center">
                        <FaHeartbeat className="text-4xl mr-4" />
                        <div>
                            <p className="text-2xl font-bold">{totalRequests}</p>
                            <p className="text-lg">Total Blood Donation Requests</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
