"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/app/lib/utils";
import { useChat } from "@ai-sdk/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { handleMessageSigning, handleTransactionSigning } from "@/components/helper/mastra-helper";

const Chatbot = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const wallet = useWallet();

  const { connection } = useConnection();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append
  } = useChat({
    body: {
      publicKey: wallet.publicKey?.toBase58(),
    },
    onFinish: async (message) => {
      console.log(message)
      if (message.content.startsWith("Please sign the message")) {
        await handleMessageSigning(wallet, message.content, append);
      } else {
        const txMatch = message.content.match(/([A-Za-z0-9+/=]{100,})/);


        const base64Tx = txMatch?.[1];
        if (!base64Tx) return;
        await handleTransactionSigning(wallet, message.content, connection, append);

       
      }

    },
  });
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);



  // Check if scroll button should be shown
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };



  return (
    <div className="flex items-center justify-center w-full mt-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm border border-white/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-medium text-white">Simple Web3 Bot</h2>
          </div>

          {/* Messages container */}
          <div
            className="h-[60vh] overflow-y-auto p-6 bg-gradient-to-b from-teal-700/30 to-emerald-600/20 backdrop-blur-md"
            ref={messagesContainerRef}
          >
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-white/70 gap-4"
                >
                  <div className="p-6 rounded-full bg-white/10 backdrop-blur-md">
                    <MessageSquare className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-lg">Send a message to start the conversation</p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={cn("flex flex-col gap-2", message.role === "user" ? "items-end" : "items-start")}
                    >
                      <Badge variant={message.role === "user" ? "default" : "outline"} className="mb-1">
                        {message.role === "user" ? "You" : "AI"}
                      </Badge>
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          "max-w-[85%] rounded-2xl px-5 py-3 shadow-lg",
                          message.role === "user"
                            ? "bg-white/10 text-white backdrop-blur-sm border border-white/10 rounded-tr-none"
                            : "bg-emerald-500/90 backdrop-blur-md text-white rounded-tl-none border border-emerald-400/30 overflow-hidden"
                        )}
                      >
                        {message.parts && message.parts.length > 0 ? (
                          message.parts.map((part, i) => {
                            if (part.type === "text") {
                              return (
                                <div key={`${message.id}-${i}`} className="flex group gap-4 whitespace-pre-wrap">
                                  <div className="flex-1">{part.text}</div>
                                  {message.role === "assistant" && (
                                    <button
                                      onClick={() => navigator.clipboard.writeText(part.text)}
                                      className=" top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-white/20 hover:bg-white/30 group-hover:flex hidden text-white px-2 py-1 rounded-md cursor-pointer"
                                      title="Copy"
                                    >
                                      Copy
                                    </button>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })
                        ) : (
                          <>
                            <div className="relative group whitespace-pre-wrap">
                              <div>{message.content}</div>
                              {message.role === "assistant" && (
                                <button
                                  onClick={() => navigator.clipboard.writeText(message.content)}
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md cursor-pointer z-50"
                                  title="Copy"
                                >
                                  Copy
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </AnimatePresence>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-20 right-6 bg-emerald-600 text-white p-3 rounded-full shadow-lg border border-emerald-400/30"
                  onClick={scrollToBottom}
                >
                  <ArrowDown className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="p-4 bg-teal-800/30 backdrop-blur-md border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 transition-all"
                size="icon"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Send className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
