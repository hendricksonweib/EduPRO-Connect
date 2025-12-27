import {
    BookOpen,
    Calendar,
    GraduationCap,
    LayoutDashboard,
    Settings,
    UserCheck,
} from "lucide-react"

export const sidebarData = {
    user: {
        name: "desenvolvedorteste01",
        email: "desenvolvedorteste01@gmail.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                {
                    title: "Desempenho",
                    url: "/dashboard",
                },
                {
                    title: "Resumo Financeiro",
                    url: "/work-in-progress?section=financeiro-resumo",
                },
            ],
        },
        {
            title: "Turmas",
            url: "/turmas",
            icon: BookOpen,
            items: [
                {
                    title: "Todas as Turmas",
                    url: "/turmas",
                },
                {
                    title: "Nova Turma",
                    url: "/turmas/nova",
                },
            ],
        },
        {
            title: "Alunos",
            url: "/alunos",
            icon: GraduationCap,
            items: [
                {
                    title: "Todos os Alunos",
                    url: "/alunos",
                },
                {
                    title: "Novo Aluno",
                    url: "/alunos/novo",
                },
            ],
        },
        {
            title: "Professores",
            url: "/professores",
            icon: UserCheck,
            items: [
                {
                    title: "Todos os Professores",
                    url: "/professores",
                },
                {
                    title: "Novo Professor",
                    url: "/professores/novo",
                },
            ],
        },
        {
            title: "Calendário",
            url: "/calendario",
            icon: Calendar,
            items: [
                {
                    title: "Avisos",
                    url: "/calendario/avisos",
                },
            ],
        },
        {
            title: "Administrativo",
            url: "/work-in-progress?section=administrativo",
            icon: Settings,
            items: [
                {
                    title: "Financeiro",
                    url: "/administrativo/financeiro",
                },
                {
                    title: "Funcionários",
                    url: "/work-in-progress?section=funcionarios",
                    items: [
                        {
                            title: "Tipo de Acesso",
                            url: "/work-in-progress?section=tipo-acesso",
                        }
                    ]
                },
            ],
        },
    ],
    navSecondary: [],
    projects: [],
}
