"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Plus,
    Search,
    BookOpen,
    Users,
    FileText,
    Loader2,
    Calendar,
    GraduationCap,
    BarChart3,
    ChevronRight,
    LayoutGrid,
    Clock,
    UserCircle,
    ArrowRight,
    School
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { academicService, type Classroom } from "@/services"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DetailSheet, type DetailSection } from "@/components/detail-sheet"

export default function TurmasPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [turmas, setTurmas] = useState<Classroom[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)

    const fetchTurmas = useCallback(async () => {
        try {
            setLoading(true)
            const response = await academicService.classes.getAll()
            setTurmas(response?.results || [])
        } catch (error: any) {
            console.error("Erro ao buscar turmas:", error)
            toast.error(academicService.handleError(error) || "Não foi possível carregar as turmas")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTurmas()
    }, [fetchTurmas])

    const handleDelete = useCallback(async () => {
        if (!deleteId) return

        try {
            await academicService.classes.delete(deleteId)
            toast.success("Turma excluída com sucesso!")
            setTurmas(prev => prev.filter(t => t.id !== deleteId))
            setSelectedClassroom(null)
        } catch (error: any) {
            console.error("Erro ao excluir turma:", error)
            toast.error(academicService.handleError(error) || "Erro ao excluir a turma")
        } finally {
            setDeleteId(null)
        }
    }, [deleteId])

    const filteredTurmas = useMemo(() =>
        turmas.filter(turma => {
            const term = searchTerm.toLowerCase()
            return turma.name.toLowerCase().includes(term) ||
                turma.period.toLowerCase().includes(term) ||
                turma.responsible_teacher_name?.toLowerCase().includes(term)
        }),
        [turmas, searchTerm]
    )

    const stats = useMemo(() => ({
        total: turmas.length,
        ativas: turmas.filter(t => t.status === 'ativa').length,
        alunos: turmas.reduce((acc, t) => acc + (t.total_students || 0), 0),
        periodos: Array.from(new Set(turmas.map(t => t.period))).length
    }), [turmas])

    const classroomDetailSections = useMemo((): DetailSection[] => {
        if (!selectedClassroom) return []

        return [
            {
                title: "Informações da Turma",
                icon: <GraduationCap className="h-4 w-4" />,
                fields: [
                    { label: "Nome", value: selectedClassroom.name },
                    { label: "Período", value: selectedClassroom.period },
                    { label: "Ano Letivo", value: selectedClassroom.year },
                    { label: "Professor Responsável", value: selectedClassroom.responsible_teacher_name || 'Não atribuído' },
                ]
            },
            {
                title: "Estatísticas",
                icon: <BarChart3 className="h-4 w-4" />,
                fields: [
                    {
                        label: "Total de Alunos",
                        value: (
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="font-bold">{selectedClassroom.total_students || 0}</span>
                            </div>
                        )
                    },
                    {
                        label: "Total de Matérias",
                        value: (
                            <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-bold">{selectedClassroom.total_disciplines || 0}</span>
                            </div>
                        )
                    },
                ]
            },
        ]
    }, [selectedClassroom])

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse font-medium">Carregando turmas...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary/80 mb-2 font-medium">
                        <Link href="/dashboard" className="hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-muted-foreground">Turmas</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Gerenciamento de Turmas
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Visualize e administre todas as classes do colégio.
                    </p>
                </div>
                <Link href="/turmas/nova">
                    <Button size="lg" className="shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95 rounded-xl">
                        <Plus className="mr-2 h-5 w-5" />
                        Nova Turma
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-none bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent shadow-none border border-indigo-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-indigo-600 font-medium">
                            <School className="h-4 w-4" />
                            Total de Turmas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-700">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent shadow-none border border-emerald-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-emerald-600 font-medium">
                            <Users className="h-4 w-4" />
                            Alunos Ativos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-700">{stats.alunos}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent shadow-none border border-amber-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-amber-600 font-medium">
                            <Clock className="h-4 w-4" />
                            Períodos Ativos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-700">{stats.periodos}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent shadow-none border border-blue-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-blue-600 font-medium">
                            <GraduationCap className="h-4 w-4" />
                            Turmas Ativas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700">{stats.ativas}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                            placeholder="Buscar por nome, período ou professor..."
                            className="pl-10 h-11 bg-background/50 border-muted rounded-xl focus:ring-primary/20 focus:border-primary transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTurmas.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/10">
                            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                                <School className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Nenhuma turma encontrada</h3>
                            <p className="text-muted-foreground max-w-xs mt-1">
                                Tente ajustar sua busca ou adicione uma nova turma ao sistema.
                            </p>
                        </div>
                    ) : (
                        filteredTurmas.map((turma) => (
                            <Card key={turma.id} className="group overflow-hidden rounded-[2.5rem] border-muted/20 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 bg-background/50 backdrop-blur-sm flex flex-col">
                                <CardHeader className="relative pb-4">
                                    <div className="absolute right-6 top-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-muted transition-colors">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl w-48">
                                                <DropdownMenuLabel>Ações da Turma</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild className="cursor-pointer">
                                                    <Link href={`/turmas/${turma.id}/materias`}>
                                                        <BookOpen className="mr-2 h-4 w-4 text-primary" />
                                                        Matérias e Conteúdos
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild className="cursor-pointer">
                                                    <Link href={`/turmas/editar/${turma.id}`}>
                                                        <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                                                        Editar Cadastro
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => setSelectedClassroom(turma)}>
                                                    <LayoutGrid className="mr-2 h-4 w-4 text-amber-500" />
                                                    Ver Detalhes
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" onClick={(e) => {
                                                    e.stopPropagation()
                                                    setDeleteId(turma.id)
                                                }}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir Turma
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-4 rounded-3xl group-hover:bg-primary/20 transition-colors">
                                            <School className="h-7 w-7 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={turma.status === 'ativa' ? 'default' : 'secondary'} className="text-[10px] uppercase tracking-wider font-bold border-none px-2 rounded-md">
                                                    {turma.status}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {turma.year}
                                                </span>
                                            </div>
                                            <CardTitle className="text-2xl group-hover:text-primary transition-colors leading-tight">
                                                {turma.name}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-6 space-y-6 flex-1">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-muted/30 p-3 rounded-2xl flex items-center gap-2">
                                            <Users className="h-4 w-4 text-primary/60" />
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Alunos</p>
                                                <p className="font-bold text-sm tracking-tight">{turma.total_students || 0}</p>
                                            </div>
                                        </div>
                                        <div className="bg-muted/30 p-3 rounded-2xl flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary/60" />
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Matérias</p>
                                                <p className="font-bold text-sm tracking-tight">{turma.total_disciplines || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-muted/40 p-4 rounded-2xl border border-muted-foreground/5">
                                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary-foreground font-bold text-xs">
                                                {turma.responsible_teacher_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] text-primary uppercase font-bold tracking-widest">Responsável</p>
                                            <p className="font-semibold text-sm truncate">{turma.responsible_teacher_name || 'Não definido'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 pb-6 px-6">
                                    <Button asChild className="w-full h-12 rounded-2xl shadow-sm hover:shadow-lg transition-all group/btn" variant="default">
                                        <Link href={`/turmas/${turma.id}/materias`} className="flex items-center justify-center gap-2">
                                            Acessar Turma
                                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Classroom Details Sheet */}
            <DetailSheet
                open={!!selectedClassroom}
                onOpenChange={(open) => !open && setSelectedClassroom(null)}
                title={selectedClassroom?.name || ""}
                subtitle={`${selectedClassroom?.period} - ${selectedClassroom?.year}`}
                description="Informações detalhadas da turma"
                badge={{
                    label: selectedClassroom?.status === "ativa" ? "Ativa" : "Arquivada",
                    variant: selectedClassroom?.status === "ativa" ? "default" : "secondary"
                }}
                sections={classroomDetailSections}
                editUrl={selectedClassroom ? `/turmas/editar/${selectedClassroom.id}` : undefined}
                onDelete={() => {
                    if (selectedClassroom) {
                        setDeleteId(selectedClassroom.id)
                        setSelectedClassroom(null)
                    }
                }}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Zelar pela integridade escolar?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação removerá permanentemente a turma "{turmas.find(t => t.id === deleteId)?.name}" do sistema.
                            Todos os registros e notas associados poderão ser afetados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                            Sim, Excluir Turma
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

