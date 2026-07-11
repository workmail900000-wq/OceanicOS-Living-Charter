# 🌊 OceanicOS Living Tokenization Studio

> **Living • Open • Platform-Agnostic • Continuous Becoming**

A fullstack, interactive Byte Pair Encoding (BPE) tokenization playground, ported from
[Karpathy's minBPE](https://github.com/karpathy/minbpe) into a living web application.

**Constitutional home:** `workmail900000-wq/OceanicOS-Living-Charter`  
**Root algorithm:** `karpathy/minbpe`  
**Stack:** React 19 + TypeScript + tRPC + Drizzle ORM + MySQL + OAuth

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧪 **Studio** | Train BPE tokenizers with adjustable vocab size, visualize every merge step |
| 🎮 **Playground** | Encode/decode text in real-time against trained tokenizers |
| 🏛️ **Gallery** | Browse, search, and manage saved tokenizer configurations |
| ⚖️ **Compare** | Side-by-side comparison of multiple tokenizers on the same text |
| 🔐 **Auth** | OAuth 2.0 login with private/public tokenizer sharing |
| 💾 **Persistence** | MySQL-backed storage for all tokenizer configurations |

---

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React 19  │────▶│   tRPC 11   │────▶│   Hono API  │
│  (Frontend) │◀────│  (Router)   │◀────│  (Backend)  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                          ┌────────────────────┘
                          ▼
                   ┌─────────────┐
                   │  Drizzle ORM│
                   │  + MySQL    │
                   └─────────────┘
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
├── api/                          # tRPC + Hono backend
│   ├── tokenizer-router.ts      # Tokenizer CRUD API
│   ├── comparison-router.ts     # Comparison sessions API
│   ├── auth-router.ts           # OAuth authentication
│   └── middleware.ts            # tRPC procedures
├── db/
│   ├── schema.ts                # Database tables
│   └── relations.ts             # Drizzle relations
├── src/
│   ├── lib/minbpe.ts            # 🧠 Core BPE algorithm (TypeScript port)
│   ├── pages/
│   │   ├── Studio.tsx           # Training & visualization
│   │   ├── Playground.tsx       # Encode/decode tool
│   │   ├── Gallery.tsx          # Saved tokenizers
│   │   └── Compare.tsx          # Side-by-side comparison
│   └── components/OceanNav.tsx  # Navigation
├── contracts/                    # Shared types
└── README.md
```

---

## 🧬 The BPE Algorithm

This project ports Karpathy's minBPE to TypeScript, implementing:

1. **Training**: Iteratively merge the most frequent byte pairs
2. **Encoding**: Replace pairs with merged token IDs (lowest merge index first)
3. **Decoding**: Map token IDs back to byte sequences via vocabulary

See `src/lib/minbpe.ts` for the full implementation.

---

## 🌊 OceanicOS Constitution

> *Receive. Hold. Clarify. Connect. Adapt. Nourish. Restore. Flow. Return Better.*

Every line of code in this repository is shaped by the Water Principles —
platform-agnostic, continuously becoming, living.

---

## 📜 License

Algorithm: MIT (Karpathy/minbpe)  
Application: MIT — *One Better Drop.*
