import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../providers/AuthProviders';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';
import { UseAdmin } from '../../../hooks/UseAdmin';

const fetchBlogs = async (axiosSecure, isAdmin) => {
  const endpoint = isAdmin ? '/api/admin/blogs' : '/api/blogs';
  const res = await axiosSecure.get(endpoint);
  return res.data;
};

export const ContentManagement = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [isAdmin] = UseAdmin();

  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ['blogs', user?.email, isAdmin],
    queryFn: () => fetchBlogs(axiosSecure, isAdmin),
    enabled: !!user, // Ensures the query only runs if the user is available
  });

  const handlePublish = async (blog) => {
    if (!isAdmin) {
      Swal.fire({
        title: 'Error',
        text: 'Only admins can publish blogs',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const res = await axiosSecure.patch(`/api/blogs/publish/${blog._id}`);
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${blog.title} has been published!`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error publishing blog:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was an error publishing the blog',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleUnpublish = async (blog) => {
    if (!isAdmin) {
      Swal.fire({
        title: 'Error',
        text: 'Only admins can unpublish blogs',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const res = await axiosSecure.patch(`/api/blogs/unpublish/${blog._id}`);
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${blog.title} has been unpublished!`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error unpublishing blog:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was an error unpublishing the blog',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleDelete = async (blog) => {
    if (!isAdmin) {
      Swal.fire({
        title: 'Error',
        text: 'Only admins can delete blogs',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const res = await axiosSecure.delete(`/api/blogs/${blog._id}`);
      if (res.data.deletedCount > 0) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${blog.title} has been deleted!`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was an error deleting the blog',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>; // Show loading indicator while fetching data
  }

  if (error) {
    return <p>Error fetching blogs: {error.message}</p>; // Show error message if fetching data fails
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Link to="/dashboard/content-management/add-blog">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Blog
          </button>
        </Link>
      </div>
      <h2 className="text-5xl mb-6">All Blogs: {blogs.length}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
            <img src={blog.thumbnail} alt={blog.title} className="w-full h-40 object-cover mb-2 rounded-lg" />
            <p className="text-gray-700">{blog.content.slice(0, 150)}...</p>
            <div className="flex justify-between mt-4">
              <div className="flex space-x-2">
                {isAdmin && (
                  <>
                    {blog.status === 'draft' ? (
                      <button
                        onClick={() => handlePublish(blog)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnpublish(blog)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Unpublish
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(blog)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
