import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// Check if we should use mock auth
const useMockAuth = process.env.MOCK_AUTH === 'true' || 
                   supabaseUrl === 'https://your-supabase-url.supabase.co' ||
                   supabaseKey === 'your-anon-key';

let supabase;

if (useMockAuth) {
  console.log('⚠️  Using MOCK Supabase Auth (Local Development Mode) ⚠️');
  
  // Mock Supabase Client
  supabase = {
    auth: {
      signUp: async ({ email, password, options }) => {
        console.log(`[Mock Auth] Signing up: ${email}`);
        return {
          data: {
            user: {
              id: `mock-user-${Date.now()}`,
              email,
              user_metadata: options?.data || {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            },
            session: {
              access_token: `mock-access-token-${Date.now()}`,
              refresh_token: `mock-refresh-token-${Date.now()}`,
              user: {
                id: `mock-user-${Date.now()}`,
                email,
              }
            }
          },
          error: null
        };
      },
      signInWithPassword: async ({ email, password }) => {
        console.log(`[Mock Auth] Signing in: ${email}`);
        // Simulate success for any non-empty credentials
        if (!email || !password) {
          return {
            data: { user: null, session: null },
            error: { message: 'Email and password are required' }
          };
        }
        
        return {
          data: {
            user: {
              id: `mock-user-${email.replace(/[^a-zA-Z0-9]/g, '-')}`, // Stable ID for same email
              email,
              aud: 'authenticated',
            },
            session: {
              access_token: `mock-access-token-${Date.now()}`,
              refresh_token: `mock-refresh-token-${Date.now()}`,
            }
          },
          error: null
        };
      },
      signOut: async () => {
        console.log('[Mock Auth] Signing out');
        return { error: null };
      },
      getUser: async (token) => {
        // For mock purposes, we'll just return a generic user if a token exists
        if (!token) return { data: { user: null }, error: { message: 'No token' } };
        
        return {
          data: {
            user: {
              id: `mock-user-current`,
              email: 'mock@example.com',
              aud: 'authenticated',
            }
          },
          error: null
        };
      }
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default supabase;