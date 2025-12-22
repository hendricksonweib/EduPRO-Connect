import { type LucideIcon } from "lucide-react"
import { Sidebar } from "@/components/ui/sidebar"
import * as React from "react"

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
    navMain: {
        title: string;
        url: string;
        icon: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
    navSecondary: {
        title: string;
        url: string;
        icon?: LucideIcon;
    }[];
    projects: {
        name: string;
        url: string;
        icon?: LucideIcon;
    }[];
}
