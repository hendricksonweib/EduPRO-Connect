"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Plus,
    Search,
    User,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    GraduationCap,
    ChevronRight,
    ChevronLeft,
    UserPlus,
    UserCheck,
    Ban,
    LayoutGrid,
    Mail,
    Smartphone,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { academicService, type Student } from "@/services"
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
import { Skeleton } from "@/components/ui/skeleton"

const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
}

const formatCurrency = (value?: number) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function AlunosPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [alunos, setAlunos] = useState<Student[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    const fetchAlunos = useCallback(async (page: number = 1) => {
        try {
            setIsLoading(true)
            const response = await academicService.students.getAll(page)
            setAlunos(response.results)
            setTotalPages(response.total_pages)
            setTotalItems(response.count)
            setCurrentPage(response.current_page)
        } catch (error: any) {
            console.error("Error fetching students:", error)
            toast.error(academicService.handleError(error) || "Erro ao carregar alunos")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAlunos(currentPage)
    }, [fetchAlunos, currentPage])

    const handleDelete = useCallback(async () => {
        if (!deleteId) return

        try {
            await academicService.students.delete(deleteId)
            toast.success("Aluno excluído com sucesso!")
            setAlunos(prev => prev.filter(a => a.id !== deleteId))
            setSelectedStudent(null)
        } catch (error: any) {
            console.error("Error deleting student:", error)
            toast.error(academicService.handleError(error) || "Erro ao excluir aluno")
        } finally {
            setDeleteId(null)
        }
    }, [deleteId])

    const filteredAlunos = useMemo(() =>
        alunos.filter(aluno => {
            const term = searchTerm.toLowerCase()
            return aluno.name.toLowerCase().includes(term) ||
                aluno.registration.includes(searchTerm) ||
                aluno.classroom_name?.toLowerCase().includes(term)
        }),
        [alunos, searchTerm]
    )

    const stats = useMemo(() => ({
        total: alunos.length,
        ativos: alunos.filter(a => a.status === 'ativo').length,
        inativos: alunos.filter(a => a.status === 'inativo').length,
        mensalidadeMedia: alunos.reduce((acc, a) => acc + (a.monthly_fee || 0), 0) / (alunos.length || 1)
    }), [alunos])

    const studentDetailSections = useMemo((): DetailSection[] => {
        if (!selectedStudent) return []

        return [
            {
                title: "Informações Pessoais",
                icon: <User className="h-4 w-4" />,
                fields: [
                    { label: "Data de Nascimento", value: formatDate(selectedStudent.birth_date) },
                    { label: "RG", value: selectedStudent.rg || 'N/A' },
                    { label: "CPF", value: selectedStudent.cpf || 'N/A' },
                ]
            },
            {
                title: "Informações Acadêmicas",
                icon: <Calendar className="h-4 w-4" />,
                fields: [
                    { label: "Turma", value: selectedStudent.classroom_name || 'Não atribuída' },
                ]
            },
            {
                title: "Contato",
                icon: <Phone className="h-4 w-4" />,
                fields: [
                    { label: "Telefone", value: selectedStudent.phone },
                    { label: "Responsável", value: selectedStudent.guardian },
                    ...(selectedStudent.responsible1_name ? [{ label: "Responsável 1", value: selectedStudent.responsible1_name }] : []),
                    ...(selectedStudent.responsible2_name ? [{ label: "Responsável 2", value: selectedStudent.responsible2_name }] : []),
                ]
            },
            {
                title: "Endereço",
                icon: <MapPin className="h-4 w-4" />,
                fields: [
                    { label: "CEP", value: selectedStudent.cep || 'N/A' },
                    { label: "Endereço", value: selectedStudent.address || 'N/A', fullWidth: true },
                ]
            },
            {
                title: "Informações Financeiras",
                icon: <CreditCard className="h-4 w-4" />,
                fields: [
                    { label: "Mensalidade", value: formatCurrency(selectedStudent.monthly_fee) },
                    { label: "Dia de Vencimento", value: selectedStudent.due_day || 'N/A' },
                ]
            },
        ]
    }, [selectedStudent])

    if (isLoading && alunos.length === 0) {
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

                <div className="grid gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                    ))}
                </div>

                <div className="flex flex-col gap-6">
                    <Skeleton className="h-11 w-full max-w-md rounded-xl" />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-72 w-full rounded-[2rem]" />
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
                        <span className="text-muted-foreground">Alunos</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Corpo Discente
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Gerencie as matrículas e informações dos alunos.
                    </p>
                </div>
                <Link href="/alunos/novo">
                    <Button size="lg" className="shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95 rounded-xl">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Matricular Aluno
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-none bg-primary/10 shadow-none border border-primary/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-primary font-medium">
                            <GraduationCap className="h-4 w-4" />
                            Total de Alunos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-emerald-500/10 shadow-none border border-emerald-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-emerald-600 font-medium">
                            <UserCheck className="h-4 w-4" />
                            Ativos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-700">{stats.ativos}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-red-500/10 shadow-none border border-red-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-red-600 font-medium">
                            <Ban className="h-4 w-4" />
                            Inativos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-700">{stats.inativos}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-blue-500/10 shadow-none border border-blue-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-blue-600 font-medium">
                            <CreditCard className="h-4 w-4" />
                            Mensalidade Média
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">{formatCurrency(stats.mensalidadeMedia)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                        placeholder="Buscar por nome, matrícula ou turma..."
                        className="pl-10 h-11 bg-background border-muted rounded-xl focus:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredAlunos.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted/40">
                            <User className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-bold">Nenhum aluno encontrado</h3>
                            <p className="text-muted-foreground max-w-xs mt-2">
                                Não encontramos registros para sua busca.
                            </p>
                        </div>
                    ) : (
                        filteredAlunos.map((aluno) => (
                            <Card key={aluno.id} className="group overflow-hidden rounded-[2rem] border-muted/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col">
                                <CardHeader className="pb-4 relative">
                                    <div className="absolute right-4 top-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setSelectedStudent(aluno)}>
                                                    <LayoutGrid className="mr-2 h-4 w-4" /> Detalhes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/alunos/editar/${aluno.id}`}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => setDeleteId(aluno.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex flex-col items-center text-center mt-4">
                                        <div className="relative mb-3">
                                            <Avatar className="h-20 w-20 border-4 border-background shadow-lg group-hover:scale-105 transition-transform">
                                                <AvatarImage src={aluno.avatar || ""} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                                    {getInitials(aluno.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <Badge variant={aluno.status === 'ativo' ? 'default' : 'secondary'} className="absolute -bottom-1 right-0 border-2 border-background px-2 py-0.5 text-[10px] uppercase font-bold">
                                                {aluno.status}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                            {aluno.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs font-medium uppercase tracking-wider mt-1">
                                            Matrícula: {aluno.registration}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-6 space-y-4 flex-1">
                                    <div className="bg-muted/30 p-4 rounded-2xl space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground font-medium flex items-center gap-2">
                                                <School className="h-4 w-4 text-primary/60" /> Turma
                                            </span>
                                            <span className="font-bold">{aluno.classroom_name || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground font-medium flex items-center gap-2">
                                                <Smartphone className="h-4 w-4 text-primary/60" /> Contato
                                            </span>
                                            <span className="font-semibold">{aluno.phone || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 px-1">
                                        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Responsável</p>
                                            <p className="text-xs font-semibold truncate">{aluno.guardian || 'Não informado'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 pb-6 px-6">
                                    <Button variant="outline" className="w-full rounded-xl hover:bg-primary hover:text-primary-foreground transition-all" onClick={() => setSelectedStudent(aluno)}>
                                        Perfil Completo
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between bg-card/60 backdrop-blur-sm p-4 rounded-3xl border border-muted/30 shadow-sm mt-8">
                        <p className="text-sm text-muted-foreground font-medium">
                            Mostrando <span className="text-foreground font-bold">{alunos.length}</span> de <span className="text-foreground font-bold">{totalItems}</span> alunos
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1 || isLoading}
                                className="rounded-xl transition-all active:scale-95"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                            </Button>
                            <div className="flex items-center gap-1 mx-2">
                                <span className="text-sm font-bold text-primary">{currentPage}</span>
                                <span className="text-sm text-muted-foreground">/</span>
                                <span className="text-sm font-medium text-muted-foreground">{totalPages}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages || isLoading}
                                className="rounded-xl transition-all active:scale-95"
                            >
                                Próximo <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Student Details Sheet */}
            <DetailSheet
                open={!!selectedStudent}
                onOpenChange={(open) => !open && setSelectedStudent(null)}
                title={selectedStudent?.name || ""}
                subtitle={`Matrícula: ${selectedStudent?.registration}`}
                description="Informações detalhadas do aluno"
                avatar={selectedStudent?.avatar}
                avatarFallback={selectedStudent ? getInitials(selectedStudent.name) : ""}
                badge={{
                    label: selectedStudent?.status === "ativo" ? "Ativo" : "Inativo",
                    variant: selectedStudent?.status === "ativo" ? "default" : "secondary"
                }}
                sections={studentDetailSections}
                editUrl={selectedStudent ? `/alunos/editar/${selectedStudent.id}` : undefined}
                onDelete={() => {
                    if (selectedStudent) {
                        setDeleteId(selectedStudent.id)
                        setSelectedStudent(null)
                    }
                }}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-[2rem]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir registro de aluno?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação é definitiva. Todos os dados escolares, notas e frequências de <strong>{alunos.find(a => a.id === deleteId)?.name}</strong> serão removidos permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                            Sim, Excluir Aluno
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

