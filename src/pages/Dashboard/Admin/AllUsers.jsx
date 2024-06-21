import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaUsers, FaLock, FaUnlock } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";

export const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: users = [], refetch } = useQuery({
    queryKey: ["users", statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleMakeAdmin = (user) => {
    axiosSecure.patch(`/users/admin/${user._id}`).then((res) => {
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${user.name} is an Admin Now!`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleMakeVolunteer = (user) => {
    axiosSecure.patch(`/users/volunteer/${user._id}`).then((res) => {
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${user.name} is a Volunteer Now!`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleBlockUser = (user) => {
    axiosSecure.patch(`/users/block/${user._id}`).then((res) => {
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${user.name} has been blocked!`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleUnblockUser = (user) => {
    axiosSecure.patch(`/users/unblock/${user._id}`).then((res) => {
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${user.name} has been unblocked!`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const filteredUsers = users.filter((user) => {
    if (statusFilter === "all") return true;
    return user.status === statusFilter;
  });

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
            onChange={(e) => setStatusFilter(e.target.value)}
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
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <th>{index + 1}</th>
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
                      <FaUsers className="text-white text-2xl"></FaUsers>
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
                      <FaUsers className="text-white text-2xl"></FaUsers>
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
                      <FaUnlock className="text-white text-2xl"></FaUnlock>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlockUser(user)}
                      className="btn btn-sm bg-red-500"
                    >
                      <FaLock className="text-white text-2xl"></FaLock>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
