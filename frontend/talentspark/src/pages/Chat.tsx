import { useState } from "react";
import { askCareerChat } from "../Services/ChatService";
import type { ChatMessage } from "../types/chat";

function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(() => "session_" + Date.now());

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await askCareerChat(input, sessionId);
            const botMessage: ChatMessage = { role: "bot", content: response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { role: "bot", content: "Error: Could not get response" };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>⚡ Career Chatbot</h3>
            </div>
            <div className="chat-messages">
                {messages.length === 0 && (
                    <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text)" }}>
                        <p style={{ fontSize: "1.05rem", fontWeight: 500, margin: "0 auto", maxWidth: "450px" }}>
                            Welcome to your Career AI Assistant! Ask me anything about career paths, resume tips, interview prep, or job match recommendations.
                        </p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.role === "user" ? "user" : "bot"}`}>
                        <div className="chat-bubble">
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="chat-message bot">
                        <div className="chat-bubble" style={{ opacity: 0.75 }}>
                            Thinking...
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSend} className="chat-input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about careers..."
                    className="input"
                    disabled={loading}
                />
                <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
                    {loading ? "..." : "Send"}
                </button>
            </form>
        </div>
    );
}

export default Chat;