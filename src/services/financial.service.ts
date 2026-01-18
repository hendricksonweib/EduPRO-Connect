/**
 * Financial service
 * Handles monthly fees and financial operations
 */

import { apiClient } from './api-client';
import type { MonthlyFee, PaginatedResponse } from './types';

export const financialService = {
    fees: {
        async getAll(): Promise<PaginatedResponse<MonthlyFee>> {
            return apiClient.get<PaginatedResponse<MonthlyFee>>('/financial/fees/');
        },

        async getById(id: number): Promise<MonthlyFee> {
            return apiClient.get<MonthlyFee>(`/financial/fees/${id}/`);
        },

        async create(data: Partial<MonthlyFee>): Promise<MonthlyFee> {
            return apiClient.post<MonthlyFee>('/financial/fees/', data);
        },

        async update(id: number, data: Partial<MonthlyFee>): Promise<MonthlyFee> {
            return apiClient.patch<MonthlyFee>(`/financial/fees/${id}/`, data);
        },

        async delete(id: number): Promise<void> {
            return apiClient.delete<void>(`/financial/fees/${id}/`);
        },

        async markAsPaid(id: number, paymentDate?: string): Promise<MonthlyFee> {
            return apiClient.patch<MonthlyFee>(`/financial/fees/${id}/`, {
                paid: true,
                payment_date: paymentDate || new Date().toISOString().split('T')[0],
            });
        },
    },
};
