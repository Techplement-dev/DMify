
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;                       // Project URL from env
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;              // Public anon key from env

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;




// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);