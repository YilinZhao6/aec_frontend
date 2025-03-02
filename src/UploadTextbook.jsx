import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Book, CheckCircle, Loader2 } from 'lucide-react';

const UploadTextbook = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [vectorizedBooks, setVectorizedBooks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const fetchVectorizedBooks = async () => {
    const userId = localStorage.getItem('user_id') || 'default_user';
    try {
      const response = await fetch('http://localhost:5000/get_vectorized_book_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.books) {
          const formattedBooks = data.data.books.map(book => ({
            id: book.book_id,
            name: book.book_id,
            status: 'processed',
            progress: 100,
            uploadedAt: book.vectorized_at,
            size: book.file_size_bytes
          }));
          setVectorizedBooks(formattedBooks);
        }
      }
    } catch (error) {
      console.error('Error fetching vectorized books:', error);
    }
  };

  useEffect(() => {
    fetchVectorizedBooks();
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    const userId = localStorage.getItem('user_id') || 'default_user';
    if (!acceptedFiles.length) {
      console.error("No files to upload.");
      return;
    }

    for (const file of acceptedFiles) {
      const fileInfo = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0,
        uploadedAt: new Date().toISOString()
      };

      setUploadedFiles(prev => [fileInfo, ...prev]);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);

      try {
        const uploadResponse = await fetch('http://localhost:5000/upload_reference_book', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          console.log('Upload successful:', uploadData);
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === fileInfo.id ? { ...f, status: 'vectorizing', progress: 30 } : f
            )
          );

          const vectorResponse = await fetch('http://localhost:5000/generate_vector_embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
          });

          if (vectorResponse.ok) {
            const vectorData = await vectorResponse.json();
            console.log('Vectorization successful:', vectorData);
            setUploadedFiles(prev =>
              prev.map(f =>
                f.id === fileInfo.id ? { ...f, status: 'processed', progress: 100 } : f
              )
            );

            await fetchVectorizedBooks();

            setTimeout(() => {
              setUploadedFiles(prev => prev.filter(f => f.id !== fileInfo.id));
            }, 2000);
          } else {
            throw new Error('Vectorization failed');
          }
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Error in upload or vectorization:', error);
        setUploadedFiles(prev =>
          prev.map(f => (f.id === fileInfo.id ? { ...f, status: 'failed', progress: 0 } : f))
        );
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false)
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'uploading':
        return 'Uploading';
      case 'vectorizing':
        return 'Vectorizing';
      case 'processed':
        return 'Processed';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'uploading':
      case 'vectorizing':
        return 'bg-blue-50 text-blue-700';
      case 'processed':
        return 'bg-emerald-50 text-emerald-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // Combine and sort all files by date (latest first)
  const allFiles = [...uploadedFiles, ...vectorizedBooks].sort((a, b) => 
    new Date(b.uploadedAt) - new Date(a.uploadedAt)
  );

  return (
    <div className="relative min-h-screen bg-white">
      <div className="relative max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Upload Textbooks</h1>
          <p className="text-sm text-gray-500 mt-1">Add your reference materials to enhance your learning experience.</p>
        </div>

        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center mb-8
            transition-all duration-300 ease-in-out
            ${isDragging || isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 bg-white'
            }
            hover:border-blue-400 hover:bg-blue-50
          `}
        >
          <input {...getInputProps()} />
          <Upload 
            className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
              isDragging || isDragActive ? 'text-blue-500' : 'text-blue-400'
            }`} 
          />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drag and drop your PDF here
          </p>
          <p className="text-sm text-gray-500">
            or click to select files
          </p>
        </div>

        {allFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {allFiles.map((file) => (
                <div key={file.id} className="p-4 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Book className={`w-6 h-6 ${
                      file.status === 'uploading' || file.status === 'vectorizing' 
                        ? 'text-blue-500' 
                        : file.status === 'processed'
                        ? 'text-emerald-500'
                        : 'text-red-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatDate(file.uploadedAt)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>{formatFileSize(file.size)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyles(file.status)}`}>
                        {getStatusDisplay(file.status)}
                      </span>
                    </div>
                    {(file.status === 'uploading' || file.status === 'vectorizing') && (
                      <div className="mt-2 relative">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {(file.status === 'uploading' || file.status === 'vectorizing') && (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {file.status === 'processed' && (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadTextbook;