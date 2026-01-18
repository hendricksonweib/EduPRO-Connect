"use client"

import { useState, useEffect } from "react"
import { Plus, Loader2, Bell, Users, Calendar, Trash2 } from "lucide-react"
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

export default function AvisosPage() {
    const [notices, setNotices] = useState<Notice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quadro de Avisos</h1>
                    <p className="text-muted-foreground">Gerencie os comunicados e avisos da escola.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
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
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : notices.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <Bell className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Nenhum aviso publicado</h3>
                    <p className="text-sm text-muted-foreground">Clique em "Novo Aviso" para começar.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {notices.map((notice) => (
                        <Card key={notice.id} className="flex flex-col">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge className={`${getAudienceColor(notice.audience)} hover:${getAudienceColor(notice.audience)} text-white border-0`}>
                                        {notice.audience}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDeleteNotice(notice.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="mt-2 text-lg line-clamp-1" title={notice.title}>
                                    {notice.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(notice.date).toLocaleDateString('pt-BR')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {notice.message}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
