import React, { useState, useEffect } from "react";

import { usePage, router } from "@inertiajs/react";
import "./../echo";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Chat({ auth }: any) {
    const { messages: initialMessages = [] } = usePage().props;
const [messages, setMessages] = useState(Array.isArray(initialMessages) ? initialMessages : []);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        window.Echo.join("chat").listen(
            "NewChatMessage",
            (e: { message: any }) => {
                setMessages((prevMessages: any) => [
                    ...prevMessages,
                    e.message,
                ]);
            }
        );

        return () => {
            window.Echo.leave("chat");
        };
    }, []);

    const sendMessage = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        router.post(
            "/chat/send",
            { message: newMessage },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
        setNewMessage("");
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
                    {messages ? messages.map(
                        (message: {
                            id: React.Key | null | undefined;
                            user: {
                                name:
                                    | string
                                    | number
                                    | boolean
                                    | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | React.ReactPortal
                                    | null
                                    | undefined;
                            };
                            content:
                                | string
                                | number
                                | boolean
                                | React.ReactElement<
                                      any,
                                      string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | React.ReactPortal
                                | null
                                | undefined;
                        }) => (
                            <div key={message.id}>
                                <strong>{message.user.name}:</strong>{" "}
                                {message.content}
                            </div>
                        )
                    ) : <div>No Messages</div>}
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
        </AuthenticatedLayout>
    );
}
