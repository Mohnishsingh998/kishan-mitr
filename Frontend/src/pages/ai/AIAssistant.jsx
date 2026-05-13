import { useState, useRef, useEffect } from 'react';
import { sendRequest } from '../../utils/api';
import { Send, Bot, User, AlertCircle } from 'lucide-react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I am KrishiMitra AI, your farming assistant. Ask me anything about crops, pests, weather, government schemes, or farming techniques!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    const history = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await sendRequest('/ai/chat', 'POST', {
        message: text,
        context: { season: 'kharif', location: 'Madhya Pradesh' },
        history,
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.response }]);
    } catch (err) {
      const errMsg = 'Sorry, I encountered an error. Please try again.';
      setError(errMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Bot className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-earth-800">KrishiMitra AI Assistant</h1>
          <p className="text-sm text-earth-500">Your intelligent farming companion</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-green-600' : 'bg-earth-200'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-earth-700" />
                  )}
                </div>
                <div className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-earth-50 text-earth-800 border border-earth-200'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-earth-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-earth-700" />
                </div>
                <div className="bg-earth-50 border border-earth-200 p-3 rounded-lg">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about farming..."
              disabled={loading}
              className="flex-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
