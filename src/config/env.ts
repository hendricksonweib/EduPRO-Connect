/**
 * Environment configuration
 * Centralizes access to environment variables with type safety
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

export const env = {
    apiUrl: API_URL,
} as const;
