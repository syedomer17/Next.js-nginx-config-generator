"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [port, setPort] = useState("");
  const [generatedConfig, setGeneratedConfig] = useState("");

  const handleGenerate = () => {
    if (!domain || !port) {
      toast.error("Please enter both domain and port!");
      return;
    }

    const config = `
server {
    listen 80;
    listen [::]:80;
    server_name ${domain} www.${domain};

    location / {
        proxy_pass http://localhost:${port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
    `.trim();

    setGeneratedConfig(config);
  };

  const handleCopy = async () => {
    if (!generatedConfig) return;
    await navigator.clipboard.writeText(generatedConfig);
    toast.success("Copied to clipboard!");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-purple-100">
      <motion.h1
        className="text-3xl font-bold mb-6 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Nginx Config Generator
      </motion.h1>

      <motion.div
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <input
          type="text"
          placeholder="Enter domain (e.g., google.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="number"
          placeholder="Enter port (e.g., 5000)"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="w-full border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerate}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-md font-semibold hover:from-blue-600 hover:to-purple-600 transition"
        >
          Generate
        </motion.button>
      </motion.div>

      {generatedConfig && (
        <motion.div
          className="mt-8 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-700">Generated Configuration</h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <ClipboardIcon className="h-5 w-5" />
              <span>Copy</span>
            </motion.button>
          </div>
          <pre className="bg-gray-900 text-green-200 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-sm">
            {generatedConfig}
          </pre>
        </motion.div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </main>
  );
}
