# 🧠 Tokenizer — AI-Powered Solana Transactions via Chat

Ever imagined chatting with an AI and it sends a Solana transaction *for you*?  
Well, this project makes that happen — in real-time, with real wallets.

## 🚀 Features

- 🤖 AI Agent that builds and serializes Solana transactions  
- 💬 Chat UI powered by `useChat` (React hooks)  
- 🔐 Solana wallet integration to sign & send txns  
- ⚡️ Real-time interaction between AI, wallet, and chain  
- 🧩 Modular Mastra logic to generate and validate transactions

## 📸 Demo

> Watch the magic in action: [https://x.com/manashanand2/status/1911339161950310552]

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS  
- **Backend**: Node.js + Express (or FastAPI if using Python)  
- **Blockchain**: Solana Web3.js  
- **AI Agent**: Custom tool calling backend to prepare txns  using Mastra
- **Wallet**: Solana wallet adapter (e.g. Phantom)

## 🧠 How It Works

1. User types an intent in chat (e.g., "Send 0.01 SOL to xyz")
2. Message is sent to the backend
3. Backend agent parses intent → constructs a Solana transaction
4. Serialized transaction is returned to frontend
5. User's wallet signs & sends the transaction
6. Bot replies with the signature + explorer link 🚀

## 📦 Installation

```bash
npm install
npm run dev
