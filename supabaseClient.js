import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://kskdhwmucxgolopetrik.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza2Rod211Y3hnb2xvcGV0cmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDQwNDcsImV4cCI6MjA2MTUyMDA0N30.uxbwTq8eRIcPsGDRxK4r9Fi26PUE407uNdq_RpHd9zo';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;