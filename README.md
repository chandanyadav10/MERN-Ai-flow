# MERN AI Flow App

A full-stack MERN application with a React Flow canvas where you can type a prompt, hit **Run Flow**, and get an AI response — all visualised as connected nodes.

## Tech Stack

- **MongoDB** – stores saved conversations
- **Express.js / Node.js** – REST API + OpenRouter proxy
- **React + Vite** – frontend
- **React Flow (@xyflow/react)** – node-based UI
- **OpenRouter API** – free AI model (Mistral 7B / Gemini Flash Lite)

---

## Project Structure

```
MERN Ai flow/
├── client/
│    ├── src/
│    │   ├── components/
│    │   │   ├── InputNode.jsx
│    │   │   └── ResultNode.jsx
│    │   ├── App.jsx
│    │   ├── main.jsx
│    │   └── index.css
│    ├── index.html
│    ├── .env.example
│    ├── postcss.config.js
│    ├── vite.config.js
│    └── package.json
└── backend/
     ├──src/
     │   ├── config/
     │   │   └── db.js
     │   ├── controllers/
     │   │   └── conversation.controller.js
     │   ├── models/
     │   │   └── conversation.model.js
     │   ├── routes/
     │   │   └── converstion.route.js
     ├── server.js
     ├── .env.example
     └── package.json
 
    
```

---

## Local Setup

### Prerequisites

- Node.js ≥ 18
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A free [OpenRouter](https://openrouter.ai) account + API key

---

### 1 · Backend

```bash
cd server
npm install

# Create your env file
cp .env.example .env
# Fill in MONGO_URI and OPENROUTER_API_KEY in .env

npm run dev      # starts on http://localhost:5000
```

### 2 · Frontend

```bash
cd client
npm install

# (Optional) copy .env.example → .env and set VITE_API_URL if needed
# Leave it empty to use the built-in Vite proxy to localhost:5000

npm run dev      # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

### Backend (`backeservernd/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `PORT` | Server port (default `5000`) |
| `SITE_URL` | Your site URL (for OpenRouter headers) |

### Frontend (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (leave blank for local proxy) |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/ask-ai` | Send `{ prompt }`, get `{ answer }` |
| `POST` | `/api/save` | Save `{ prompt, response }` to MongoDB |
| `GET` | `/api/history` | Get last 20 saved conversations |

---

## Deployment

### Backend → Render.com

1. Create a **Web Service** pointing to the `server/` folder.
2. Build command: `npm install`
3. Start command: `node server.js`
4. Add all env variables in the Render dashboard.

### Frontend → Vercel / Render Static Site

1. Set `VITE_API_URL` to your deployed backend URL.
2. Build command: `npm run build`
3. Output directory: `dist`

---

## Features

- 🧠 **AI-powered** responses via OpenRouter (free tier)
- 🔗 **React Flow** node canvas with animated edge
- 💾 **Save** conversations to MongoDB
- 📋 **History panel** to browse saved Q&As
- 🗑 **Clear** for clear inputNode and resultNode
- 🔒 API key stays server-side (never exposed to the browser)