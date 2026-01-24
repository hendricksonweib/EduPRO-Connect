"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
    Plus,
    Search,
    BookOpen,
    Loader2,
    MoreHorizontal,
    Pencil,
    Trash2,
    Settings,
    ChevronRight
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
import { academicService, type Subject } from "@/services"
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
import Link from "next/link"

export default function GlobalSubjectsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
    })

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await academicService.subjects.getAll()
            setSubjects(data.results)
        } catch (error: any) {
            console.error("Error fetching subjects:", error)
            toast.error(academicService.handleError(error) || "Erro ao carregar matérias")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setIsSubmitting(true)
            if (editingSubject) {
                await academicService.subjects.update(editingSubject.id, formData)
                toast.success("Matéria atualizada com sucesso!")
            } else {
                await academicService.subjects.create(formData)
                toast.success("Matéria criada com sucesso!")
            }
            setDialogOpen(false)
            setEditingSubject(null)
            setFormData({ name: "" })
            fetchData()
        } catch (error: any) {
            console.error("Error saving subject:", error)
            toast.error(academicService.handleError(error) || "Erro ao salvar matéria")
        } finally {
            setIsSubmitting(false)
        }
    }, [formData, editingSubject, fetchData])

    const handleDelete = useCallback(async () => {
        if (!deleteId) return

        try {
            await academicService.subjects.delete(deleteId)
            toast.success("Matéria excluída com sucesso!")
            setSubjects(prev => prev.filter(s => s.id !== deleteId))
        } catch (error: any) {
            console.error("Error deleting subject:", error)
            toast.error(academicService.handleError(error) || "Erro ao excluir matéria")
        } finally {
            setDeleteId(null)
        }
    }, [deleteId])

    const filteredSubjects = useMemo(() =>
        subjects.filter(subject =>
            subject.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [subjects, searchTerm]
    )

    if (isLoading && subjects.length === 0) {
        return (
            <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Skeleton className="h-4 w-24" />
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-9 w-64 mb-2" />
                        <Skeleton className="h-5 w-80" />
                    </div>
                    <Skeleton className="h-11 w-44 rounded-xl" />
                </div>

                <Card className="rounded-[2rem] border-muted/30 shadow-sm overflow-hidden">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-10 w-72 rounded-xl" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary/80 mb-2 font-medium">
                        <Link href="/administrativo" className="hover:text-primary transition-colors">
                            Administrativo
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-muted-foreground">Gerenciar Matérias</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Matérias Globais
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Gerencie a lista mestre de disciplinas disponíveis no sistema.
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open)
                    if (!open) {
                        setEditingSubject(null)
                        setFormData({ name: "" })
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-lg shadow-primary/20 rounded-xl">
                            <Plus className="mr-2 h-5 w-5" />
                            Nova Matéria
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-3xl">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-2xl">{editingSubject ? "Editar Matéria" : "Nova Matéria"}</DialogTitle>
                                <DialogDescription>
                                    Defina o nome da disciplina que poderá ser vinculada às turmas.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="font-semibold">Nome da Matéria *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Matemática, História, etc."
                                        className="rounded-xl h-11"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl">
                                    Cancelar
                                </Button>
                                <Button type="submit" className="rounded-xl px-8 shadow-md" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {editingSubject ? "Salvar Alterações" : "Criar Matéria"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="rounded-[2rem] border-muted/30 shadow-sm overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Disciplinas Cadastradas</CardTitle>
                            <CardDescription>Total de {subjects.length} matérias no sistema.</CardDescription>
                        </div>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar matéria..."
                                className="pl-10 rounded-xl h-10 bg-muted/20 border-none focus-visible:ring-1"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredSubjects.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-3xl">
                                Nenhuma matéria encontrada.
                            </div>
                        ) : (
                            filteredSubjects.map((subject) => (
                                <div
                                    key={subject.id}
                                    className="group flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors rounded-2xl border border-transparent hover:border-primary/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <span className="font-semibold">{subject.name}</span>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl">
                                            <DropdownMenuItem onClick={() => {
                                                setEditingSubject(subject)
                                                setFormData({ name: subject.name })
                                                setDialogOpen(true)
                                            }}>
                                                <Pencil className="mr-2 h-4 w-4" /> Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive focus:bg-destructive/10"
                                                onClick={() => setDeleteId(subject.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Matéria Permanente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Isso removerá esta matéria globalmente. Se ela estiver vinculada a alguma turma,
                            poderá causar erros de exibição.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                            Sim, Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
