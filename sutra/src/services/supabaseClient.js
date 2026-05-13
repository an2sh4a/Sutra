import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://grjwlgdllrmqeasugeqp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyandsZ2RsbHJtcWVhc3VnZXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMzA5MjgsImV4cCI6MjA5MzcwNjkyOH0.VDg0wtv0qIgez8XOBnJAFtB-3PxFJot2prxFYNCuMuE'

export const supabase = createClient(supabaseUrl, supabaseKey)