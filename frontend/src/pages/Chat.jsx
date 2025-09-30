import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = ({ token }) => {
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      await axios.get("http://localhost:5000/api/health", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      console.warn("Backend connection failed:", error.message);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
    
    const userMessage = { 
      sender: "user", 
      text: message, 
      timestamp,
      id: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat", 
        { message }, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      const aiTimestamp = new Date().toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      });

      const aiMessage = {
        sender: "ai",
        text: res.data.reply,
        timestamp: aiTimestamp,
        id: Date.now() + 1,
        tokens: res.data.tokens_used
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsConnected(true);

    } catch (error) {
      console.error("Chat Error:", error);
      
      let errorMessage = "I apologize, but I'm having trouble processing your request.";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "The request timed out. Please try again with a shorter question.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please check your login status.";
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your network.";
      } else if (error.response?.data?.reply) {
        errorMessage = error.response.data.reply;
      }

      const aiTimestamp = new Date().toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      });

      setMessages(prev => [...prev, {
        sender: "ai",
        text: errorMessage,
        timestamp: aiTimestamp,
        id: Date.now() + 1,
        isError: true
      }]);

      setIsConnected(false);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOptionClick = async (option, displayText) => {
    setMessage(displayText);
    setTimeout(() => handleSend(), 100);
  };

  const resetChat = () => {
    setMessages([]);
    setMessage("");
    setIsTyping(false);
    setShowHelp(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Updated Quick Options for Metallurgy & Mining LCA
  const options = [
    { intent: "material extraction analysis", display: "Raw Material Extraction Analysis", label: "Extraction" },
    { intent: "energy consumption optimization", display: "Energy Consumption Optimization", label: "Energy" },
    { intent: "carbon emission tracking", display: "Carbon & Emission Tracking", label: "Emissions" },
    { intent: "waste management strategies", display: "Waste & Byproduct Management", label: "Waste" },
    { intent: "recycling pathways analysis", display: "Recycling & Reuse Pathways", label: "Recycling" },
    { intent: "circular economy implementation", display: "Circular Economy Strategies", label: "Circularity" },
    { intent: "sustainability metrics calculation", display: "Sustainability Performance Metrics", label: "Metrics" },
    { intent: "environmental impact hotspots", display: "Identify Impact Hotspots", label: "Hotspots" },
    { intent: "process optimization recommendations", display: "Optimization & Eco-Design Tips", label: "Optimize" },
  ];

  // Updated Help Commands for LCA Tool
  const helpCommands = [
    "Material Extraction: Ask about mining processes and environmental impact",
    "Energy Analysis: Request energy consumption breakdowns and efficiency tips",
    "Emission Tracking: Get CO₂ calculations and reduction strategies", 
    "Waste Management: Learn about byproduct handling and minimization",
    "Recycling Analysis: Explore material recovery and circular processes",
    "Sustainability Metrics: Calculate environmental performance indicators",
    "Impact Assessment: Identify environmental hotspots and risks",
    "Process Optimization: Get recommendations for eco-friendly improvements",
    "Regulatory Compliance: Understand environmental standards and requirements"
  ];

  return (
    <div>
      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">Connection Lost</span>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${
          isConnected 
            ? "bg-green-600 hover:bg-green-700 text-white" 
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
      >
        {isChatOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chatbox */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-96 max-w-full h-[600px] bg-gradient-to-br from-gray-900 to-green-800 rounded-lg shadow-xl flex flex-col overflow-hidden z-40">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-black text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-lg font-semibold">LCA Assistant</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-white hover:text-green-300 text-sm transition-all"
              >
                {showHelp ? "Hide" : "Help"}
              </button>
              <button
                onClick={resetChat}
                className="text-white hover:text-green-300 text-sm transition-all"
              >
                Clear
              </button>
              <button
                onClick={checkConnection}
                className="text-white hover:text-green-300 text-sm transition-all"
                title="Check connection"
              >
                ↻
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-opacity-80 bg-black">
            {messages.length === 0 && !showHelp && (
              <div className="text-green-300 text-sm">
                <p className="font-medium mb-2">Welcome to LCA Assistant!</p>
                <p className="text-xs text-gray-400 mb-3">
                  I'm here to help you with Life Cycle Assessment analysis for mining and metallurgy operations.
                </p>
                <p className="font-medium mb-2">Quick Options:</p>
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <button
                      key={option.intent}
                      onClick={() => handleOptionClick(option.intent, option.display)}
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-700 transition-all"
                      disabled={!isConnected}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {showHelp && (
              <div className="bg-gray-900 p-4 rounded-lg shadow-sm text-green-300 text-xs">
                <p className="font-medium mb-2">How to use LCA Assistant:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {helpCommands.map((cmd, idx) => (
                    <li key={idx}>{cmd}</li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="font-medium mb-1">Tips:</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-400">
                    <li>Be specific about materials, processes, or metrics</li>
                    <li>Ask for quantitative analysis when possible</li>
                    <li>Request recommendations for improvements</li>
                  </ul>
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] p-3 rounded-lg text-xs shadow-sm ${
                  msg.sender === "user"
                    ? "bg-green-500 text-white ml-auto rounded-br-none"
                    : `${msg.isError ? 'bg-red-800' : 'bg-gray-800'} text-green-200 rounded-bl-none`
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                  {msg.tokens && (
                    <span className="text-[10px] text-gray-500">{msg.tokens} tokens</span>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="bg-gray-800 p-3 rounded-lg max-w-[75%] text-green-400 text-xs italic flex items-center">
                <span>LCA Assistant is thinking</span>
                <span className="flex ml-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-1 animate-bounce"></span>
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-1 animate-bounce delay-100"></span>
                  <span className="w-1 h-1 bg-green-500 rounded-full animate-bounce delay-200"></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-gray-900 flex items-center">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "Ask about LCA analysis..." : "Connection required..."}
              className="flex-1 p-3 bg-gray-800 text-white rounded-lg text-sm border border-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all resize-none"
              rows="1"
              disabled={!isConnected}
              maxLength={500}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || !isConnected || isTyping}
              className={`ml-2 p-3 rounded-full transition-all ${
                !message.trim() || !isConnected || isTyping
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isTyping ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;