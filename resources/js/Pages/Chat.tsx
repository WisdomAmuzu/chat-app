import React, { useState, useEffect } from "react";

import { usePage, router } from "@inertiajs/react";
import "./../echo";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function Chat({ auth }: any) {
    const { messages: initialMessages = [] } = usePage().props;
    const [messages, setMessages] = useState(
        Array.isArray(initialMessages) ? initialMessages : []
    );
    const [newMessage, setNewMessage] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        if (selectedUserId) {
            fetchMessages();
        }
    }, [selectedUserId]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/messages/${selectedUserId}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    const sendMessage = async () => {
        try {
            const response = await axios.post("/send-message", {
                to_user_id: selectedUserId,
                content: newMessage,
            });
            setMessages([...messages, response.data]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="messages">
                    {messages ? (
                        messages.map((message, index) => (
                            <div key={index}>{message.content}</div>
                        ))
                    ) : (
                        <div>No Messages</div>
                    )}
                </div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </AuthenticatedLayout>
    );
}
