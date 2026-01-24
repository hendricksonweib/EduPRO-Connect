/**
 * Common TypeScript types for API communication
 */

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface TokenRefreshRequest {
    refresh: string;
}

export interface TokenRefreshResponse {
    access: string;
}

export interface ApiError {
    detail?: string;
    message?: string;
    [key: string]: unknown;
}

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    role: 'ADMINISTRATIVO' | 'OPERACIONAL' | 'FINANCEIRO';
}


export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    total_pages: number;
    current_page: number;
    results: T[];
}

// Academic types
export interface Student {
    id: number;
    name: string;
    registration: string;
    classroom?: number;
    classroom_name?: string;
    birth_date?: string | null;
    rg?: string | null;
    cpf?: string | null;
    cep?: string | null;
    address?: string | null;
    guardian: string;
    phone: string;
    responsible1_name?: string | null;
    responsible2_name?: string | null;
    status: 'ativo' | 'inativo';
    avatar?: string | null;
    monthly_fee?: number;
    due_day?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Teacher {
    id: number;
    name: string;
    registration: string;
    email: string;
    phone: string;
    education: string;
    birth_date?: string | null;
    cpf?: string | null;
    rg?: string | null;
    admission_date?: string | null;
    status: 'ativo' | 'inativo';
    avatar?: string | null;
    disciplines?: Discipline[];
    bank?: string | null;
    agency?: string | null;
    account?: string | null;
    pix?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Discipline {
    id: number;
    name: string;
}

export interface Classroom {
    id: number;
    name: string;
    period: 'Matutino' | 'Vespertino' | 'Noturno' | 'Integral';
    year: number;
    responsible_teacher?: number;
    responsible_teacher_name?: string;
    total_students?: number;
    total_disciplines?: number;
    student_ids?: number[];
    status: 'ativa' | 'arquivada';
    created_at?: string;
    updated_at?: string;
}

export interface Subject {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface ClassroomSubject {
    id: number;
    classroom: number;
    classroom_name?: string;
    subject: number;
    subject_name?: string;
    teacher?: number;
    teacher_name?: string;
    total_contents?: number;
    created_at?: string;
    updated_at?: string;
}

export interface LearningContent {
    id: number;
    classroom_subject: number;
    title: string;
    description?: string;
    content_type: 'pdf' | 'video' | 'link' | 'other';
    file?: string | null;
    file_url?: string | null;
    external_url?: string | null;
    file_size?: number;
    views?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Grade {
    id: number;
    student: number;
    subject: number;
    value: number;
    created_at: string;
    updated_at: string;
}

export interface DashboardKPI {
    title: string;
    value: string;
    description: string;
    icon: string;
    color: string;
    bg: string;
}

export interface SubjectPerformance {
    nome: string;
    nota: number;
    status: 'excelente' | 'bom' | 'medio' | 'alerta';
}

export interface ClassRanking {
    nome: string;
    media: number;
    alunos: number;
}

export interface StudentHighlight {
    nome: string;
    turma: string;
    media: number;
    avatar: string;
}

export interface DashboardData {
    kpis: DashboardKPI[];
    performance_per_discipline: SubjectPerformance[];
    ranking_turmas: ClassRanking[];
    alunos_destaque: StudentHighlight[];
}

// Financial types
export interface MonthlyFee {
    id: number;
    student: number;
    student_name?: string;
    student_registration?: string;
    student_class?: string;
    month: string;
    due_date: string;
    value: string;
    status: 'pago' | 'atrasado' | 'pendente';
    payment_date?: string | null;
    proof_of_payment?: string | null;
    created_at?: string;
    updated_at?: string;
}

// Calendar types
export interface Event {
    id: number;
    title: string;
    date: string;
    time?: string | null;
    type: 'Reunião' | 'Feriado' | 'Acadêmico' | 'Outro';
    description?: string;
}

export interface Notice {
    id: number;
    title: string;
    message: string;
    date: string;
    audience: 'Todos' | 'Alunos' | 'Professores' | 'Responsáveis';
    is_active: boolean;
}
