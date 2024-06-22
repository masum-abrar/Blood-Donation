import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaUsers, FaLock, FaUnlock } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import ReactPaginate from "react-paginate";

export const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 6;

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

  // Pagination logic
  const offset = currentPage * usersPerPage;
  const currentPageUsers = filteredUsers.slice(
    offset,
    offset + usersPerPage
  );
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

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
      <ReactPaginate
        previousLabel={"❮"}
        nextLabel={"❯"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
        className="flex justify-center mt-4 space-x-2"
        pageClassName="btn btn-sm"
        previousClassName="btn btn-sm"
        nextClassName="btn btn-sm"
        disabledClassName="btn-disabled"
        
      />
    </div>
  );
};
