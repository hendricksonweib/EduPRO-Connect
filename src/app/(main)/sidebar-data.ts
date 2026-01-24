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
        },
        {
            title: "Turmas",
            url: "/turmas",
            icon: BookOpen,
        },
        {
            title: "Alunos",
            url: "/alunos",
            icon: GraduationCap,
        },
        {
            title: "Professores",
            url: "/professores",
            icon: UserCheck,
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
            url: "/administrativo",
            icon: Settings,
            items: [
                {
                    title: "Funcionários",
                    url: "/administrativo/funcionarios",
                },
                {
                    title: "Matérias",
                    url: "/administrativo/materias",
                },
                {
                    title: "Financeiro",
                    url: "/administrativo/financeiro",
                },
            ],
        },

    ],
    navSecondary: [],
    projects: [],
}
