"use client"

import { ReactNode } from "react"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface DetailSection {
    title: string
    icon?: ReactNode
    fields: DetailField[]
}

export interface DetailField {
    label: string
    value: string | number | ReactNode
    fullWidth?: boolean
}

export interface DetailSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    subtitle?: string
    description?: string
    avatar?: string | null
    avatarFallback?: string
    badge?: {
        label: string
        variant?: "default" | "secondary" | "destructive" | "outline"
    }
    sections: DetailSection[]
    editUrl?: string
    onDelete?: () => void
    customActions?: ReactNode
}

const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

export function DetailSheet({
    open,
    onOpenChange,
    title,
    subtitle,
    description = "Informações detalhadas",
    avatar,
    avatarFallback,
    badge,
    sections,
    editUrl,
    onDelete,
    customActions,
}: DetailSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg overflow-y-auto p-0">
                {/* Header com padding e background */}
                <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
                    <SheetHeader>
                        <div className="flex items-start justify-between gap-4">
                            <SheetTitle className="flex items-center gap-3 flex-1">
                                {(avatar !== undefined || avatarFallback) && (
                                    <Avatar className="h-14 w-14 ring-2 ring-background shadow-md">
                                        <AvatarImage src={avatar || ""} />
                                        <AvatarFallback className="text-lg font-semibold">
                                            {avatarFallback || getInitials(title)}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-lg truncate">{title}</div>
                                    {subtitle && (
                                        <div className="text-sm text-muted-foreground font-normal truncate">
                                            {subtitle}
                                        </div>
                                    )}
                                </div>
                            </SheetTitle>

                            {/* Menu de 3 pontos */}
                            {(editUrl || onDelete || customActions) && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                            <MoreVertical className="h-4 w-4" />
                                            <span className="sr-only">Abrir menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {customActions}
                                        {editUrl && (
                                            <DropdownMenuItem asChild>
                                                <Link href={editUrl}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        {onDelete && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={onDelete}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                        <SheetDescription className="text-left">
                            {description}
                        </SheetDescription>
                    </SheetHeader>
                </div>

                {/* Content com padding lateral */}
                <div className="px-6 py-6 space-y-6">
                    {/* Badge */}
                    {badge && (
                        <>
                            <div>
                                <Badge variant={badge.variant || "default"} className="text-sm px-3 py-1">
                                    {badge.label}
                                </Badge>
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Sections */}
                    {sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                                    {section.icon}
                                    {section.title}
                                </h3>
                                <div className="grid gap-4 text-sm">
                                    {section.fields.map((field, fieldIndex) => (
                                        <div
                                            key={fieldIndex}
                                            className={`${field.fullWidth
                                                    ? "flex flex-col gap-2"
                                                    : "flex justify-between items-start gap-4"
                                                } py-2`}
                                        >
                                            <span className="text-muted-foreground font-medium min-w-[120px]">
                                                {field.label}:
                                            </span>
                                            <span className={`${field.fullWidth ? 'text-left' : 'text-right'
                                                } font-medium text-foreground flex-1`}>
                                                {field.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {sectionIndex < sections.length - 1 && <Separator className="my-6" />}
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}
