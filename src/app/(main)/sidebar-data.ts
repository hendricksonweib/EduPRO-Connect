import {
    BookOpen,
    DollarSign,
    GraduationCap,
    LayoutDashboard,
    ShieldCheck,
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
            title: "Alunos e Turmas",
            url: "/alunos-turmas",
            icon: GraduationCap,
        },
        {
            title: "Financeiro",
            url: "/financeiro",
            icon: DollarSign,
        },
        {
            title: "Pedagógico",
            url: "/pedagogico",
            icon: BookOpen,
        },
        {
            title: "Portaria",
            url: "/portaria",
            icon: ShieldCheck,
        },
    ],
    navSecondary: [],
    projects: [],
}
