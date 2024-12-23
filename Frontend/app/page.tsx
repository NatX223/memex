"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const router = useRouter(); // Initialize the router for navigation
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-800 text-white font-sans">
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-3xl font-bold text-blue-400">MemeX</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/chat')} // Navigate to /chat page
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
          >
            Chat
          </button>
        </div>
      </header>

      <main className="px-8">
        <section className="text-center py-20 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide">
            Create the Narrative.
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Launch your own tokens based off trending topics on X.
          </p>
        </section>

        <section className="grid gap-10 md:grid-cols-2 xl:grid-cols-3 py-20">
          {[
            {
              title: 'Personalized AI assistant',
              description: 'Have your own AI assistant help you create create tokens.',
            },
            {
              title: 'Go for Launch',
              description: 'Launch your tokens and get them traddable as easily as possible.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-4 text-blue-100">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        <section className="text-center py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide mb-8">
            Powered by Mode and Crossmint
          </h2>
        </section>
      </main>
    </div>
  );
};

export default Home;
