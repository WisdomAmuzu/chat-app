import React, { useState, useEffect } from 'react';

import { usePage, router } from '@inertiajs/react';
import './../echo';


export default function Chat({ messages: initialMessages}: any) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        window.Echo.join('chat')
            .listen('NewChatMessage', (e: { message: any; }) => {
                setMessages((prevMessages: any) => [...prevMessages, e.message]);
            });

        return () => {
            window.Echo.leave('chat');
        };
    }, []);

    const sendMessage = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        router.post('/chat/send', { message: newMessage }, {
            preserveState: true,
            preserveScroll: true,
        });
        setNewMessage('');
    };

    return (
        <div>
            <div className="messages">
                {messages.map((message: { id: React.Key | null | undefined; user: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }; content: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                    <div key={message.id}>
                        <strong>{message.user.name}:</strong> {message.content}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}