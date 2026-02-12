// src/types/auth.types.ts
/**
 * Authentication-related types
 */

export interface User {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    createdAt: Date;
    role: UserRole;
    subscription?: SubscriptionTier;
  }
  
  export type UserRole = 'user' | 'admin' | 'moderator';
  
  export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
  
  export interface AuthSession {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface SignupCredentials {
    email: string;
    password: string;
    name?: string;
  }
  
  export interface AuthError {
    code: string;
    message: string;
  }