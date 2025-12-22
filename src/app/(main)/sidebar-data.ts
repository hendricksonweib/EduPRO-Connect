import {
    BookOpen,
    Calendar,
    LayoutDashboard,
    Settings,
    Users,
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
            url: "/work-in-progress?section=turmas",
            icon: BookOpen,
            items: [
                {
                    title: "Matérias",
                    url: "/work-in-progress?section=materias",
                    items: [
                        {
                            title: "Conteúdos",
                            url: "/work-in-progress?section=conteudos",
                        }
                    ]
                },
            ],
        },
        {
            title: "Cadastros",
            url: "/work-in-progress?section=cadastros",
            icon: Users,
            items: [
                {
                    title: "Alunos",
                    url: "/cadastros/alunos",
                },
                {
                    title: "Professores",
                    url: "/work-in-progress?section=professores",
                },
            ],
        },
        {
            title: "Calendário",
            url: "/work-in-progress?section=calendario",
            icon: Calendar,
            items: [
                {
                    title: "Avisos",
                    url: "/work-in-progress?section=avisos",
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
                    url: "/work-in-progress?section=financeiro",
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
