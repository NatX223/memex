"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false); // Show loading state during API calls

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user's message to the chat
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3300/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add bot's response to the chat
        setMessages((prev) => [...prev, { sender: "bot", text: data.text }]);
      } else {
        // Handle API errors
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Sorry, something went wrong. Please try again." },
        ]);
      }
    } catch (error) {
      // Handle network or unexpected errors
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I'm unable to respond at the moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-800 text-white font-sans flex flex-col items-center">
      <header className="w-full flex justify-between items-center px-8 py-6">
        <h1 className="text-3xl font-bold text-blue-400">MemeX</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full px-4">
        {/* Chatbox */}
        <div className="bg-gray-700 w-full max-w-2xl h-[500px] rounded-lg shadow-lg p-4 flex flex-col justify-between">
          {/* Message History */}
          <div className="flex-grow overflow-y-auto space-y-4 p-4 bg-gray-800 rounded-lg">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  className={`${
                    message.sender === "user" ? "bg-blue-600" : "bg-blue-800"
                  } px-4 py-2 rounded-lg max-w-sm`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-blue-800 px-4 py-2 rounded-lg max-w-sm">Typing...</div>
              </motion.div>
            )}
          </div>

          {/* Input Section */}
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow px-4 py-2 rounded-lg bg-gray-800 text-white"
              placeholder="Type your message here..."
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      </main>

      <footer className="py-4 text-blue-200">
        <p>Plugins Powered by GOAT-SDK</p>
      </footer>
    </div>
  );
};

export default Chatbot;
