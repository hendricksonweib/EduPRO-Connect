"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Plus,
    Search,
    FileText,
    BookOpen,
    Users,
    BookMarked,
    ChevronRight,
    GraduationCap,
    Clock,
    Calendar,
    ArrowRight
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { academicService } from "@/services"
import { type ClassroomSubject, type Classroom, type Subject, type Teacher } from "@/services/types"
import { Skeleton } from "@/components/ui/skeleton"
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

export default function MateriasPage() {
    const params = useParams()
    const turmaId = Number(params?.id)

    const [searchTerm, setSearchTerm] = useState("")
    const [materias, setMaterias] = useState<ClassroomSubject[]>([])
    const [classroom, setClassroom] = useState<Classroom | null>(null)
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        subject: "",
        teacher: "",
    })

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true)
            const [classroomData, materiasData, subjectsData, teachersData] = await Promise.all([
                academicService.classes.getById(turmaId),
                academicService.classroomSubjects.getAll(turmaId),
                academicService.subjects.getAll(),
                academicService.teachers.getAll(),
            ])
            setClassroom(classroomData)
            setMaterias(materiasData.results)
            setSubjects(subjectsData.results)
            setTeachers(teachersData.results.filter(t => t.status === 'ativo'))
        } catch (error: any) {
            console.error("Error fetching data:", error)
            toast.error(academicService.handleError(error) || "Erro ao carregar dados")
        } finally {
            setIsLoading(false)
        }
    }, [turmaId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.subject) {
            toast.error("Selecione uma matéria")
            return
        }

        try {
            const data: Partial<ClassroomSubject> = {
                classroom: turmaId,
                subject: Number(formData.subject),
            }

            if (formData.teacher) {
                data.teacher = Number(formData.teacher)
            }

            await academicService.classroomSubjects.create(data)
            toast.success("Matéria adicionada com sucesso!")
            setDialogOpen(false)
            setFormData({ subject: "", teacher: "" })
            fetchData()
        } catch (error: any) {
            console.error("Error creating classroom subject:", error)
            toast.error(academicService.handleError(error) || "Erro ao adicionar matéria")
        }
    }, [formData, turmaId, fetchData])

    const handleDelete = useCallback(async () => {
        if (!deleteId) return

        try {
            await academicService.classroomSubjects.delete(deleteId)
            toast.success("Matéria removida com sucesso!")
            setMaterias(prev => prev.filter(m => m.id !== deleteId))
        } catch (error: any) {
            console.error("Error deleting subject:", error)
            toast.error(academicService.handleError(error) || "Erro ao excluir matéria")
        } finally {
            setDeleteId(null)
        }
    }, [deleteId])

    const filteredMaterias = useMemo(() =>
        materias.filter(materia => {
            const term = searchTerm.toLowerCase()
            return (materia.subject_name?.toLowerCase().includes(term) ||
                materia.teacher_name?.toLowerCase().includes(term))
        }),
        [materias, searchTerm]
    )

    const totalConteudos = useMemo(() =>
        materias.reduce((acc, m) => acc + (m.total_contents || 0), 0),
        [materias]
    )

    if (isLoading && materias.length === 0) {
        return (
            <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Skeleton className="h-4 w-20" />
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-9 w-64 mb-2" />
                        <Skeleton className="h-5 w-80" />
                    </div>
                    <Skeleton className="h-11 w-44 rounded-xl" />
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                    ))}
                </div>

                <div className="flex flex-col gap-6">
                    <Skeleton className="h-11 w-full max-w-md rounded-xl" />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-3xl" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary/80 mb-2 font-medium">
                        <Link href="/turmas" className="hover:text-primary transition-colors">
                            Turmas
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-muted-foreground">{classroom?.name || 'Turma'}</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Matérias da Turma
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        {classroom?.name} • {classroom?.period} • {classroom?.year}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95">
                                <Plus className="mr-2 h-5 w-5" />
                                Adicionar Matéria
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle className="text-xl">Vincular Matéria</DialogTitle>
                                    <DialogDescription>
                                        Selecione uma disciplina e o professor que irá lecionar para esta turma.
                                        Se a matéria não existir, você pode <Link href="/administrativo/materias" className="text-primary hover:underline font-semibold">cadastrá-la aqui</Link>.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="text-sm font-semibold">Disciplina *</Label>
                                        <select
                                            id="subject"
                                            className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={formData.subject}
                                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                            required
                                        >
                                            <option value="">Selecione uma disciplina</option>
                                            {subjects.map((subject) => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="teacher" className="text-sm font-semibold">Professor Responsável</Label>
                                        <select
                                            id="teacher"
                                            className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={formData.teacher}
                                            onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
                                        >
                                            <option value="">Ainda não definido</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl">
                                        Voltar
                                    </Button>
                                    <Button type="submit" className="rounded-xl px-8 shadow-md">
                                        Vincular
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-none bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent shadow-none border border-blue-500/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-blue-600 font-medium">
                            <BookOpen className="h-4 w-4" />
                            Matérias Ativas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700">{materias.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent shadow-none border border-purple-500/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-purple-600 font-medium">
                            <FileText className="h-4 w-4" />
                            Total de Materiais
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-700">{totalConteudos}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent shadow-none border border-emerald-500/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-emerald-600 font-medium">
                            <Users className="h-4 w-4" />
                            Alunos Inscritos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-700">{classroom?.total_students || 0}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent shadow-none border border-orange-500/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-orange-600 font-medium">
                            <Clock className="h-4 w-4" />
                            Período Letivo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-700 line-clamp-1">{classroom?.period || 'N/A'}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                            placeholder="Buscar por matéria ou professor..."
                            className="pl-10 h-11 bg-background/50 border-muted rounded-xl focus:ring-primary/20 focus:border-primary transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredMaterias.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
                            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                                <BookMarked className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Nenhuma matéria encontrada</h3>
                            <p className="text-muted-foreground max-w-xs mt-1">
                                Tente ajustar sua busca ou adicione uma nova matéria a esta turma.
                            </p>
                        </div>
                    ) : (
                        filteredMaterias.map((materia) => (
                            <Card key={materia.id} className="group overflow-hidden rounded-3xl border-muted/20 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5">
                                <CardHeader className="relative pb-4">
                                    <div className="absolute right-4 top-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuLabel>Opções</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" onClick={() => setDeleteId(materia.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Remover da Turma
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                            <BookOpen className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] uppercase tracking-wider font-bold border-none px-2 rounded-md">
                                                Matéria
                                            </Badge>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {materia.subject_name}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-6">
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-2xl">
                                            <Avatar className="h-10 w-10 border-2 border-background">
                                                {/* <AvatarImage src={materia.teacher_avatar} /> */}
                                                <AvatarFallback className="bg-gradient-to-br from-muted-foreground to-muted text-xs">
                                                    {materia.teacher_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Professor</p>
                                                <p className="font-semibold text-sm line-clamp-1">{materia.teacher_name || 'Não atribuído'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm px-1">
                                            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                                <FileText className="h-4 w-4" />
                                                <span>{materia.total_contents || 0} materiais</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                                <Calendar className="h-4 w-4" />
                                                <span>{classroom?.year}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 pb-6 px-6">
                                    <Button asChild className="w-full h-11 rounded-xl shadow-sm hover:shadow-md transition-all group/btn" variant="default">
                                        <Link href={`/turmas/${turmaId}/materias/${materia.id}/conteudos`} className="flex items-center justify-center gap-2">
                                            Acessar Materiais
                                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Zelar pelo histórico escolar?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação removerá a disciplina desta turma. Note que todos os materiais e registros
                            associados não estarão mais acessíveis aqui. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                            Sim, Remover
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

