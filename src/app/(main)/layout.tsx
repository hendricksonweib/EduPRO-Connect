"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { sidebarData } from "./sidebar-data"
import { authService, type User } from "@/services"

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authService.getCurrentUser()
                setUser(userData)
            } catch (error) {
                console.error('Failed to fetch user:', error)
                authService.logout()
                router.push('/')
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [router])

    const sidebarUser = useMemo(() => {
        if (!user) return null

        const fullName = [user.first_name, user.last_name]
            .filter(Boolean)
            .join(' ')
            .trim()

        return {
            name: fullName || user.username,
            email: user.email,
            avatar: user.avatar || "",
        }
    }, [user])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-muted-foreground">Carregando...</div>
            </div>
        )
    }

    if (!sidebarUser) return null

    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                    <AppSidebar
                        user={sidebarUser}
                        navMain={sidebarData.navMain}
                        navSecondary={sidebarData.navSecondary}
                        projects={sidebarData.projects}
                    />
                    <SidebarInset>
                        {children}
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    )
}