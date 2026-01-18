/**
 * User service
 * Handles CRUD operations for employees (users)
 */

import { apiClient } from './api-client';
import type { User, PaginatedResponse } from './types';

export const userService = {
    async getAll(): Promise<User[]> {
        const response = await apiClient.get<User[] | PaginatedResponse<User>>('/users/');
        if (Array.isArray(response)) {
            return response;
        }
        return response.results || [];
    },

    async getById(id: number): Promise<User> {
        return apiClient.get<User>(`/users/${id}/`);
    },

    async create(data: FormData | (Partial<User> & { password?: string })): Promise<User> {
        return apiClient.post<User>('/users/', data);
    },

    async update(id: number, data: FormData | Partial<User>): Promise<User> {
        return apiClient.patch<User>(`/users/${id}/`, data);
    },

    async delete(id: number): Promise<void> {
        return apiClient.delete<void>(`/users/${id}/`);
    },
};
