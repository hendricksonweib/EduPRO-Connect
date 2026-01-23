/**
 * Base API client using fetch
 * Handles authentication, token refresh, and error handling
 */

import { env } from '@/config/env';
import Cookies from 'js-cookie';
import type { ApiError } from './types';

class ApiClient {
    private baseUrl: string = env.apiUrl;

    // Token management
    public getAccessToken(): string | null {
        return Cookies.get('access_token') || null;
    }

    public getRefreshToken(): string | null {
        return Cookies.get('refresh_token') || null;
    }

    public setAccessToken(token: string): void {
        Cookies.set('access_token', token, { expires: 1, path: '/' });
    }

    public setRefreshToken(token: string): void {
        Cookies.set('refresh_token', token, { expires: 7, path: '/' });
    }

    public clearTokens(): void {
        Cookies.remove('access_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
    }

    private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
        const fullUrl = `${this.baseUrl}${url}`;
        const headers = new Headers(options.headers || {});

        // Add Authorization header if token exists
        const token = this.getAccessToken();
        if (token && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        // Handle Content-Type for non-FormData requests
        if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        const response = await fetch(fullUrl, {
            ...options,
            headers,
        });

        // Handle 401 Unauthorized - attempt token refresh
        if (response.status === 401) {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
                try {
                    const refreshRes = await fetch(`${this.baseUrl}/auth/refresh/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh: refreshToken }),
                    });

                    if (refreshRes.ok) {
                        const { access } = await refreshRes.json();
                        this.setAccessToken(access);

                        // Retry original request
                        headers.set('Authorization', `Bearer ${access}`);
                        const retryResponse = await fetch(fullUrl, {
                            ...options,
                            headers,
                        });

                        if (retryResponse.ok) {
                            return await retryResponse.json() as T;
                        }
                        throw retryResponse;
                    }
                } catch (e) {
                    this.clearTokens();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/';
                    }
                    throw e;
                }
            }
        }

        if (!response.ok) {
            // Try to extract API error details
            let errorData;
            try {
                errorData = await response.json();
                console.error('API Error details:', errorData);
            } catch (e) {
                errorData = { detail: 'An unexpected error occurred' };
            }
            throw { response: { data: errorData, status: response.status } };
        }

        // Use response.text() first to handle empty responses
        const text = await response.text();
        return text ? JSON.parse(text) : {} as T;
    }

    // HTTP methods
    public async get<T>(url: string, options: RequestInit = {}) {
        return this.request<T>(url, { ...options, method: 'GET' });
    }

    public async post<T>(url: string, data?: unknown, options: RequestInit = {}) {
        return this.request<T>(url, {
            ...options,
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    }

    public async put<T>(url: string, data?: unknown, options: RequestInit = {}) {
        return this.request<T>(url, {
            ...options,
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    }

    public async patch<T>(url: string, data?: unknown, options: RequestInit = {}) {
        return this.request<T>(url, {
            ...options,
            method: 'PATCH',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    }

    public async delete<T>(url: string, options: RequestInit = {}) {
        return this.request<T>(url, { ...options, method: 'DELETE' });
    }

    // Error handling helper
    public handleError(error: any): string {
        const errorData = error.response?.data as ApiError;

        if (errorData) {
            // Aggregate all field errors if it's a 400 error with validation details
            if (typeof errorData === 'object' && !errorData.detail && !errorData.message) {
                const messages = Object.entries(errorData)
                    .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                    .join(' | ');
                return messages || 'Erro na validação dos dados';
            }
            return errorData.detail || errorData.message || 'Erro na requisição';
        }

        return 'Ocorreu um erro inesperado';
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
