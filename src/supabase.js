// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://giwqeeeyaehdewobkqnc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpd3FlZWV5YWVoZGV3b2JrcW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4ODgyNTYsImV4cCI6MjA0NjQ2NDI1Nn0._luex-kmnQmy-VWintScZiiOVPIY7QSRXfQ8958EUNA'; // or service role key, if necessary
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
