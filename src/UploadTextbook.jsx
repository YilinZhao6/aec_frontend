import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Book, 
  CheckCircle, 
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  RefreshCw,
  LogIn
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './LeftSidebar';
import MobileMenuDrawer from './MobileMenuDrawer';

const UploadTextbook = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [vectorizedBooks, setVectorizedBooks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('user_id'));

  const handleSignOut = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    navigate('/');
  };

  const fetchVectorizedBooks = async () => {
    const userId = localStorage.getItem('user_id') || 'default_user';
    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/get_vectorized_book_info', {
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
        const uploadResponse = await fetch('https://backend-ai-cloud-explains.onrender.com/upload_reference_book', {
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

          const vectorResponse = await fetch('https://backend-ai-cloud-explains.onrender.com/generate_vector_embeddings', {
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
        return 'bg-[#E5E5E5] text-gray-700';
      case 'processed':
        return 'bg-[#E5E5E5] text-gray-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-[#E5E5E5] text-gray-700';
    }
  };

  const allFiles = [...uploadedFiles, ...vectorizedBooks]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative min-h-screen bg-[#F0F0F0]">
      <div className="hidden sm:block">
        <SidebarTrigger 
          onHomeClick={() => navigate('/')}
          onProfileClick={() => navigate('/profile')}
          onArchivesClick={() => navigate('/archive')}
          onUploadClick={() => navigate('/upload')}
        />
      </div>

      <div className="sm:hidden fixed top-4 left-4 z-50">
        <MobileMenuDrawer 
          isLoggedIn={isLoggedIn}
          onHomeClick={() => navigate('/')}
          onProfileClick={() => navigate('/profile')}
          onArchivesClick={() => navigate('/archive')}
          onUploadClick={() => navigate('/upload')}
          onSignOut={handleSignOut}
          onLoginClick={() => navigate('/login')}
        />
      </div>

      {/* Sign In Button - visible on mobile */}
      {!isLoggedIn && (
        <div className="sm:hidden fixed top-4 right-4 z-30">
          <button
            onClick={() => navigate('/login')}
            className="cyber-button bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span className="text-white">Sign In</span>
          </button>
        </div>
      )}

      <div className="w-[65%] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Upload Textbooks</h1>
          <p className="text-sm text-gray-500 mt-1">Add your reference materials to enhance your learning experience.</p>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search uploads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#EEEEEE] border border-[#CCCCCC] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchVectorizedBooks()}
              className="p-2 bg-[#EEEEEE] hover:bg-[#E5E5E5] rounded-lg text-gray-600"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center mb-8
            transition-all duration-300 ease-in-out
            ${isDragging || isDragActive 
              ? 'border-gray-400 bg-[#E5E5E5]' 
              : 'border-[#CCCCCC] bg-[#EEEEEE]'
            }
            hover:border-gray-400 hover:bg-[#E5E5E5]
          `}
        >
          <input {...getInputProps()} />
          <Upload 
            className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
              isDragging || isDragActive ? 'text-gray-600' : 'text-gray-400'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFiles.map((file) => (
              <div key={file.id} className="bg-[#EEEEEE] rounded-lg border border-[#CCCCCC] overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Book className={`w-6 h-6 ${
                      file.status === 'uploading' || file.status === 'vectorizing' 
                        ? 'text-gray-400' 
                        : file.status === 'processed'
                        ? 'text-gray-400'
                        : 'text-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(file.uploadedAt)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyles(file.status)}`}>
                      {getStatusDisplay(file.status)}
                    </span>
                  </div>

                  {(file.status === 'uploading' || file.status === 'vectorizing') && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-400 transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadTextbook;