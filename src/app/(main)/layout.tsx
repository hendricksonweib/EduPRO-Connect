"use client"

import { useEffect, useState } from "react"
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
                // If fetching user fails (e.g., token invalid/expired), clear tokens and redirect
                console.error('Failed to fetch user:', error)
                authService.logout()
                router.push('/login')
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [router])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-muted-foreground">Carregando...</div>
            </div>
        )
    }

    if (!user) {
        return null // Will redirect to login
    }

    // Format user data for sidebar
    const sidebarUser = {
        name: user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`.trim()
            : user.username,
        email: user.email,
        avatar: user.avatar || "",
    }

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