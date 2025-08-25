# 🚀 Travel App

A full-stack travel application built with **Vite**, **TailwindCSS**, and deployed on **Netlify**.  
The project is structured into `client`, `server`, and `shared` workspaces for modular development.

---

## 📂 Project Structure

```
TRAVEL
├── client/            # Frontend (Vite + Tailwind)
├── server/            # Backend (API / server logic)
├── shared/            # Shared utilities, types, constants
├── public/            # Static assets
├── netlify/           # Netlify-specific configs
├── .env               # Environment variables
├── index.html         # Entry HTML file
├── package.json       # Dependencies & scripts
├── pnpm-lock.yaml     # Lockfile (pnpm)
├── vite.config.ts     # Vite configuration
├── tailwind.config.ts # Tailwind configuration
└── postcss.config.js  # PostCSS configuration
```

---

## 🛠️ Tech Stack

- **Frontend:** Vite, React (likely), TailwindCSS, PostCSS  
- **Backend:** Node.js (inside `server/`)  
- **Deployment:** Netlify (`netlify.toml` present)  
- **Package Manager:** npm / pnpm  

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/travel-app.git
   cd travel-app
   ```

2. **Install dependencies**  
   You can use either **npm** or **pnpm** (recommended).
   ```bash
   # with npm
   npm install

   # with pnpm
   pnpm install
   ```

3. **Set environment variables**  
   Create a `.env` file in the root and configure required variables (example below):
   ```bash
   API_URL=http://localhost:5000
   NODE_ENV=development
   ```

4. **Run the development server**
   ```bash
   # frontend + backend together (if configured)
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

---

## 🚀 Deployment

This project is set up for **Netlify** deployment.  
Configuration is inside `netlify.toml`. Push your changes to the connected branch and Netlify will handle the rest.

---

## 📖 Additional Docs

- [`AGENTS.md`](AGENTS.md) – agent-related notes  
- [`DEPLOYMENT.md`](DEPLOYMENT.md) – deployment instructions  

---

## 📜 License

MIT License – feel free to use and modify.
