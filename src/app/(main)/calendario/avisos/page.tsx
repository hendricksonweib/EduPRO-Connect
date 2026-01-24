"use client"

import { useState, useEffect } from "react"
import { Plus, Loader2, Bell, Users, Calendar, Trash2, ChevronRight, Megaphone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { calendarService } from "@/services/calendar.service"
import type { Notice } from "@/services/types"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function AvisosPage() {
    const [notices, setNotices] = useState<Notice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // New Notice State
    const [newNotice, setNewNotice] = useState<Partial<Notice>>({
        title: "",
        message: "",
        audience: "Todos",
        is_active: true
    })

    const fetchNotices = async () => {
        setIsLoading(true)
        try {
            const response = await calendarService.notices.getAll()
            setNotices(response.results)
        } catch (error) {
            console.error("Erro ao carregar avisos:", error)
            toast.error("Erro ao carregar avisos.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchNotices()
    }, [])

    const handleCreateNotice = async () => {
        if (!newNotice.title || !newNotice.message) {
            toast.error("Preencha título e mensagem.")
            return
        }

        setIsSubmitting(true)
        try {
            await calendarService.notices.create(newNotice)
            toast.success("Aviso criado com sucesso!")
            setIsDialogOpen(false)
            setNewNotice({
                title: "",
                message: "",
                audience: "Todos",
                is_active: true
            })
            fetchNotices()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao criar aviso.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteNotice = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este aviso?")) return

        try {
            await calendarService.notices.delete(id)
            toast.success("Aviso excluído com sucesso")
            fetchNotices()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao excluir aviso")
        }
    }

    const getAudienceColor = (audience: string) => {
        switch (audience) {
            case 'Todos': return 'bg-blue-500'
            case 'Alunos': return 'bg-green-500'
            case 'Professores': return 'bg-purple-500'
            case 'Responsáveis': return 'bg-orange-500'
            default: return 'bg-gray-500'
        }
    }

    if (isLoading && notices.length === 0) {
        return (
            <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Skeleton className="h-4 w-20" />
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-9 w-64 mb-2" />
                        <Skeleton className="h-5 w-80" />
                    </div>
                    <Skeleton className="h-11 w-44 rounded-xl" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-[2rem]" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary/80 mb-2 font-medium">
                        <Link href="/calendario" className="hover:text-primary transition-colors">
                            Calendário
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-muted-foreground">Avisos</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Quadro de Avisos
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Gerencie os comunicados e avisos da comunidade escolar.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95 rounded-xl">
                            <Plus className="mr-2 h-5 w-5" />
                            Novo Aviso
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                            <DialogTitle>Criar Novo Aviso</DialogTitle>
                            <DialogDescription>
                                Envie um comunicado para alunos, professores ou todos.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    value={newNotice.title}
                                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="audience">Público Alvo</Label>
                                <Select
                                    value={newNotice.audience}
                                    onValueChange={(val: any) => setNewNotice({ ...newNotice, audience: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o público" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Todos">Todos</SelectItem>
                                        <SelectItem value="Alunos">Alunos</SelectItem>
                                        <SelectItem value="Professores">Professores</SelectItem>
                                        <SelectItem value="Responsáveis">Responsáveis</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="message">Mensagem *</Label>
                                <textarea
                                    id="message"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newNotice.message}
                                    onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button onClick={handleCreateNotice} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publicar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                        {selectedNotice && (
                            <>
                                <div className={`h-32 w-full ${getAudienceColor(selectedNotice.audience)} flex items-center justify-center relative`}>
                                    <Megaphone className="h-16 w-16 text-white/20 absolute -right-4 -bottom-4 rotate-12" />
                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                        {selectedNotice.audience}
                                    </Badge>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-2 text-xs font-bold text-primary/60 mb-2 uppercase tracking-tighter">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Publicado em {new Date(selectedNotice.date).toLocaleDateString('pt-BR')}
                                    </div>
                                    <DialogTitle className="text-3xl font-extrabold tracking-tight mb-6">
                                        {selectedNotice.title}
                                    </DialogTitle>
                                    <div className="bg-muted/30 p-6 rounded-3xl">
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {selectedNotice.message}
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter className="p-8 pt-0">
                                    <Button variant="outline" className="rounded-xl w-full sm:w-auto" onClick={() => setIsDetailOpen(false)}>
                                        Fechar Comunicado
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : notices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted/40">
                    <Megaphone className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-bold">Nenhum aviso publicado</h3>
                    <p className="text-muted-foreground max-w-xs mt-2">
                        Clique em "Novo Aviso" para começar a enviar comunicados.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {notices.map((notice) => (
                        <Card key={notice.id} className="group overflow-hidden rounded-[2rem] border-muted/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col">
                            <CardHeader className="pb-4 relative">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge className={`${getAudienceColor(notice.audience)} hover:${getAudienceColor(notice.audience)} text-white border-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                                        {notice.audience}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        onClick={() => handleDeleteNotice(notice.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2" title={notice.title}>
                                    {notice.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs font-medium mt-1">
                                    <Calendar className="h-3.5 w-3.5 text-primary/60" />
                                    {new Date(notice.date).toLocaleDateString('pt-BR')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pb-6">
                                <div className="bg-muted/30 p-4 rounded-2xl h-full">
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-4">
                                        {notice.message}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 pb-6 px-6">
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                                    onClick={() => {
                                        setSelectedNotice(notice)
                                        setIsDetailOpen(true)
                                    }}
                                >
                                    Ver Detalhes
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
