// Use same-origin Vercel rewrites for Supabase to avoid browser CORS/preflight redirects.
// vercel.json proxies /rest/v1, /auth/v1, /storage/v1 and /functions/v1 to the real Supabase project.
const SUPABASE_URL = window.location.origin;

const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJra250dHp6cnJqYXZieXltdndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzE4MjUsImV4cCI6MjA5MzUwNzgyNX0.3C-lZI2Seq23X0F4voYuNmyiutcn-NVR9XKOmzPIkmM";
