# Runbook: Moonlit Ledger

## 1. Installation
```bash
# Install dependencies
npm install
```

## 2. Local Development
```bash
# Start Vite dev server (Frontend only, API calls will fail without proxy target)
npm run dev

# Start Full Stack (Frontend + API) using Vercel CLI (Recommended)
npx vercel dev
```

## 3. Testing
```bash
# Run linting
npm run lint

# Run build verification
npm run build

# Run unit tests (if configured)
# npm test
```

## 4. Deployment to Vercel
1. **Install Vercel CLI** (optional, can use UI):
   ```bash
   npm i -g vercel
   ```
2. **Deploy**:
   ```bash
   vercel
   ```
3. **Production Deploy**:
   ```bash
   vercel --prod
   ```

## 5. Environment Variables
Ensure `GEMINI_API_KEY` is set in your Vercel Project Settings > Environment Variables.
