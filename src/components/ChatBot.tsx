import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, TrendingUp, Sparkles, Brain, BookOpen, Calendar, AlertTriangle, Award } from 'lucide-react';
import { ChatMessage } from '../types';
import { processMessage } from '../utils/chatbot';
import { getCurrentUser } from '../utils/auth';
import { User as UserType } from '../types';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: user?.role === 'teacher' 
        ? "Hi! I'm your AI Teaching Assistant for the Computer Science Department. I can help you analyze attendance patterns, identify at-risk students, generate reports, predict trends, and provide actionable insights. What would you like to know?"
        : "Hi! I'm your personal AI Study Assistant! I can help you track your attendance, provide study tips, analyze your performance, suggest improvements, and answer questions about your Computer Science courses. How can I help you succeed today?",
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse = processMessage(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    user?.role === 'teacher' ? [
      "Show me students at risk",
      "Generate attendance report",
      "Predict next week trends",
      "Best performing students",
      "Subject-wise analysis",
      "Send parent notifications"
    ] : [
      "Check my attendance",
      "Study tips for CS",
      "How to improve grades?",
      "Subject performance",
      "Career guidance",
      "Exam preparation tips"
    ]
  ];

  const getAssistantFeatures = () => {
    if (user?.role === 'teacher') {
      return [
        { icon: TrendingUp, text: "Attendance Analytics", color: "text-blue-600" },
        { icon: AlertTriangle, text: "Risk Assessment", color: "text-red-600" },
        { icon: Brain, text: "Predictive Insights", color: "text-purple-600" },
        { icon: BookOpen, text: "Subject Analysis", color: "text-green-600" }
      ];
    } else {
      return [
        { icon: Calendar, text: "Personal Tracking", color: "text-blue-600" },
        { icon: BookOpen, text: "Study Guidance", color: "text-green-600" },
        { icon: Award, text: "Performance Tips", color: "text-yellow-600" },
        { icon: Brain, text: "Smart Recommendations", color: "text-purple-600" }
      ];
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-2 lg:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm lg:max-w-md h-[500px] lg:h-[600px] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-2 bg-white/20 rounded-full">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></span>
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {user?.role === 'teacher' ? 'AI Teaching Assistant' : 'AI Study Companion'}
              </h3>
              <p className="text-xs opacity-90">
                {user?.role === 'teacher' ? 'CS Department Analytics' : 'Personal Academic Guide'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} max-w-full`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`p-2 rounded-full ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                }`}>
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>
                <div className={`p-2 lg:p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-tr-md'
                    : 'bg-gradient-to-r from-gray-50 to-blue-50 text-gray-800 rounded-tl-md border border-gray-200'
                }`}>
                  {message.type === 'list' && message.data ? (
                    <div>
                      <p className="mb-2 text-sm">{message.message}</p>
                      <div className="space-y-1">
                        {message.data.map((student: any) => (
                          <div key={student.id} className="text-xs lg:text-sm p-2 bg-white/10 rounded-lg">
                            <span className="font-medium">{student.name}</span> - {student.attendancePercentage}%
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-line">{message.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <div className="px-3 lg:px-4 pb-2">
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-600 mb-2 flex items-center">
                <Brain className="h-3 w-3 mr-1" />
                {user?.role === 'teacher' ? 'Teaching Insights:' : 'Study Help:'}
              </p>
              <div className="grid grid-cols-1 gap-1">
                {getAssistantFeatures().map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center text-xs text-gray-600 py-1">
                      <Icon className={`h-3 w-3 mr-2 ${feature.color}`} />
                      {feature.text}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="grid grid-cols-1 gap-2">
              {(Array.isArray(quickQuestions[0]) ? quickQuestions[0] : quickQuestions).slice(0, 4).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs p-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all text-left break-words border border-blue-200 hover:border-blue-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 lg:p-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={user?.role === 'teacher' ? "Ask about students..." : "Ask about your studies..."}
              className="flex-1 p-2 lg:p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-2 lg:p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};