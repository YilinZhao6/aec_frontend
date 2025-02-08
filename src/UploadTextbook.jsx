import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Book, CheckCircle, Loader2 } from 'lucide-react';

const BackgroundIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0">
        <div className="grid grid-cols-8 gap-12 p-8">
          {Array(64).fill(null).map((_, idx) => (
            <div key={idx} className="flex items-center justify-center opacity-[0.15]">
              <Upload className="w-24 h-24 text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
        return 'bg-orange-100 text-orange-700';
      case 'processed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Combine and sort all files by date (latest first)
  const allFiles = [...uploadedFiles, ...vectorizedBooks].sort((a, b) => 
    new Date(b.uploadedAt) - new Date(a.uploadedAt)
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 p-8">
      <BackgroundIcons />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Upload Your Textbook</h1>

        <div
          {...getRootProps()}
          className={`
            relative border-4 border-dashed rounded-xl p-12 text-center
            transition-all duration-300 ease-in-out
            ${isDragging || isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-white'
            }
            hover:border-blue-500 hover:bg-blue-50
          `}
        >
          <input {...getInputProps()} />
          <Upload 
            className={`w-20 h-20 mx-auto mb-4 transition-colors duration-300 ${
              isDragging || isDragActive ? 'text-blue-500' : 'text-gray-400'
            }`} 
          />
          <p className="text-xl font-medium text-gray-700 mb-2">
            Drag and drop your PDF here
          </p>
          <p className="text-gray-500">
            or click to select files
          </p>
        </div>

        {allFiles.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-100">
              {allFiles.map((file) => (
                <div key={file.id} className="p-4 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Book className={`w-8 h-8 ${
                      file.status === 'uploading' || file.status === 'vectorizing' 
                        ? 'text-orange-500' 
                        : file.status === 'processed'
                        ? 'text-green-500'
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
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {(file.status === 'uploading' || file.status === 'vectorizing') && (
                      <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                    )}
                    {file.status === 'processed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
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