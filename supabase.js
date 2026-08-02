// ========================================
// SWIFTPAY SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL = "https://yxgnygrcconssspuwcft.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z255Z3JjY29uc3NzcHV3Y2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNTU4OTQsImV4cCI6MjEwMDkzMTg5NH0.NMq31QcIKtLhyfa3EjLM8ErIRg44aGoA4OXXsv6Fcbs";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
