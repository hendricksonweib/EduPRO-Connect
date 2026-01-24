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
    ClassroomSubject,
    LearningContent,
} from './types';

export const academicService = {
    // Students
    students: {
        async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Student>> {
            return apiClient.get<PaginatedResponse<Student>>(`/academic/students/?page=${page}&page_size=${limit}`);
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
        async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Teacher>> {
            return apiClient.get<PaginatedResponse<Teacher>>(`/academic/teachers/?page=${page}&page_size=${limit}`);
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
        async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Classroom>> {
            return apiClient.get<PaginatedResponse<Classroom>>(`/academic/classes/?page=${page}&page_size=${limit}`);
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
        async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Subject>> {
            return apiClient.get<PaginatedResponse<Subject>>(`/academic/subjects/?page=${page}&page_size=${limit}`);
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

    // Classroom Subjects (Matérias da Turma)
    classroomSubjects: {
        async getAll(classroomId?: number): Promise<PaginatedResponse<ClassroomSubject>> {
            const url = classroomId
                ? `/academic/classroom-subjects/?classroom=${classroomId}`
                : '/academic/classroom-subjects/';
            return apiClient.get<PaginatedResponse<ClassroomSubject>>(url);
        },

        async getById(id: number): Promise<ClassroomSubject> {
            return apiClient.get<ClassroomSubject>(`/academic/classroom-subjects/${id}/`);
        },

        async create(data: Partial<ClassroomSubject>): Promise<ClassroomSubject> {
            return apiClient.post<ClassroomSubject>('/academic/classroom-subjects/', data);
        },

        async update(id: number, data: Partial<ClassroomSubject>): Promise<ClassroomSubject> {
            return apiClient.patch<ClassroomSubject>(`/academic/classroom-subjects/${id}/`, data);
        },

        async delete(id: number): Promise<void> {
            return apiClient.delete<void>(`/academic/classroom-subjects/${id}/`);
        },
    },

    // Learning Contents (Conteúdos de Aprendizagem)
    learningContents: {
        async getAll(classroomSubjectId?: number): Promise<PaginatedResponse<LearningContent>> {
            const url = classroomSubjectId
                ? `/academic/learning-contents/?classroom_subject=${classroomSubjectId}`
                : '/academic/learning-contents/';
            return apiClient.get<PaginatedResponse<LearningContent>>(url);
        },

        async getById(id: number): Promise<LearningContent> {
            return apiClient.get<LearningContent>(`/academic/learning-contents/${id}/`);
        },

        async create(data: FormData | Partial<LearningContent>): Promise<LearningContent> {
            return apiClient.post<LearningContent>('/academic/learning-contents/', data);
        },

        async update(id: number, data: FormData | Partial<LearningContent>): Promise<LearningContent> {
            return apiClient.patch<LearningContent>(`/academic/learning-contents/${id}/`, data);
        },

        async delete(id: number): Promise<void> {
            return apiClient.delete<void>(`/academic/learning-contents/${id}/`);
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
