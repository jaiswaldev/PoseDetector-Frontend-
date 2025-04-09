import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const FileUploadForm = ({ onSuccess, onError, loading, setLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);
  const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/image`;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file');
      return;
    }

    // Validate file size
    if(file.size > MAX_FILE_SIZE){
      onError('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setSelectedFile(file);
    onError(null);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      onError('Please select a file first');
      return;
    }

    setLoading(true);
    try {
      const base64Image = await readFileAsBase64(selectedFile);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      onSuccess(result);
      onError(null);
      
      // Reset form
      setSelectedFile(null);
      setPreview('');
      fileInputRef.current.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      onError(error.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col items-center gap-4"
    >
      <div className="w-full">
        <label 
          htmlFor="imageInput"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Upload Image
        </label>
        
        {/* File Preview */}
        {preview && (
          <div className="mb-4 border rounded-lg overflow-hidden">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-contain"
            />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="block w-full text-sm text-gray-500 items-center
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-[#4a5568] file:text-white
            hover:file:bg-[#2d3748]"
        />
        <p className="mt-1 text-sm text-gray-500">
          PNG, JPG up to 10MB
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`bg-[#4a5568] text-white px-4 py-2 rounded 
          hover:bg-[#2d3748] transition-colors
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : 'Detect Pose'}
      </button>
    </form>
  );
};

FileUploadForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default FileUploadForm;