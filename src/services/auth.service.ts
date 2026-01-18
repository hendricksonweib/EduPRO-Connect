/**
 * Authentication service
 * Handles login, token refresh, and token management
 */

import { apiClient } from './api-client';
import type { LoginRequest, LoginResponse, TokenRefreshRequest, TokenRefreshResponse, User } from './types';

export const authService = {
    /**
     * Login with username and password
     */
    async login(username: string, password: string): Promise<LoginResponse> {
        const data: LoginRequest = { username, password };
        const response = await apiClient.post<LoginResponse>('/auth/login/', data);

        // Store tokens
        apiClient.setAccessToken(response.access);
        apiClient.setRefreshToken(response.refresh);

        return response;
    },

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
        const data: TokenRefreshRequest = { refresh: refreshToken };
        const response = await apiClient.post<TokenRefreshResponse>('/auth/refresh/', data);

        // Update access token
        apiClient.setAccessToken(response.access);

        return response;
    },

    /**
     * Get current authenticated user's information
     */
    async getCurrentUser(): Promise<User> {
        return apiClient.get<User>('/auth/me/');
    },

    /**
     * Logout - clear tokens
     */
    logout(): void {
        apiClient.clearTokens();
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!apiClient.getAccessToken();
    },
};


