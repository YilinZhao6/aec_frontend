import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  RefreshCw, 
  Search,
  Type,
  Hash,
  Clock
} from 'lucide-react';
import { ArchiveMarkdownViewer } from './MarkdownViewer/index.js';
import { SidebarTrigger } from './LeftSidebar';

export default function BookshelfPage() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');

    const fetchExplanations = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://backend-ai-cloud-explains.onrender.com/get_generated_explanations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        if (data.success) {
          const transformedBooks = (data.data.articles || []).map((article, index) => ({
            ...article,
            id: `${article.conversation_id}-${index}`,
            title: article.topic.charAt(0).toUpperCase() + article.topic.slice(1),
            createdAt: article.generated_at,
            readingTime: article.estimated_reading_time,
            wordCount: article.word_count,
            characterCount: article.character_count,
            conversationId: article.conversation_id,
            userId: article.user_id
          }));
          // Sort by most recent first
          transformedBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setBooks(transformedBooks);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplanations();
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    navigate(`/archive/paper/${book.conversationId}`);
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#F0F0F0]">
      {/* Add SidebarTrigger */}
      <SidebarTrigger 
        onHomeClick={() => navigate('/')}
        onProfileClick={() => navigate('/profile')}
        onArchivesClick={() => navigate('/archive')}
        onUploadClick={() => navigate('/upload')}
      />
      
      <div className="w-[65%] mx-auto px-6 py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="text-xl text-gray-600">Loading your knowledge archive...</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Hyperknow Archive</h1>
              <p className="mt-1 text-sm text-gray-500">Access and manage your search history</p>
            </div>

            {/* Search and Controls */}
            <div className="mb-6 flex items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#EEEEEE] border border-[#CCCCCC] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex border border-[#CCCCCC] rounded-md overflow-hidden">
                  <button
                    onClick={() => setView('grid')}
                    className={`px-3 py-2 ${view === 'grid' ? 'bg-[#E5E5E5]' : 'bg-[#EEEEEE] hover:bg-[#E5E5E5]'}`}
                  >
                    <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`px-3 py-2 ${view === 'list' ? 'bg-[#E5E5E5]' : 'bg-[#EEEEEE] hover:bg-[#E5E5E5]'}`}
                  >
                    <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-[#EEEEEE] inline-block p-8 rounded-lg">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">
                    Start exploring topics to build your knowledge archive.
                  </p>
                </div>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    className="group relative bg-[#EEEEEE] border border-[#CCCCCC] rounded-lg p-6 hover:border-gray-400 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(book.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{book.readingTime} min read</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-gray-700">
                      {book.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Type className="w-4 h-4 mr-1" />
                        {book.wordCount.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 mr-1" />
                        {book.characterCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#EEEEEE] border border-[#CCCCCC] rounded-lg divide-y divide-[#CCCCCC]">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    className="flex items-center p-4 hover:bg-[#E5E5E5] cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(book.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {book.readingTime}m
                      </div>
                      <div className="flex items-center">
                        <Type className="w-4 h-4 mr-1" />
                        {book.wordCount.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 mr-1" />
                        {book.characterCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}