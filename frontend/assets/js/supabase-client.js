// /assets/js/supabase-client.js
const SUPABASE_URL = 'https://ywxonjofkzmkkckaxerj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3eG9uam9ma3pta2tja2F4ZXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxODg2ODEsImV4cCI6MjEwODc2NDY4MX0.e37iyecmg1J0vxNKmfUiav3hDKXVkCwPS-cpceP1Uck';

// Use 'supabaseClient' with explicit session persistence
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storage: window.localStorage,
    autoRefreshToken: true
  }
});