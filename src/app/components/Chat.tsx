'use client';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';




type Message = {
    sender: 'user' | 'bot';
    text: string;
};

async function sendToBot(message: string): Promise<string> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });

    const data = await res.json();
    return data.reply;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [listening, setListening] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);


    const mutation = useMutation({
        mutationFn: sendToBot,
        onSuccess: (reply) => {
            setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
        },
        onError: () => {
            setMessages(prev => [...prev, { sender: 'bot', text: '❌ Failed to get response.' }]);
        },
    });

    console.log("messages checking --->", messages)

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        setMessages(prev => [...prev, { sender: 'user', text: trimmed }]);
        setInput('');
        mutation.mutate(trimmed);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleVoiceInput = () => {
        // @ts-expect-error - SpeechRecognition not in window type
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);

        // @ts-expect-error - SpeechRecognitionEvent not properly typed
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };

        recognition.start();
    };

    const exportChat = (messages: Message[]) => {
        const chatText = messages
            .map((msg) => `${msg.sender === 'user' ? 'You' : 'Bot'}: ${msg.text}`)
            .join('\n');

        const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat.txt';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-center">💬 Chat Bot</h2>
            <button
                onClick={() => messages.length > 0 && exportChat(messages)}
                className="mt-4 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition"
            >
                ⬇️ Export Chat
            </button>

            <div className="h-96 overflow-y-auto border rounded p-3 bg-gray-50 mb-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
                {mutation.isPending && (
                    <div className="text-left mb-2">
                        <span className="inline-block px-4 py-2 rounded-lg bg-gray-200">Typing...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                />
                <button
                    onClick={handleVoiceInput}
                    className={`px-3 py-2 rounded text-white ${listening ? 'bg-red-500' : 'bg-green-600 hover:bg-green-700'
                        }`}
                >
                    🎤
                </button>
                <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
