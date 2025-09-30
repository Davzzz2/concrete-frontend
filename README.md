# Concrete Pour Tracker - Frontend

React + Vite frontend for the Concrete Pour Tracker application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your backend API URL.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

The app will run on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Environment Variables

- `VITE_API_URL` - Backend API URL (e.g., `http://localhost:3001` or `https://your-api.onrender.com`)

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios
- Lucide React (icons)
