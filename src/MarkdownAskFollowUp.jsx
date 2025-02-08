import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Sample conversation data with LaTeX
const sampleConversations = [
  {
    id: 1,
    type: 'user',
    content: "Can you explain the relationship between energy and momentum in special relativity?",
    timestamp: "2024-03-15T10:30:00Z"
  },
  {
    id: 2,
    type: 'assistant',
    content: "In special relativity, the relationship between energy (E) and momentum (p) is given by the famous energy-momentum relation:\n\n$E^2 = (pc)^2 + (mc^2)^2$\n\nwhere:\n- $E$ is the total energy\n- $p$ is the momentum\n- $m$ is the rest mass\n- $c$ is the speed of light\n\nFor a particle at rest ($p = 0$), this reduces to Einstein's famous equation:\n\n$E = mc^2$\n\nThis relationship shows the deep connection between mass and energy in relativistic physics.",
    timestamp: "2024-03-15T10:30:30Z"
  },
  {
    id: 3,
    type: 'user',
    content: "How does this relate to the Lorentz factor?",
    timestamp: "2024-03-15T10:31:00Z"
  },
  {
    id: 4,
    type: 'assistant',
    content: "The Lorentz factor (γ) is central to these relationships. It's defined as:\n\n$\\gamma = \\frac{1}{\\sqrt{1-\\frac{v^2}{c^2}}}$\n\nUsing γ, we can express energy and momentum as:\n\n$E = \\gamma mc^2$\n\n$p = \\gamma mv$\n\nThese equations demonstrate how both energy and momentum increase with velocity, approaching infinity as $v \\to c$. This is why massive objects cannot reach the speed of light - it would require infinite energy!",
    timestamp: "2024-03-15T10:31:30Z"
  }
];

const baseTextStyle = {
  fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  fontSize: '16.8px',
  lineHeight: '1.4',
  letterSpacing: '0.15px',
};

const MarkdownAskFollowUp = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState(sampleConversations);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: "This is a placeholder response. In the actual implementation, this would be replaced with the response from your backend API.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div 
      className={`fixed top-0 right-0 h-full bg-white border-l border-gray-200 shadow-lg transition-all duration-300 ease-in-out z-30 ${
        isOpen ? 'w-[40%]' : 'w-0'
      }`}
      style={baseTextStyle}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-l-lg border border-r-0 border-gray-200 shadow-md"
      >
        {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="h-full flex flex-col bg-gray-50">
          {/* Header */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-gray-700" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900" style={baseTextStyle}>Hyperknow</h2>
                <p className="text-sm text-gray-600" style={baseTextStyle}>Your academic research assistant</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                {message.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-[80%]">
                      <p className="text-gray-900" style={baseTextStyle}>{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 max-w-[90%]">
                    <ReactMarkdown
                      children={message.content}
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      className="prose max-w-none text-gray-800"
                      components={{
                        p: ({node, ...props}) => (
                          <p style={baseTextStyle} {...props} />
                        ),
                        li: ({node, ...props}) => (
                          <li style={baseTextStyle} {...props} />
                        )
                      }}
                    />
                    <div className="mt-2 text-xs text-gray-400" style={baseTextStyle}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Bot className="w-5 h-5" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                style={baseTextStyle}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isTyping}
                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MarkdownAskFollowUp;