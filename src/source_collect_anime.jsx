import React, { useState, useEffect } from 'react';
import { Search, Book, Globe, FileText, GraduationCap, Info } from 'lucide-react';

const SearchLoadingScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const fullText = 'Searching contents from academic sources and internet...';
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setSearchText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        currentIndex = 0;
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      setScrollPosition(prev => (prev + 1) % 20);
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, []);

  const searchResults = [
    {
      title: "Quantum Mechanics: Wave-Particle Duality",
      source: "Journal of Physics - Cambridge University",
      preview: "Recent experiments in quantum mechanics have demonstrated the dual nature of light and matter. The wave-particle duality remains one of the most fascinating phenomena in quantum physics, challenging our classical intuitions...",
      type: "academic"
    },
    {
      title: "Binary Trees: Implementation and Applications",
      source: "ACM Computing Surveys",
      preview: "Binary trees form the backbone of many efficient algorithms and data structures. This comprehensive review explores various implementations, including AVL trees, Red-Black trees, and their applications in modern computing...",
      type: "academic"
    },
    {
      title: "Understanding Stellar Parallax",
      source: "NASA Astrophysics Database",
      preview: "Stellar parallax serves as a fundamental method for measuring distances to nearby stars. By observing a star's apparent change in position from different points in Earth's orbit, astronomers can calculate its distance with remarkable precision...",
      type: "academic"
    },
    {
      title: "Machine Learning in Healthcare",
      source: "MIT Technology Review",
      preview: "Artificial intelligence and machine learning are revolutionizing healthcare diagnostics. Neural networks have shown promising results in early disease detection and personalized treatment recommendations...",
      type: "article"
    },
    {
      title: "The Evolution of Programming Paradigms",
      source: "Stanford Computer Science Department",
      preview: "From imperative to functional programming, the landscape of software development has undergone significant transformations. This paper examines the historical context and future trends in programming paradigms...",
      type: "academic"
    },
    {
      title: "Climate Change: Ocean Acidification",
      source: "Nature Climate Science",
      preview: "Rising CO2 levels are causing unprecedented changes in ocean chemistry. Recent studies indicate accelerated acidification rates in polar regions, threatening marine ecosystems...",
      type: "academic"
    },
    {
      title: "Advanced Data Structures: Skip Lists",
      source: "Journal of Algorithms",
      preview: "Skip lists provide an elegant probabilistic alternative to balanced trees. This analysis explores their performance characteristics and applications in modern databases...",
      type: "academic"
    },
    {
      title: "The Future of Quantum Computing",
      source: "Google Research Blog",
      preview: "Recent breakthroughs in quantum error correction have brought us closer to practical quantum computers. The race for quantum supremacy continues as researchers tackle decoherence challenges...",
      type: "article"
    },
    {
      title: "Neural Networks: Deep Learning Architectures",
      source: "arXiv.org - Computer Science",
      preview: "Transformer architectures have revolutionized natural language processing. This paper presents novel approaches to attention mechanisms and their applications in computer vision...",
      type: "academic"
    },
    {
      title: "Exploring Dark Matter Distribution",
      source: "European Space Agency Research",
      preview: "New gravitational lensing observations provide insights into dark matter distribution in galaxy clusters. The findings challenge existing models of dark matter behavior...",
      type: "academic"
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center overflow-hidden w-full h-full min-h-screen">
      <div className="text-center w-full max-w-4xl px-4 py-8">
        {/* Search Bar Animation */}
        <div className="relative mb-8">
          <div className="h-12 bg-white rounded-full shadow-lg flex items-center px-6 mx-auto border border-orange-100">
            <Search className="w-5 h-5 text-orange-500 mr-3 animate-pulse" />
            <div className="text-orange-900 text-left font-mono">
              {searchText}<span className="animate-pulse">|</span>
            </div>
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* Search Results with Sliding Animation */}
        <div className="space-y-6 mt-12 max-h-96 overflow-hidden relative">
          <div 
            className="space-y-6 transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateY(-${scrollPosition * 80}px)` }}
          >
            {searchResults.map((result, index) => (
              <div 
                key={index} 
                className="flex flex-col items-start space-y-2 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-orange-100"
              >
                <div className="flex items-center space-x-2">
                  {result.type === 'academic' ? (
                    <Book className="w-4 h-4 text-orange-600" />
                  ) : (
                    <Globe className="w-4 h-4 text-amber-600" />
                  )}
                  <h3 className="text-lg font-semibold text-orange-900">{result.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-orange-400" />
                  <p className="text-sm text-orange-600">{result.source}</p>
                </div>
                <p className="text-sm text-orange-700">{result.preview}</p>
              </div>
            ))}
          </div>

          {/* Fade out effect at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-50 to-transparent pointer-events-none"></div>
        </div>

        {/* Subtle Disclaimer at Bottom */}
        <div className="flex items-center justify-center space-x-2 mt-6 text-xs text-orange-400/70">
          <Info className="w-3 h-3" />
          <p className="italic">Sample results shown while searching through all available sources...</p>
        </div>
      </div>
    </div>
  );
};

export default SearchLoadingScreen;