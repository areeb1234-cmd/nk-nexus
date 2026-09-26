import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ArrowRight, CornerDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import chatbotData from '../data/chatbot.json';
import { useApp } from '../context/AppContext';

export default function Chatbot() {
  const { isChatOpen, setIsChatOpen } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: chatbotData.greeting,
      action: null
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const responseTimerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  // Rule-based keyword matching algorithm
  const processQuery = (rawQuery) => {
    const query = rawQuery.toLowerCase().trim();
    let bestMatch = null;
    let maxMatchScore = 0;

    for (const intent of chatbotData.intents) {
      let score = 0;
      for (const keyword of intent.keywords) {
        if (query.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }
      if (score > maxMatchScore) {
        maxMatchScore = score;
        bestMatch = intent;
      }
    }

    if (bestMatch && maxMatchScore > 0) {
      return {
        text: bestMatch.response,
        action: bestMatch.action
      };
    } else {
      return {
        text: chatbotData.fallback.response,
        actions: chatbotData.fallback.actions
      };
    }
  };

  useEffect(() => {
    const handlePromptEvent = (event) => {
      const prompt = event.detail?.prompt;
      if (!prompt) return;
      setIsChatOpen(true);
      handleSendMessage(prompt);
    };

    window.addEventListener('freshfind:chat-prompt', handlePromptEvent);
    return () => {
      window.removeEventListener('freshfind:chat-prompt', handlePromptEvent);
      if (responseTimerRef.current) window.clearTimeout(responseTimerRef.current);
    };
  }, []);

  const handleSendMessage = (textToSend = null) => {
    const queryText = (textToSend || inputVal).trim();
    if (!queryText) return;

    // Append user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Keep the response local and predictable while giving the interface a tiny typing beat.
    setIsTyping(true);
    responseTimerRef.current = window.setTimeout(() => {
      const match = processQuery(queryText);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: match.text,
        action: match.action || null,
        actions: match.actions || null
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 420);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        type="button"
        className="chatbot-launcher"
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Toggle FreshFind botanical guide chatbot"
      >
        {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isChatOpen && <span className="chatbot-launcher-ping" />}
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-title">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--color-mint-bright)',
                  color: 'var(--color-forest-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={18} />
              </div>
              <div className="chatbot-header-text">
                <h4>FreshFind Botanical Guide</h4>
                <span>Local Rule-Based Knowledge Engine</span><em className="chatbot-live-status"><i /> Online · Local JSON</em>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              style={{ color: '#FFFFFF', padding: 4 }}
              aria-label="Close chat window"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${
                  msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
                }`}
              >
                {msg.sender === 'bot' && (
                  <span className="chatbot-bubble-avatar" aria-hidden="true">
                    <Sparkles size={12} />
                  </span>
                )}
                <p>{msg.text}</p>

                {/* Primary Action Button */}
                {msg.action && (
                  <Link
                    to={msg.action.link}
                    onClick={() => setIsChatOpen(false)}
                    className="chat-action-btn"
                  >
                    <span>{msg.action.label}</span>
                    <ArrowRight size={12} />
                  </Link>
                )}

                {/* Fallback Multiple Actions */}
                {msg.actions && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                    {msg.actions.map((act, i) => (
                      <Link
                        key={i}
                        to={act.link}
                        onClick={() => setIsChatOpen(false)}
                        className="chat-action-btn"
                        style={{ width: 'fit-content' }}
                      >
                        <CornerDownRight size={11} />
                        <span>{act.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble chat-bubble-bot chatbot-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="chatbot-prompts">
            {chatbotData.suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="chatbot-prompt-chip"
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="chatbot-input-bar">
            <input
              type="text"
              placeholder="Ask about markets, hours, produce..."
              className="chatbot-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: 40, height: 40, padding: 0 }}
              onClick={() => handleSendMessage()}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
