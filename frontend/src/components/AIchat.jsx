import { useState } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import sendQueryToGemini from '../geminiapi/Gemini';

export default function AIchat() {
  const [isOpen, setIsOpen] = useState(true);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  if (!isOpen) return null;

  const formatResponse = (text) => {
  
    let formattedText = text
      .replace(/^#\s+(.*$)/gm, '<strong>$1</strong>')    
      .replace(/^##\s+(.*$)/gm, '<strong>$1</strong>')      
      .replace(/^###\s+(.*$)/gm, '<strong>$1</strong>')     
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')     
      .replace(/\*(.*?)\*/g, '<em>$1</em>');                

    
    formattedText = formattedText.replace(/\n/g, '<br />');
    
    return formattedText;
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: text }]);
    setText('');
    setLoading(true);
    
    try {
      const res = await sendQueryToGemini(text);
      const formattedResponse = formatResponse(res);
      setMessages(prev => [...prev, { sender: 'bot', text: formattedResponse }]);
    } catch (error) {
      console.log(error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "Sorry, I couldn't process your request." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-[18%] bottom-4 right-4 sm:top-[13%] sm:bottom-auto h-[70vh] max-h-[600px] w-[90vw] max-w-[400px] bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col z-50 lg:mt-[10px]">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-800 text-white rounded-t-lg">
        <h3 className="font-semibold text-lg">Chatbot</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close chat"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.sender === 'user' 
                  ? 'bg-black text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
              dangerouslySetInnerHTML={{ __html: msg.sender === 'bot' ? msg.text : msg.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') }}
            />
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="max-w-[80%] bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            placeholder="Type your message..."
            className={`flex-1 p-2 border ${isFocused ? 'border-gray-500' : 'border-gray-300'} rounded-lg  transition-all`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && text.trim() && handleSend()}
          />
          <button
            onClick={handleSend}
            className={`bg-[black] text-white p-2.5 rounded-lg hover:bg-[black] transition-colors ${!text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!text.trim() || loading}
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}