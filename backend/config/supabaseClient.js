const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://pdsrdvuhphvnqybxzmkt.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc3JkdnVocGh2bnF5Ynh6bWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5OTYzNDgsImV4cCI6MjA0NjU3MjM0OH0.FjKwkuBU9C96TmaTgMGaxXDx6rOy6IC0CDS6F-UEscw"

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or anon key. Check your .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;