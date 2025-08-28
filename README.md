# W8 Travel Itinerary Planner with AI

An AI-powered **Travel Itinerary Planner** where users enter a **city, budget, and number of days**, and the app generates a **complete day-by-day travel itinerary**.  
The itinerary includes **summaries, maps, and dining recommendations** using **prompt chaining** and **LLM calls**.

---

## ✨ Features
- 🏙️ Input city, budget, and number of days
- 📅 Generate **daily travel plans**
- 🍴 Dining and activity recommendations
- 🗺️ Integration with **Google Maps API** and **Geoapify API**
- 🤖 Smart responses powered by **Gemini API**
- 🌐 Deployed with **Netlify**

---

## 🛠️ Tech Stack
- **TypeScript**
- **JavaScript (ES6)**
- **HTML5**
- **Gemini API** (for itinerary generation)
- **Google Maps API** (maps integration)
- **Geoapify API** (location and routing)
- **Netlify** (deployment)

---

## 📂 Project Structure
```
.
├── client/              # Frontend code
├── server/              # Backend logic
├── shared/              # Shared utilities
├── public/              # Static assets
├── .env                 # Environment variables (ignored in git)
├── netlify.toml         # Netlify configuration
├── package.json         # Dependencies
└── index.html           # Entry point
```

---
**To check live demo open this link:** https://travelitirerary.netlify.app/

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
GEOAPIFY_API_KEY=your_geoapify_key_here
```

⚠️ Make sure `.env` is listed in `.gitignore` so secrets are not pushed to GitHub.

### 4. Run locally
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 🚀 Deployment (Netlify)
1. Push your code to GitHub.
2. Connect the repo to **Netlify**.
3. Add your `GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`, and `GEOAPIFY_API_KEY` as **Environment Variables** in Netlify settings.
4. Deploy 🎉

---

## 📌 Future Improvements
- Support for multiple destinations in one trip
- Offline export to PDF / Word
- Hotel booking integration
- User login and saved itineraries

---

## 🧑‍💻 Contributors
- Krishna Gupta (Creator)

---

## 📜 License
This project is licensed under the **MIT License**.
