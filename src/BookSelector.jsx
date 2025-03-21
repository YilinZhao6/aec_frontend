import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Book } from 'lucide-react';

const BookSelector = ({ onBookSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/get_vectorized_book_info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        const data = await response.json();

        if (data.success) {
          setBooks(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <Book className="w-5 h-5 text-blue-600" />
          <span className="text-gray-700 font-medium">Select a Book</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading books...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : books.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No books found</div>
          ) : (
            <div className="p-2">
              {books.map((book, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onBookSelect(book);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <div className="font-medium text-gray-900">{book.title}</div>
                  {book.author && (
                    <div className="text-sm text-gray-500">by {book.author}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSelector;