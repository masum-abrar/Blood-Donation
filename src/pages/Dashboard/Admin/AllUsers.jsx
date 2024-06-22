import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaUsers, FaLock, FaUnlock } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";

export const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 6;

  const fetchUsers = async (axiosSecure) => {
    const res = await axiosSecure.get("/users");
    return res.data;
  };

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ["users", statusFilter],
    queryFn: () => fetchUsers(axiosSecure),
  });

  useEffect(() => {
    refetch();
  }, [statusFilter, refetch]);

  const handleMakeAdmin = async (user) => {
    try {
      await axiosSecure.patch(`/users/admin/${user._id}`);
      queryClient.invalidateQueries(["users", statusFilter]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${user.name} is an Admin Now!`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error making admin:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to make admin",
      });
    }
  };

  const handleMakeVolunteer = async (user) => {
    try {
      await axiosSecure.patch(`/users/volunteer/${user._id}`);
      queryClient.invalidateQueries(["users", statusFilter]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${user.name} is a Volunteer Now!`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error making volunteer:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to make volunteer",
      });
    }
  };

  const handleBlockUser = async (user) => {
    try {
      await axiosSecure.patch(`/users/block/${user._id}`);
      queryClient.invalidateQueries(["users", statusFilter]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${user.name} has been blocked!`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error blocking user:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to block user",
      });
    }
  };

  const handleUnblockUser = async (user) => {
    try {
      await axiosSecure.patch(`/users/unblock/${user._id}`);
      queryClient.invalidateQueries(["users", statusFilter]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${user.name} has been unblocked!`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error unblocking user:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to unblock user",
      });
    }
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(0); 
  };

  const filteredUsers = users.filter((user) => {
    if (statusFilter === "all") return true;
    return user.status === statusFilter;
  });

  const offset = currentPage * usersPerPage;
  const currentPageUsers = filteredUsers.slice(offset, offset + usersPerPage);
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageClick = (direction) => {
    setCurrentPage((prevPage) => {
      if (direction === 'next' && prevPage < pageCount - 1) return prevPage + 1;
      if (direction === 'prev' && prevPage > 0) return prevPage - 1;
      return prevPage;
    });
  };

  if (isLoading) {
    return <p>Loading...</p>; 
  }

  if (error) {
    return <p>Error fetching users: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h2 className="text-3xl">All Users: {filteredUsers.length}</h2>
        <div>
          <label htmlFor="statusFilter" className="mr-2">
            Filter by status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin Role</th>
              <th>Volunteer</th>
              <th>Status</th>
              <th>Block/Unblock</th>
            </tr>
          </thead>
          <tbody>
            {currentPageUsers.map((user, index) => (
              <tr key={user._id}>
                <th>{offset + index + 1}</th>
                <td>
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.role === "admin" ? (
                    "Admin"
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user)}
                      className="btn btn-sm bg-blue-500"
                    >
                      <FaUsers className="text-white text-2xl" />
                    </button>
                  )}
                </td>
                <td>
                  {user.role === "volunteer" ? (
                    "Volunteer"
                  ) : (
                    <button
                      onClick={() => handleMakeVolunteer(user)}
                      className="btn btn-sm bg-blue-500"
                    >
                      <FaUsers className="text-white text-2xl" />
                    </button>
                  )}
                </td>
                <td>{user.status || "Active"}</td>
                <td>
                  {user.status === "blocked" ? (
                    <button
                      onClick={() => handleUnblockUser(user)}
                      className="btn btn-sm bg-green-500"
                    >
                      <FaUnlock className="text-white text-2xl" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlockUser(user)}
                      className="btn btn-sm bg-red-500"
                    >
                      <FaLock className="text-white text-2xl" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageClick('prev')}
          disabled={currentPage === 0}
          className="btn btn-sm"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageClick('next')}
          disabled={currentPage === pageCount - 1}
          className="btn btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};
