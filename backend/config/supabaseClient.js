const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.APP_SUPABASE_URL
const supabaseKey = process.env.APP_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or anon key. Check your .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;