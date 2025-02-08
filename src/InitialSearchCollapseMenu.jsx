import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, Globe, Check } from 'lucide-react';

const InitialSearchCollapseMenu = ({ 
  showAdditionalInputs, 
  setShowAdditionalInputs,
  selectedBooks,
  setSelectedBooks,
  enableWebSearch,
  setEnableWebSearch
}) => {
  const [comments, setComments] = useState('');
  const [availableBooks, setAvailableBooks] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [bookError, setBookError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;

      setLoadingBooks(true);
      setBookError('');

      try {
        const response = await fetch('http://localhost:5000/get_vectorized_book_info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        const result = await response.json();

        if (response.ok && result.success && result.data.books) {
          const formattedBooks = result.data.books.map(book => ({
            id: book.book_id,
            title: book.book_id,
            author: book.author || 'Unknown Author'
          }));
          setAvailableBooks(formattedBooks);
        } else {
          setBookError(result.message || 'Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setBookError('Failed to connect to the server');
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
    setIsInitialized(true);
  }, []);

  const toggleBook = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Centered More Options */}
      <div
        onClick={() => setShowAdditionalInputs(!showAdditionalInputs)}
        className="flex items-center justify-center gap-2 text-gray-500 text-lg font-medium cursor-pointer hover:text-gray-700 transition-colors duration-300"
        style={{ backgroundColor: 'transparent' }}
      >
        <span>More Options</span>
        <div className="flex items-center gap-1">
          <ArrowUpCircle
            className={`w-5 h-5 transition-transform duration-300 ${
              showAdditionalInputs ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </div>
      </div>

      {showAdditionalInputs && (
        <div className="space-y-6 mt-4">
          {/* Comments Input */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Do you have any further comments on this topic?
            </label>
            <textarea
              className="w-full h-24 p-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
              placeholder="Tell us what you already know, or want to know about this topic..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          {/* Reference Books Selection */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Select Reference Books</h3>
              <div className="flex items-center space-x-2">
                <Globe
                  className={`w-5 h-5 ${
                    enableWebSearch ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={enableWebSearch}
                    onChange={(e) => setEnableWebSearch(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700">
                    Enable Web Search
                  </span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              {loadingBooks ? (
                <div className="text-center py-4 text-gray-600">Loading books...</div>
              ) : bookError ? (
                <div className="text-center py-4 text-red-600">{bookError}</div>
              ) : availableBooks.length === 0 ? (
                <div className="text-center py-4 text-gray-600">No books available</div>
              ) : (
                availableBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => toggleBook(book.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedBooks.includes(book.id)
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{book.title}</h4>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    {selectedBooks.includes(book.id) && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitialSearchCollapseMenu;