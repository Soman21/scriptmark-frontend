# ScriptMark — Frontend

React + Vite + Tailwind CSS frontend for ScriptMark, an AI-assisted exam script
marking system for lecturers, reviewers, and admins.

## Stack
- React 18 + Vite
- Tailwind CSS
- react-router-dom (routing + auth-protected routes)
- lucide-react (icons)
- recharts (analytics charts)

## Structure
```
src/
  components/
    Sidebar.jsx        sidebar nav; "New Marking Session" and "Sign Out" are wired to real actions
    Topbar.jsx          shared page header (title, tabs, search, actions)
    ui.jsx              reusable primitives (StatCard, buttons, Badge)
    RequireAuth.jsx      route guard — redirects to /login if not signed in
  context/
    AuthContext.jsx      login/signup/logout state, persisted in localStorage
  lib/
    api.js               fetch wrapper that talks to the backend
  pages/
    Login.jsx            sign-in screen
    SignUp.jsx            account creation — calls the real signup API
    Dashboard.jsx          marking session chat + queue status
    ScanScripts.jsx         OCR batch upload + live review (UI only — not wired to OCR yet)
    MarkingGuides.jsx       create + list marking guides — fully wired to the backend
    Results.jsx              per-script review with marking scheme (UI only for now)
    Analytics.jsx             performance overview + charts
    Archive.jsx               student results table
    Settings.jsx              placeholder
  App.jsx                routes, auth provider, protected route wrapper
  main.jsx               entry point
```

## Running this locally (with the backend)
1. Get the backend running first — see `scriptmark-backend/README.md`.
   It should be live at `http://localhost:4000`.
2. In this folder:
   ```bash
   cp .env.example .env
   npm install
   npm run dev
   ```
3. Visit `http://localhost:5173` → you'll land on `/login`. Click "Create
   one" to sign up (this calls the real backend and creates a row in your
   Supabase database).

## What's actually wired up right now
- **Sign up / Log in / Log out** — real, backed by the database (JWT auth).
- **Protected routes** — every page except `/login` and `/signup` redirects
  you to `/login` if you're not authenticated.
- **Marking Guides page** — creating a guide really saves it to the
  database; the "Recent Guides" list is real data, not mock data.
- **"New Marking Session"** button — creates a real session record, then
  takes you to the scan screen.
- **Scan Scripts / Results pages** — UI is complete but still shows
  illustrative mock content, because they depend on OCR (Google Cloud
  Vision) and LLM scoring integrations that come in a later phase.

## Build
```bash
npm run build
npm run preview
```

## Deploying later (Vercel)
1. Push this folder to GitHub.
2. On https://vercel.com → New Project → import the repo.
3. Framework preset: Vite (auto-detected).
4. Add an environment variable: `VITE_API_URL` = your Railway backend URL.
5. Deploy. Update the backend's `FRONTEND_URL` env var to this Vercel URL
   afterward so CORS allows it.
