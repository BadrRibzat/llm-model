'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import CodeBlock from '@/components/CodeBlock';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NovaLogo } from "@/components/NovaLogo";

interface Message {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  artifacts?: {
    type: 'code' | 'text' | 'file';
    language?: string;
    filename?: string;
    content: string;
  }[];
  attachments?: {
    name: string;
    type: string;
    size: number;
    url?: string;
  }[];
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      // Load chat sessions from localStorage
      loadChatSessions();
      // Create new session if none exists
      if (!currentSessionId) {
        createNewSession();
      }
    }
  }, [user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatSessions = () => {
    const saved = localStorage.getItem('chatSessions');
    if (saved) {
      setChatSessions(JSON.parse(saved));
    }
  };

  const saveChatSessions = (sessions: ChatSession[]) => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
    setChatSessions(sessions);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date().toISOString(),
      preview: 'Start a conversation...'
    };
    const updatedSessions = [newSession, ...chatSessions];
    saveChatSessions(updatedSessions);
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  const loadSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      // Load messages for this session (you might want to store messages per session)
      const savedMessages = localStorage.getItem(`messages_${sessionId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([]);
      }
    }
  };

  const updateSessionPreview = (sessionId: string, message: string) => {
    const updatedSessions = chatSessions.map(session =>
      session.id === sessionId
        ? { ...session, preview: message.substring(0, 50) + (message.length > 50 ? '...' : '') }
        : session
    );
    saveChatSessions(updatedSessions);
  };

  const clearChat = () => {
    setMessages([]);
    if (currentSessionId) {
      localStorage.removeItem(`messages_${currentSessionId}`);
      updateSessionPreview(currentSessionId, 'Start a conversation...');
    }
  };

  const regenerateResponse = async (messageId: string) => {
    const messageToRegenerate = messages.find(msg => msg.id === messageId);
    if (!messageToRegenerate) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/chat/', {
        message: messageToRegenerate.message,
      });

      const updatedMessages = messages.map(msg =>
        msg.id === messageId
          ? {
            ...msg,
            response: response.data.response,
            artifacts: response.data.artifacts || [],
            timestamp: new Date().toISOString(),
          }
          : msg
      );

      setMessages(updatedMessages);
      if (currentSessionId) {
        localStorage.setItem(`messages_${currentSessionId}`, JSON.stringify(updatedMessages));
      }
    } catch (error) {
      console.error('Error regenerating response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;

    const userMessage = input.trim();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', userMessage);

      // Add files to form data
      selectedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await axios.post('http://localhost:8000/api/chat/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const attachments = selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }));

      const newMessage: Message = {
        id: Date.now().toString(),
        message: userMessage,
        response: response.data.response,
        artifacts: response.data.artifacts || [],
        attachments: attachments,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput('');
      setSelectedFiles([]);

      // Save to localStorage
      if (currentSessionId) {
        localStorage.setItem(`messages_${currentSessionId}`, JSON.stringify(updatedMessages));
        updateSessionPreview(currentSessionId, userMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareChat = async () => {
    const chatText = messages.map(msg =>
      `User: ${msg.message}\nAI: ${msg.response}\n---`
    ).join('\n');

    try {
      await navigator.clipboard.writeText(chatText);
      alert('Chat copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy chat: ', err);
    }
  };

  const shareMessage = async (message: Message) => {
    const messageText = `User: ${message.message}\nAI: ${message.response}`;
    try {
      await navigator.clipboard.writeText(messageText);
      alert('Message copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy message: ', err);
    }
  };

  const exportToPDF = async () => {
    if (messages.length === 0) return;

    const pdf = new jsPDF();
    let yPosition = 20;

    pdf.setFontSize(16);
    pdf.text('AI Chat Model - Chat Export', 20, yPosition);
    yPosition += 20;

    pdf.setFontSize(10);
    pdf.text(`Exported on ${new Date().toLocaleString()}`, 20, yPosition);
    yPosition += 15;

    messages.forEach((msg, index) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`User:`, 20, yPosition);
      yPosition += 10;

      pdf.setFont('helvetica', 'normal');
      const userLines = pdf.splitTextToSize(msg.message, 170);
      pdf.text(userLines, 20, yPosition);
      yPosition += userLines.length * 5 + 10;

      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.text(`AI:`, 20, yPosition);
      yPosition += 10;

      pdf.setFont('helvetica', 'normal');
      const aiLines = pdf.splitTextToSize(msg.response, 170);
      pdf.text(aiLines, 20, yPosition);
      yPosition += aiLines.length * 5 + 15;
    });

    pdf.save('chat-export.pdf');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="h-screen flex bg-transparent text-slate-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden border-r border-white/10 bg-slate-950/40 backdrop-blur`}>
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-500">@{user?.username}</p>
            </div>
            <button
              onClick={logout}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Sign out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={createNewSession}
            className="w-full mb-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>

          {/* Chat Sessions */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Chats</h3>
            {chatSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => loadSession(session.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${session.id === currentSessionId
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'hover:bg-white/5 text-slate-300'
                  }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-current rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session.title}</p>
                    <p className="text-xs opacity-70 truncate">{session.preview}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 bg-slate-950/35 backdrop-blur p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <NovaLogo />
              <span className="hidden sm:inline-flex text-xs text-slate-300 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                Open Source LLM
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button
                onClick={shareChat}
                disabled={messages.length === 0}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Share entire chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>

              <button
                onClick={clearChat}
                disabled={messages.length === 0}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Clear chat history"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <button
                onClick={exportToPDF}
                disabled={messages.length === 0}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Export chat history as PDF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className={`mx-auto h-16 w-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                Start a conversation
              </h3>
              <p className="text-sm text-slate-500">
                Send a message to begin chatting with NOVA
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-lg border border-white/10 bg-slate-950/40">
                  <h4 className="font-medium mb-2 text-white">💡 Ask anything</h4>
                  <p className="text-sm text-slate-400">Get help with questions, explanations, or creative tasks</p>
                </div>
                <div className="p-4 rounded-lg border border-white/10 bg-slate-950/40">
                  <h4 className="font-medium mb-2 text-white">📎 Upload files</h4>
                  <p className="text-sm text-slate-400">Share documents, images, or data for analysis</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className={`max-w-2xl px-4 py-3 rounded-2xl ${darkMode ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    }`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-white/20 rounded-lg p-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-xs">{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="max-w-4xl w-full">
                    <div className="nova-gradient-frame p-[1px] rounded-2xl nova-neon-shadow">
                      <div className="rounded-2xl bg-slate-950/60 border border-white/10 px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold nova-text">Nova</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-100/95">
                          {msg.response}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigator.clipboard.writeText(msg.response)}
                              className="text-xs px-3 py-1 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-white/10"
                              title="Copy response"
                            >
                              <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </button>
                            <button
                              onClick={() => shareMessage(msg)}
                              className="text-xs px-3 py-1 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-white/10"
                              title="Share message"
                            >
                              <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                              </svg>
                              Share
                            </button>
                            <button
                              onClick={() => regenerateResponse(msg.id)}
                              disabled={loading}
                              className="text-xs px-3 py-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:text-white hover:bg-white/10"
                              title="Regenerate response"
                            >
                              <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Regenerate
                            </button>
                          </div>
                        </div>

                        {/* Display Artifacts */}
                        {msg.artifacts && msg.artifacts.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {msg.artifacts.map((artifact, index) => (
                              <div key={index}>
                                {artifact.type === 'code' && (
                                  <CodeBlock
                                    code={artifact.content}
                                    language={artifact.language}
                                    filename={artifact.filename}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className={`max-w-xs px-4 py-3 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-400'}`}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-400'}`} style={{ animationDelay: '0.1s' }}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-400'}`} style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 bg-slate-950/35 backdrop-blur p-4">
          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Attached files:</p>
              {selectedFiles.map((file, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{file.name}</span>
                      <span className={`text-xs ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading && (input.trim() || selectedFiles.length > 0)) {
                      sendMessage();
                    }
                  }
                }}
                className="w-full px-4 py-3 pr-12 border border-white/10 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-900/50 text-white placeholder-slate-500"
                placeholder="Type your message here... (Shift+Enter for new line)"
                disabled={loading}
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <label className="absolute right-3 top-3 cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.md,.json,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.gif,.svg"
                />
                <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </label>
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || (!input.trim() && selectedFiles.length === 0)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${loading || (!input.trim() && selectedFiles.length === 0)
                  ? "bg-white/10 text-slate-400"
                  : "text-white nova-button nova-neon-shadow hover:shadow-lg"
                }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
          <p className={`mt-3 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            NOVA is trained across 12 domains and 74 niches for high-quality responses • Supports file uploads (PDF, DOC, images, etc.)
          </p>
        </div>
      </div>
    </div>
  );
}

