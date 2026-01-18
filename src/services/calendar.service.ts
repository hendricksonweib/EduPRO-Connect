/**
 * Calendar service
 * Handles events and calendar operations
 */

import { apiClient } from './api-client';
import type { Event, Notice, PaginatedResponse } from './types';

export const calendarService = {
    notices: {
        async getAll(): Promise<PaginatedResponse<Notice>> {
            return apiClient.get<PaginatedResponse<Notice>>('/communication/notices/');
        },

        async getById(id: number): Promise<Notice> {
            return apiClient.get<Notice>(`/communication/notices/${id}/`);
        },

        async create(data: Partial<Notice>): Promise<Notice> {
            return apiClient.post<Notice>('/communication/notices/', data);
        },

        async update(id: number, data: Partial<Notice>): Promise<Notice> {
            return apiClient.patch<Notice>(`/communication/notices/${id}/`, data);
        },

        async delete(id: number): Promise<void> {
            return apiClient.delete<void>(`/communication/notices/${id}/`);
        },
    },
    events: {
        async getAll(): Promise<PaginatedResponse<Event>> {
            return apiClient.get<PaginatedResponse<Event>>('/communication/events/');
        },

        async getById(id: number): Promise<Event> {
            return apiClient.get<Event>(`/communication/events/${id}/`);
        },

        async create(data: Partial<Event>): Promise<Event> {
            return apiClient.post<Event>('/communication/events/', data);
        },

        async update(id: number, data: Partial<Event>): Promise<Event> {
            return apiClient.patch<Event>(`/communication/events/${id}/`, data);
        },

        async delete(id: number): Promise<void> {
            return apiClient.delete<void>(`/communication/events/${id}/`);
        },
    },
};
