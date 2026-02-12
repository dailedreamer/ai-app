// src/services/auth.service.ts
/**
 * Authentication service
 * Handles all auth operations via Supabase
 */

import { supabase } from '@/lib/supabase';
import type { LoginCredentials, SignupCredentials, User } from '@/types';

export class AuthService {
  /**
   * Sign up new user
   */
  async signup(credentials: SignupCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name || credentials.email.split('@')[0],
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');

    // Create user profile
    await this.createUserProfile(data.user.id, {
      email: credentials.email,
      name: credentials.name,
    });

    return this.mapSupabaseUser(data.user);
  }

  /**
   * Log in existing user
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    return this.mapSupabaseUser(data.user);
  }

  /**
   * Log out current user
   */
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;
    
    return this.mapSupabaseUser(user);
  }

  /**
   * Get user profile from database
   */
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create user profile in database
   */
  private async createUserProfile(
    userId: string,
    data: { email: string; name?: string }
  ) {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: data.email,
        name: data.name || null,
        role: 'user',
        subscription_tier: 'free',
      });

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: {
    name?: string;
    avatar_url?: string;
  }) {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }

  /**
   * Map Supabase user to app User type
   */
  private mapSupabaseUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.name,
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
      createdAt: new Date(supabaseUser.created_at),
      role: 'user', // Default, should fetch from profile
      subscription: 'free',
    };
  }
}

// Export singleton instance
export const authService = new AuthService();