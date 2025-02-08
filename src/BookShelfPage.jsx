import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Type, Hash } from 'lucide-react';
import MarkdownViewer from './MarkdownViewer';

export default function BookshelfPage() {
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const booksPerPage = 4;

  useEffect(() => {
    const fetchExplanations = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        console.error('User ID is missing in localStorage.');
        setErrorMessage('User ID is missing. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/get_generated_explanations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: userId })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch explanations:', errorText);
          setErrorMessage('Failed to load explanations. Please try again later.');
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (data.success) {
          const transformedBooks = (data.data.articles || []).map(article => ({
            ...article,
            id: article.conversation_id,
            title: article.topic.charAt(0).toUpperCase() + article.topic.slice(1),
            createdAt: article.generated_at,
            readingTime: article.estimated_reading_time,
            wordCount: article.word_count,
            characterCount: article.character_count,
            conversationId: article.conversation_id,
            userId: article.user_id,
            coverColor: getRandomColor()
          }));
          setBooks(transformedBooks);
        } else {
          console.error('API responded with an error:', data.message);
          setErrorMessage(data.message || 'Failed to load explanations.');
        }
      } catch (error) {
        console.error('Error fetching explanations:', error);
        setErrorMessage('An unexpected error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplanations();
  }, []);

  const getRandomColor = () => {
    const colors = [
      'bg-indigo-500', 'bg-emerald-500', 'bg-purple-500', 'bg-blue-500',
      'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-cyan-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handlePrevious = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(books.length - booksPerPage, prev + 1));
  };

  const handleBookClick = async (book) => {
    console.log('Fetching Markdown content for:', book.title);
    try {
      const response = await fetch(`http://localhost:5000/article?user_id=${book.userId}&conversation_id=${book.conversationId}`);
      console.log('Fetch response status:', response.status);

      if (response.ok) {
        const content = await response.text();
        console.log('Fetched Markdown content:', content.slice(0, 200), '...');
        setMarkdownContent(content);
        setSelectedBook(book);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch article content:', errorText);
        setErrorMessage('Failed to load article content. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching article content:', error);
      setErrorMessage('An unexpected error occurred while loading the article.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your knowledge archive...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{errorMessage}</div>
      </div>
    );
  }

  if (selectedBook) {
    return (
      <MarkdownViewer markdownContent={markdownContent} />
    );
  }

  return (
    <div className="h-screen overflow-y-auto flex-1">
      <div className="max-w-[85%] mx-auto p-12">
        <div className="mb-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Knowledge Archive</h1>
            <div className="flex justify-center gap-6 mt-6">
              <div className="px-6 py-2.5 bg-orange-100 text-orange-600 rounded-full text-lg font-medium">
                {books.length} Papers Available
              </div>
              <div className="px-6 py-2.5 bg-purple-100 text-purple-600 rounded-full text-lg font-medium">
                Quick Reads (&lt;10 min)
              </div>
            </div>
          </div>
        </div>

        <div className="relative mb-16">
          <div className="absolute -top-6 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
          
          <div className="flex items-center justify-center mb-10">
            <button
              onClick={handlePrevious}
              disabled={startIndex === 0}
              className={`p-3 rounded-full mr-6 ${
                startIndex === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-orange-500 hover:bg-orange-100'
              }`}
            >
              <ChevronLeft size={32} />
            </button>

            <div className="flex space-x-8 overflow-hidden">
              {books.slice(startIndex, startIndex + booksPerPage).map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className="w-64 cursor-pointer"
                >
                  <div className={`relative h-80 ${book.coverColor} rounded-xl shadow-lg p-6 flex flex-col transition-all duration-300 hover:brightness-110 hover:shadow-xl group`}>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent rounded-t-xl transition-opacity duration-300 group-hover:opacity-30"></div>
                    <BookOpen className="text-white/80 w-12 h-12 mb-3 relative z-10 transition-colors duration-300 group-hover:text-white" />
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 relative z-10 transition-colors duration-300 group-hover:text-white">{book.title}</h3>
                    <div className="mt-auto space-y-3 relative z-10">
                      <div className="flex items-center text-white/80 text-sm transition-colors duration-300 group-hover:text-white">
                        <Clock className="w-4 h-4 mr-2" />
                        {book.readingTime} min read
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Created: {new Date(book.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={startIndex >= books.length - booksPerPage}
              className={`p-3 rounded-full ml-6 ${
                startIndex >= books.length - booksPerPage
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-orange-500 hover:bg-orange-100'
              }`}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">All Papers</h2>
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-8 py-4 sticky top-0 z-20">
              <div className="grid grid-cols-12 gap-4 text-xl font-medium text-gray-500">
                <div className="col-span-4">Title</div>
                <div className="col-span-3">Created</div>
                <div className="col-span-3">Details</div>
              </div>
            </div>
            <div>
              {books.map((book) => (
                <div key={book.id} 
                  className="px-8 py-6 border-t hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <h3 className="font-medium text-gray-900 text-lg mb-1">{book.title}</h3>
                    </div>
                    <div className="col-span-3 text-gray-600">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 mr-2" />
                          {book.readingTime}m
                        </div>
                        <div className="flex items-center">
                          <Type className="w-5 h-5 mr-2" />
                          {book.wordCount}
                        </div>
                        <div className="flex items-center">
                          <Hash className="w-5 h-5 mr-2" />
                          {book.characterCount}
                        </div>
                        <button 
                          onClick={() => handleBookClick(book)}
                          className="px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors duration-150"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}