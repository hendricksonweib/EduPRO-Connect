/**
 * Academic service
 * Handles students, teachers, classes, subjects, grades, and dashboard stats
 */

import { apiClient } from './api-client';
import type {
    Student,
    Teacher,
    Classroom,
    Subject,
    Grade,
    DashboardData,
    PaginatedResponse,
} from './types';

export const academicService = {
    // Students
    students: {
        async getAll(): Promise<PaginatedResponse<Student>> {
            return apiClient.get<PaginatedResponse<Student>>('/academic/students/');
        },

        async getById(id: number): Promise<Student> {
            return apiClient.get<Student>(`/academic/students/${id}/`);
        },

        async create(data: Partial<Student>): Promise<Student> {
            return apiClient.post<Student>('/academic/students/', data);
        },

        async update(id: number, data: Partial<Student>): Promise<Student> {
            return apiClient.patch<Student>(`/academic/students/${id}/`, data);
        },

        async delete(id: number): Promise<void> {
            return apiClient.delete<void>(`/academic/students/${id}/`);
        },
    },

    // Teachers
    teachers: {
        async getAll(): Promise<PaginatedResponse<Teacher>> {
            return apiClient.get<PaginatedResponse<Teacher>>('/academic/teachers/');
        },

        async getById(id: number): Promise<Teacher> {
            return apiClient.get<Teacher>(`/academic/teachers/${id}/`);
        },

        async create(data: Partial<Teacher>): Promise<Teacher> {
            return apiClient.post<Teacher>('/academic/teachers/', data);
        },

        async update(id: number, data: Partial<Teacher>): Promise<Teacher> {
            return apiClient.patch<Teacher>(`/academic/teachers/${id}/`, data);
        },

        async delete(id: number): Promise<void> {
            return apiClient.delete<void>(`/academic/teachers/${id}/`);
        },
    },

    // Classes
    classes: {
        async getAll(): Promise<PaginatedResponse<Classroom>> {
            return apiClient.get<PaginatedResponse<Classroom>>('/academic/classes/');
        },

        async getById(id: number): Promise<Classroom> {
            return apiClient.get<Classroom>(`/academic/classes/${id}/`);
        },

        async create(data: Partial<Classroom>): Promise<Classroom> {
            return apiClient.post<Classroom>('/academic/classes/', data);
        },

        async update(id: number, data: Partial<Classroom>): Promise<Classroom> {
            return apiClient.patch<Classroom>(`/academic/classes/${id}/`, data);
        },

        async delete(id: number): Promise<void> {
            return apiClient.delete<void>(`/academic/classes/${id}/`);
        },
    },

    // Subjects
    subjects: {
        async getAll(): Promise<PaginatedResponse<Subject>> {
            return apiClient.get<PaginatedResponse<Subject>>('/academic/subjects/');
        },

        async getById(id: number): Promise<Subject> {
            return apiClient.get<Subject>(`/academic/subjects/${id}/`);
        },

        async create(data: Partial<Subject>): Promise<Subject> {
            return apiClient.post<Subject>('/academic/subjects/', data);
        },

        async update(id: number, data: Partial<Subject>): Promise<Subject> {
            return apiClient.patch<Subject>(`/academic/subjects/${id}/`, data);
        },

        async delete(id: number): Promise<void> {
            return apiClient.delete<void>(`/academic/subjects/${id}/`);
        },
    },

    // Grades
    grades: {
        async getAll(): Promise<PaginatedResponse<Grade>> {
            return apiClient.get<PaginatedResponse<Grade>>('/academic/grades/');
        },

        async getById(id: number): Promise<Grade> {
            return apiClient.get<Grade>(`/academic/grades/${id}/`);
        },

        async create(data: Partial<Grade>): Promise<Grade> {
            return apiClient.post<Grade>('/academic/grades/', data);
        },

        async update(id: number, data: Partial<Grade>): Promise<Grade> {
            return apiClient.patch<Grade>(`/academic/grades/${id}/`, data);
        },

        async delete(id: number): Promise<void> {
            return apiClient.delete<void>(`/academic/grades/${id}/`);
        },
    },

    // Dashboard
    async getDashboardStats(): Promise<DashboardData> {
        return apiClient.get<DashboardData>('/dashboard/stats/');
    },

    // Utilities
    handleError(error: any): string {
        return apiClient.handleError(error);
    }
};
