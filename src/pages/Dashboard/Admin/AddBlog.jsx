import React, { useState, useContext } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../providers/AuthProviders';
import { useAxiosSecure } from '../../../hooks/useAxiosSecure';


export const AddBlog = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [content, setContent] = useState('');

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('https://api.imgbb.com/1/upload?key=abe0afd820806e4f1eb0a17d1f0bb034', formData);
      setThumbnail(response.data.data.url);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to upload thumbnail image',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBlog = { title, thumbnail, content ,status: 'draft' };

    try {
      await axiosSecure.post('/api/blogs', newBlog); // Adjust the endpoint as needed
      Swal.fire({
        title: 'Success',
        text: 'Blog created successfully',
        icon: 'success',
        confirmButtonText: 'Done'
      });
      setTitle('');
      setThumbnail(null);
      setContent('');
    } catch (error) {
      console.error('Error creating blog:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was an error creating the blog',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Blog</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleThumbnailChange}
            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
          {thumbnail && (
            <img src={thumbnail} alt="Thumbnail Preview" className="mt-4 w-32 h-32 object-cover" />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <JoditEditor
            value={content}
            onChange={(newContent) => setContent(newContent)}
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};
