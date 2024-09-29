import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Import Framer Motion

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Avatar: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(''); // Preview for new avatar
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(''); // Store uploaded image URL
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(''); // Store error messages

  // Load avatar URL from the server when the component mounts
  useEffect(() => {
    const fetchAvatar = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      if (!token) return;

      try {
        const res = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        });

        // If the user has an avatar URL, set it
        if (res.data.avatarUrl) {
          setUploadedImageUrl(res.data.avatarUrl);
        }
      } catch (err) {
        console.error('Error fetching avatar:', err);
        setErrorMessage('Error fetching avatar');
      }
    };

    fetchAvatar();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/tiff', 'image/bmp', 'image/webp', 'image/svg+xml', 'image/eps'];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Please upload a valid image file');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage('File size exceeds the 5MB limit');
        return;
      }

      setImage(file);
      setErrorMessage(''); // Clear error message if the file is valid

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!image) return;

    setLoading(true); // Start loading indicator
    setErrorMessage(''); // Clear previous error messages

    const formData = new FormData();
    formData.append('avatar', image);

    const token = localStorage.getItem('token'); // Get the token from localStorage

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token for authentication
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        setUploadedImageUrl(res.data.imageUrl); // Set uploaded image URL
        alert('Image uploaded successfully');
        setImage(null); // Clear selected image after upload
        setImagePreviewUrl('');
      } else {
        setErrorMessage('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading the image:', error);
      setErrorMessage('Error uploading the image');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!uploadedImageUrl) return;

    setLoading(true);

    const token = localStorage.getItem('token'); // Get the token from localStorage

    try {
      const res = await axios.delete(`/api/delete/${uploadedImageUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token for authentication
        },
      });

      if (res.status === 200) {
        setUploadedImageUrl(''); // Clear the uploaded image from display
        alert('Image deleted successfully');
      } else {
        setErrorMessage('Image deletion failed');
      }
    } catch (error) {
      console.error('Error deleting the image:', error);
      setErrorMessage('Error deleting the image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-3/4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* If there is an uploaded image, display it */}
      {uploadedImageUrl && (
        <motion.div className="mt-4 flex flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.p className="text-xs text-green-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            Uploaded Avatar:
          </motion.p>
          <motion.img src={uploadedImageUrl} alt="Uploaded Avatar" className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mt-2" />
          <motion.button
            onClick={handleDelete}
            className="mt-2 py-1.5 px-3 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </motion.button>
        </motion.div>
      )}

      {/* If there is no uploaded image, show the upload options */}
      {!uploadedImageUrl && (
        <motion.label
          htmlFor="avatar-upload"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.1 }}
        >
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreviewUrl ? (
            <motion.img
              src={imagePreviewUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <motion.span initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              Upload Avatar
            </motion.span>
          )}
        </motion.label>
      )}

      {!uploadedImageUrl && (
        <motion.button
          onClick={handleUpload}
          className="mt-4 py-1.5 px-3 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </motion.button>
      )}

      {errorMessage && (
        <motion.p className="mt-2 text-xs text-red-500" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          {errorMessage}
        </motion.p>
      )}

      {loading && (
        <motion.div className="mt-2" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <svg className="animate-spin h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Avatar;
