import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import './MarkdownAskFollowUp.css';

const MarkdownAskFollowUp = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState([{
    id: 0,
    type: 'assistant',
    content: "👋 Welcome! If you have any questions about the content or need clarification on specific points, feel free to ask here. I'm here to help you understand better!",
    timestamp: new Date().toISOString()
  }]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userId = localStorage.getItem('current_article_user_id');
    const conversationId = localStorage.getItem('current_article_conversation_id');

    if (!userId || !conversationId) {
      console.error('Missing user_id or conversation_id');
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    setCurrentStreamingMessage('');

    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/ask_question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          conversation_id: conversationId,
          question: newMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        accumulatedResponse += chunk;
        setCurrentStreamingMessage(accumulatedResponse);
      }

      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: accumulatedResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentStreamingMessage('');

    } catch (error) {
      console.error('Error in ask_question:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: "I apologize, but I encountered an error processing your question. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const baseTextStyle = {
    fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  };

  return (
    <>
      {/* Desktop Toggle Button */}
      <button
        onClick={onToggle}
        className={`hidden sm:flex fixed top-[56px] ${isOpen ? 'right-[40%]' : 'right-0'} h-12 px-2 bg-white border-t border-b border-l border-gray-200 
                   items-center justify-center transition-all duration-300 ease-in-out z-20 hover:bg-gray-50`}
        style={{ borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}
      >
        {isOpen ? <ChevronRight className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
      </button>

      {/* Main Panel */}
      <div 
        className={`fixed sm:top-[56px] ${
          isOpen 
            ? 'translate-y-0 bottom-0 right-0 w-full h-[70vh] sm:h-auto sm:inset-auto sm:right-0 sm:bottom-[40px] sm:translate-y-0' 
            : 'translate-y-full sm:hidden'
        } bg-white border-l border-gray-200 shadow-lg transition-all duration-300 ease-in-out z-20 sm:w-[40%]`}
        style={baseTextStyle}
      >
        {isOpen && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Ask Follow-up Questions</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {message.type === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%] shadow-sm">
                        <p className="followup-markdown">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%] shadow-sm">
                        <ReactMarkdown
                          children={message.content}
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          className="followup-markdown"
                        />
                        <div className="mt-1 text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {currentStreamingMessage && (
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%] shadow-sm">
                    <ReactMarkdown
                      children={currentStreamingMessage}
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      className="followup-markdown"
                    />
                  </div>
                </div>
              )}
              {isTyping && !currentStreamingMessage && (
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex space-x-1 bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-white border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent followup-markdown"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isTyping}
                  className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MarkdownAskFollowUp;