import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please check your .env file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)










// import { createClient } from "@supabase/supabase-js"

// // const supabaseUrl = 'https://gdjgieaoqhbkwdakkkfb.supabase.co'
// // const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase environment variables. Please check your .env file.")
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)











// import { createClient } from "@supabase/supabase-js"

// console.log("Environment variables:", {
//   url: import.meta.env.VITE_SUPABASE_URL,
//   key: import.meta.env.VITE_SUPABASE_ANON_KEY,
// })

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error("Missing Supabase environment variables. Check your .env file.")
// }

// export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "")





// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://gdjgieaoqhbkwdakkkfb.supabase.co'
// const supabaseKey = import.meta.process.env.SUPABASE_KEY
// // const supabase = createClient(supabaseUrl, supabaseKey)
// export const supabase = createClient(supabaseUrl, supabaseKey)






// import { createClient } from "@supabase/supabase-js"

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
