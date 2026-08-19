import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aurypnerbldinmjwplhd.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1cnlwbmVyYmxkaW5tandwbGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MDgxODAsImV4cCI6MjEwMTI4NDE4MH0.s5QoWJFpRcmx7eOymCIvDPfUqwhNWL4OZ5WVUmqXFC8';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  try {
    client = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
    return client;
  } catch (err) {
    console.error('Error creating Supabase browser client, using fallback:', err);
    client = createBrowserClient(
      'https://aurypnerbldinmjwplhd.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1cnlwbmVyYmxkaW5tandwbGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MDgxODAsImV4cCI6MjEwMTI4NDE4MH0.s5QoWJFpRcmx7eOymCIvDPfUqwhNWL4OZ5WVUmqXFC8'
    );
    return client;
  }
}
