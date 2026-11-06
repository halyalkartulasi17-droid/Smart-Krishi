import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Mic, MicOff, Volume2, 
  VolumeX, RotateCcw, Sparkles, Bot, User, Globe 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { LANGUAGES } from '../i18n/i18n';

export default function KisanMitraChat() {
  const { language, changeAppLanguage, speakText, stopSpeaking, isSpeaking } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste Kisan Bhai! I am Kisan Mitra. Ask me about today's crop prices, soil advice, weather, or selling calculations.",
      quickReplies: ["Today's Tomato price", "Today's Onion price", "Weather forecast", "Soil test recommendation"]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const messagesEndRef = useRef(null);

  // Check speech recognition capability
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setHasSpeechRecognition(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(text, language);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.reply,
        quickReplies: res.quick_replies || []
      };
      setMessages(prev => [...prev, botMsg]);

      // Automatically speak the short reply in voice mode if enabled
      if (res.voice_supported) {
        speakText(res.reply);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "I am having trouble connecting to live servers right now. You can check the 'Crop Prices' page directly.",
          quickReplies: ["Tomato price", "Weather", "Soil test"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    if (!hasSpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your question.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'kn' ? 'kn-IN' : (language === 'hi' ? 'hi-IN' : 'en-IN');
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInputText(speechToText);
      setIsListening(false);
      handleSend(speechToText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-emerald-800 to-amber-500 text-white shadow-2xl hover:scale-105 active:scale-95 transition flex items-center space-x-2 border-2 border-amber-300 ${
          isOpen ? 'hidden' : 'flex'
        }`}
        aria-label="Open Kisan Mitra AI Chat"
      >
        <div className="relative">
          <Bot className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-ping"></span>
        </div>
        <span className="font-extrabold text-sm pr-1">Kisan Mitra AI</span>
      </button>

      {/* Chat Dialog Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border-2 border-emerald-700 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base flex items-center space-x-1.5">
                  <span>Kisan Mitra</span>
                  <span className="text-[10px] bg-amber-400 text-stone-950 px-1.5 py-0.2 rounded font-bold">23 Lang</span>
                </h3>
                <p className="text-xs text-emerald-200">AI Agricultural Assistant</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* TTS Listen/Stop Button */}
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speakText(messages[messages.length - 1]?.text)}
                className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300"
                title="Listen / Stop"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-none'
                      : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.sender === 'bot' && (
                    <div className="mt-2 flex items-center space-x-2 pt-1 border-t border-stone-100">
                      <button
                        onClick={() => speakText(msg.text)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Reply Pills */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.quickReplies.map((qr, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(qr)}
                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-medium transition"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-stone-500 text-xs italic bg-white p-3 rounded-2xl border border-stone-200 w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                <span>Kisan Mitra is checking Mandi data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-stone-200">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-2xl transition ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
                title={hasSpeechRecognition ? "Voice input" : "Voice input not supported in this browser"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask in Kannada, Hindi, English..."
                className="flex-1 bg-stone-100 text-stone-900 px-4 py-3 rounded-2xl text-sm border-none focus:ring-2 focus:ring-emerald-600 outline-none"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputText.trim() || loading}
                className="p-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white transition shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-stone-400 mt-1">
              Connects to Agmarknet verified agricultural database. Never invents prices.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

