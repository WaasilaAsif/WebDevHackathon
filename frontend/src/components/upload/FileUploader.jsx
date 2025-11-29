import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

const FileUploader = ({ onFileSelect, acceptedTypes = '.pdf', maxSizeMB = 5 }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setErrorMessage('');
    
    if (!selectedFile) return;

    // Check file type
    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setErrorMessage(`Please upload a ${acceptedTypes} file`);
      setUploadStatus('error');
      return;
    }

    // Check file size
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setErrorMessage(`File size must be less than ${maxSizeMB}MB`);
      setUploadStatus('error');
      return;
    }

    setFile(selectedFile);
    setUploadStatus('idle');
    
    // Notify parent component
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress (Developer B will implement actual upload)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemove = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : uploadStatus === 'error'
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-white hover:border-blue-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
        />

        {!file ? (
          <>
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Upload your resume
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <Button onClick={handleBrowseClick} variant="primary">
              Browse Files
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              {acceptedTypes.toUpperCase()} • Max {maxSizeMB}MB
            </p>
          </>
        ) : (
          <div className="space-y-4">
            {/* File Preview */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="text-blue-600" size={32} />
                <div className="text-left">
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {uploadStatus !== 'uploading' && (
                <button
                  onClick={handleRemove}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {uploadStatus === 'uploading' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {/* Status Messages */}
            {uploadStatus === 'success' && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span className="font-medium">Upload successful!</span>
              </div>
            )}

            {uploadStatus === 'error' && errorMessage && (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <AlertCircle size={20} />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Upload Button */}
            {uploadStatus === 'idle' && (
              <Button onClick={handleUpload} variant="primary" fullWidth>
                Upload & Analyze
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;