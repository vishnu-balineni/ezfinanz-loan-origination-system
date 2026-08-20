import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import '../layout/CustomerLayout.css'; // Just using standard app styles

// For ease, you can also inject this from .env (import.meta.env.VITE_GROQ_API_KEY)
// @ts-ignore
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY_HERE";

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ChatBotProps {
    mode: 'USER' | 'ADMIN';
}

export default function ChatBot({ mode }: ChatBotProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial System Prompts based on User vs Admin
        const userPrompt: Message = {
            role: 'system',
            content: `You are the official EZFinanz Customer AI Assistant. 
      Your goal is to help borrowers with loan applications, explain interest rates, 
      guide them on uploading KYC docs, and answer basic EZFinanz portal queries. 
      Be extremely polite, helpful, and concise. Do NOT pretend to be human, be clear you are an AI. 
      Use markdown for readability.`
        };

        const adminPrompt: Message = {
            role: 'system',
            content: `You are the EZFinanz Admin AI Copilot. 
      Your goal is to help system administrators evaluate credit risks, analyze technical system architecture, 
      explain backend Spring Boot workflows, or provide operational guidance on loan disbursements.
      Be highly technical, direct, and professional. Use markdown for readability.`
        };

        setMessages([mode === 'USER' ? userPrompt : adminPrompt]);
    }, [mode]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Check if key is available
        if (GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE") {
            const keyWarning: Message = { role: 'assistant', content: '⚠ **API Key Missing:** Please configure `VITE_GROQ_API_KEY` in `frontend/.env` to enable AI Assistant.' };
            setMessages(prev => [...prev, { role: 'user', content: input }, keyWarning]);
            setInput('');
            return;
        }

        const newMsgs = [...messages, { role: 'user', content: input } as Message];
        setMessages(newMsgs);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'groq/compound',
                    messages: newMsgs,
                    temperature: 0.5,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch from Groq API');
            }

            const data = await response.json();
            const aiReply = data.choices[0].message.content;

            setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered a network error connecting to the Groq API.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: mode === 'ADMIN' ? '#0f172a' : '#ffffff', color: mode === 'ADMIN' ? '#f8fafc' : '#0f172a', borderRadius: '1rem', overflow: 'hidden', border: mode === 'ADMIN' ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>

            {/* Chatbot Header */}
            <div style={{ padding: '1.25rem', borderBottom: mode === 'ADMIN' ? '1px solid #1e293b' : '1px solid #e2e8f0', background: mode === 'ADMIN' ? '#1e293b' : '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: mode === 'ADMIN' ? '#8b5cf6' : '#10b981', color: 'white', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    {mode === 'ADMIN' ? <Sparkles size={24} /> : <Bot size={24} />}
                </div>
                <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                        {mode === 'ADMIN' ? 'EZFinanz Admin Copilot' : 'EZFinanz Support AI'}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: mode === 'ADMIN' ? '#94a3b8' : '#64748b' }}>
                        Powered by Groq LLM
                    </span>
                </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {messages.filter(m => m.role !== 'system').length === 0 && (
                    <div style={{ textAlign: 'center', color: mode === 'ADMIN' ? '#64748b' : '#94a3b8', marginTop: '2rem' }}>
                        <p style={{ margin: 0 }}>How can I assist you today?</p>
                    </div>
                )}

                {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%', display: 'flex', gap: '0.75rem',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                    }}>
                        <div style={{ background: msg.role === 'user' ? (mode === 'ADMIN' ? '#3b82f6' : '#10b981') : (mode === 'ADMIN' ? '#1e293b' : '#f1f5f9'), padding: '0.5rem', borderRadius: '50%', height: '36px', width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: msg.role === 'user' ? 'white' : (mode === 'ADMIN' ? '#cbd5e1' : '#475569') }}>
                            {msg.role === 'user' ? <User size={18} /> : (mode === 'ADMIN' ? <Sparkles size={18} /> : <Bot size={18} />)}
                        </div>
                        <div style={{
                            background: msg.role === 'user' ? (mode === 'ADMIN' ? '#3b82f6' : '#10b981') : (mode === 'ADMIN' ? '#1e293b' : '#f1f5f9'),
                            color: msg.role === 'user' ? '#ffffff' : (mode === 'ADMIN' ? '#f8fafc' : '#0f172a'),
                            padding: '1rem', borderRadius: '1rem', fontSize: '0.95rem', lineHeight: '1.5',
                            borderTopRightRadius: msg.role === 'user' ? 0 : '1rem',
                            borderTopLeftRadius: msg.role === 'user' ? '1rem' : 0,
                            whiteSpace: 'pre-wrap'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                        <div style={{ background: mode === 'ADMIN' ? '#1e293b' : '#f1f5f9', padding: '0.5rem', borderRadius: '50%', height: '36px', width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mode === 'ADMIN' ? '#cbd5e1' : '#475569' }}>
                            {mode === 'ADMIN' ? <Sparkles size={18} /> : <Bot size={18} />}
                        </div>
                        <div style={{ background: mode === 'ADMIN' ? '#1e293b' : '#f1f5f9', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center' }}>
                            <Loader2 size={18} className="animate-spin" color={mode === 'ADMIN' ? '#cbd5e1' : '#475569'} />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '1.25rem', borderTop: mode === 'ADMIN' ? '1px solid #1e293b' : '1px solid #e2e8f0', background: mode === 'ADMIN' ? '#0f172a' : '#ffffff' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                        autoFocus
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        style={{
                            flex: 1, padding: '0.875rem 1rem', borderRadius: '0.5rem',
                            border: mode === 'ADMIN' ? '1px solid #334155' : '1px solid #cbd5e1',
                            background: mode === 'ADMIN' ? '#1e293b' : '#ffffff',
                            color: mode === 'ADMIN' ? 'white' : '#0f172a',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        style={{
                            background: mode === 'ADMIN' ? '#3b82f6' : '#10b981', color: 'white',
                            border: 'none', padding: '0 1.25rem', borderRadius: '0.5rem',
                            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                            opacity: isLoading || !input.trim() ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
                {GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE" && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.75rem', color: '#ef4444' }}>
                        <AlertCircle size={14} /> Add VITE_GROQ_API_KEY in .env to enable Groq AI
                    </div>
                )}
            </div>
        </div>
    );
}
