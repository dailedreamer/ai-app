// src/utils/env.ts
/**
 * Type-safe environment variable access
 * Throws error if required env var is missing
 */

export const env = {
    // Supabase
    supabase: {
      url: getEnvVar('VITE_SUPABASE_URL'),
      anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
    },
    
    // AI APIs
    ai: {
      openaiKey: getEnvVar('VITE_OPENAI_API_KEY', false), // Optional
      anthropicKey: getEnvVar('VITE_ANTHROPIC_API_KEY', false),
      geminiKey: getEnvVar('VITE_GEMINI_API_KEY', false),
    },
    
    // App config
    app: {
      name: getEnvVar('VITE_APP_NAME', false) || 'AI Application',
      url: getEnvVar('VITE_API_BASE_URL', false) || 'http://localhost:5173',
    },
    
    // Runtime checks
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  } as const;
  
  /**
   * Get environment variable with validation
   */
  function getEnvVar(key: string, required = true): string {
    const value = import.meta.env[key];
    
    if (!value && required) {
      throw new Error(
        `Missing required environment variable: ${key}\n` +
        `Please add it to your .env.local file`
      );
    }
    
    return value || '';
  }
  
  /**
   * Validate all required environment variables on app start
   */
  export function validateEnv(): void {
    try {
      // This will throw if any required env vars are missing
      const _ = env.supabase.url;
      const __ = env.supabase.anonKey;
      
      // Check at least one AI key is present
      const hasAIKey = env.ai.openaiKey || env.ai.anthropicKey || env.ai.geminiKey;
      if (!hasAIKey) {
        console.warn('⚠️  No AI API keys configured. Some features may not work.');
      }
      
      console.log('✅ Environment variables validated');
    } catch (error) {
      console.error('❌ Environment validation failed:', error);
      throw error;
    }
  }