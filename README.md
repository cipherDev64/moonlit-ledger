# Moonlit Ledger 🌙

A mood-based journaling web app with a Ghibli-inspired rustic paper aesthetic.
Built with React, TypeScript, Vite, Tailwind CSS, and Vercel Serverless Functions.

## Features
- **Rustic Aesthetic**: Parchment textures, serif fonts, and a calming interface.
- **AI Reflections**: Powered by Google Gemini API via a secure serverless proxy.
- **Mood Tracking**: Emoji-based mood selection and history.
- **Privacy First**: Journal entries are stored locally in your browser (localStorage).
- **Export**: Save entries as `.txt` or capture a snapshot as `.png`.
- **Dark Mode**: Fully supported rustic dark theme.

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom CSS
- **Backend**: Vercel Serverless Functions (Node.js / Edge)
- **AI**: Google Gemini API

## Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file in the root (or set in Vercel dashboard):
   ```
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. **Run Locally**:
   ```bash
   npm run dev
   ```
   *Note: To test the API locally, you may need to use `vercel dev` instead of `npm run dev` if the Vite proxy isn't sufficient, or ensure the proxy targets a running backend.*
   
   Recommended for full stack dev:
   ```bash
   npx vercel dev
   ```

## Deployment

This project is designed for **Vercel**.

1. Push to GitHub.
2. Import project in Vercel.
3. Add `GEMINI_API_KEY` to Vercel Environment Variables.
4. Deploy!

## Project Structure
- `src/`: Frontend source code
  - `components/`: UI components
  - `styles/`: Global styles and Tailwind setup
- `api/`: Serverless functions
- `public/`: Static assets

## License
MIT
