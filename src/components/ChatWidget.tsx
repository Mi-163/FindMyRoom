"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "ai", text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Context Engine: Figure out exactly what page the user is on
    const getCurrentContext = () => {
        if (pathname === "/search") return "The main hotel search page comparing options.";
        if (pathname.startsWith("/search/")) {
            const hotelName = searchParams.get("name") || "a specific hotel";
            const city = searchParams.get("city") || "Kochi";
            return `Looking at the details page for ${hotelName} in ${city}.`;
        }
        return "The homepage of the travel app.";
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setInput("");
        setIsTyping(true);

        try {
            // Send the message AND the current context to secure backend
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    hotelContext: getCurrentContext()
                }),
            });

            const data = await res.json();

            setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "ai", text: "Network error. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">

            {/*   Floating Bubble Button with Hover Tooltip */}
            {!isOpen && (
                <div className="relative group flex items-center justify-center">
                    {/* The Tooltip (Hidden by default, shown on hover) */}
                    <div className="absolute bottom-full right-0 mb-4 w-56 p-3 bg-slate-800 text-white text-xs text-center rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                        Chat with our AI assistant here (powered by Gemini 2.5 Flash)
                        {/*  little triangle pointing down at the button */}
                        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-800 rotate-45"></div>
                    </div>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform hover:scale-105 relative z-10"
                    >
                        <span className="text-2xl">🤖</span>
                    </button>
                </div>
            )}

            {/* The Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
                        <div>
                            <h3 className="font-bold">Marcopolo</h3>
                            <p className="text-xs text-slate-300">Your Travel Guide</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white text-xl">
                            ✕
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.length === 0 && (
                            <div className="text-center mt-10 px-4 flex flex-col gap-3">

                                <p className="text-base font-bold text-slate-800">
                                    👋 Hi! I'm Marcopolo.
                                </p>

                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Your AI Travel Guide. From Brazil, Morocco, London to Ibiza, straight to LA, New York, Vegas to Africa—I got you covered!
                                </p>

                                <p className="text-sm font-semibold text-blue-600 mt-2 bg-blue-50 py-2 px-4 rounded-full inline-block self-center">
                                    Ask me anything about your trip! ✨
                                </p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === "user"
                                ? "bg-blue-600 text-white self-end rounded-br-none"
                                : "bg-white border border-gray-200 text-slate-800 self-start rounded-bl-none shadow-sm"
                                }`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="bg-white border border-gray-200 text-slate-500 self-start rounded-xl rounded-bl-none shadow-sm p-3 text-sm flex gap-1">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce delay-100">●</span>
                                <span className="animate-bounce delay-200">●</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Field */}
                    <div className="p-3 border-t bg-white">
                        <form onSubmit={sendMessage} className="flex gap-2">

                            {/* Added high contrast placeholder styles */}
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about hotels, locations..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm placeholder-slate-600 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="submit"
                                disabled={isTyping}
                                className="bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-700 disabled:opacity-50"
                            >
                                ↑
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}