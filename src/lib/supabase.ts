// src/lib/supabase.ts
/**
 * Supabase client configuration
 * Single instance used throughout the app
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/utils/env';
import type { Database } from '@/types/database.types';

// Create typed Supabase client
export const supabase = createClient<Database>(
  env.supabase.url,
  env.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': `${env.app.name}/1.0.0`,
      },
    },
  }
);

/**
 * Helper to get current session
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return session;
}

/**
 * Helper to get current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return user;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Supabase Storage helpers
 */
export const storage = {
  /**
   * Upload file to storage bucket
   */
  async upload(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  /**
   * Delete file from storage
   */
  async delete(bucket: string, paths: string[]) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove(paths);
    
    if (error) throw error;
  },
};

/**
 * Realtime helpers
 */
export const realtime = {
  /**
   * Subscribe to table changes
   */
  subscribeToTable<T = any>(
    table: string,
    callback: (payload: any) => void,
    filter?: string
  ) {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        callback
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },
};