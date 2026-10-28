`<!-- Include Supabase CDN -->`
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = 'https://ywxonjofkzmkkckaxerj.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3eG9uam9ma3pta2tja2F4ZXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxODg2ODEsImV4cCI6MjEwODc2NDY4MX0.e37iyecmg1J0vxNKmfUiav3hDKXVkCwPS-cpceP1Uck';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
</script>