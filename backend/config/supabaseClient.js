const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://guuydhldgjexrbvozxeb.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dXlkaGxkZ2pleHJidm96eGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyMDc2MzksImV4cCI6MjAzODc4MzYzOX0.ePkhw7kWV1M3Tv8QwihpU7IWeKJYWV6ZYZDDrdj9viE"

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or anon key. Check your .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;