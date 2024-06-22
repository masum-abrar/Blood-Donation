import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useAxiosSecure } from '../hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';

export const AllBlogs = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch blogs from the backend
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await axiosSecure.get('/blogs');
      return response.data;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch blogs. Please try again.',
    });
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4 relative top-12">
         <Helmet>
                <title>Blood | Blog</title>
            </Helmet>
            
      <h2 className="text-3xl font-bold mb-4 text-center">All Blogs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="border rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
            <img src={blog.thumbnail} alt={blog.title} className="w-full h-40 object-cover mb-2 rounded-lg" />
            <p className="text-gray-600 mb-4">{blog.author}</p>
            <p className="text-gray-800">{blog.content.substring(0, 100)}...</p>
            {/* <a href={`/blogs/${blog._id}`} className="text-blue-500 hover:underline mt-4 block">
              Read More
            </a> */}
          </div>
        ))}
      </div>
    </div>
  );
};
