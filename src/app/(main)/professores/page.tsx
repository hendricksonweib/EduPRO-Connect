"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Plus,
    Search,
    UserCheck,
    Loader2,
    User,
    Phone,
    Mail,
    Briefcase,
    GraduationCap,
    CreditCard,
    Calendar,
    ChevronRight,
    LayoutGrid,
    BookOpen,
    Users,
    BadgeCheck,
    Award
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
import { academicService, type Teacher } from "@/services"
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

const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
}

export default function ProfessoresPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [professores, setProfessores] = useState<Teacher[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

    const fetchProfessores = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await academicService.teachers.getAll()
            setProfessores(response.results)
        } catch (error: any) {
            console.error("Error fetching teachers:", error)
            toast.error(academicService.handleError(error) || "Erro ao carregar professores")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProfessores()
    }, [fetchProfessores])

    const handleDelete = useCallback(async () => {
        if (!deleteId) return

        try {
            await academicService.teachers.delete(deleteId)
            toast.success("Professor excluído com sucesso!")
            setProfessores(prev => prev.filter(p => p.id !== deleteId))
            setSelectedTeacher(null)
        } catch (error: any) {
            console.error("Error deleting teacher:", error)
            toast.error(academicService.handleError(error) || "Erro ao excluir professor")
        } finally {
            setDeleteId(null)
        }
    }, [deleteId])

    const filteredProfessores = useMemo(() =>
        professores.filter(professor => {
            const term = searchTerm.toLowerCase()
            return professor.name.toLowerCase().includes(term) ||
                professor.registration.includes(searchTerm) ||
                professor.disciplines?.some(d => d.name.toLowerCase().includes(term))
        }),
        [professores, searchTerm]
    )

    const stats = useMemo(() => ({
        total: professores.length,
        ativos: professores.filter(p => p.status === 'ativo').length,
        disciplinas: Array.from(new Set(professores.flatMap(p => p.disciplines?.map(d => d.id) || []))).length,
        especialistas: professores.filter(p => (p.education || '').toLowerCase().includes('pos') || (p.education || '').toLowerCase().includes('mestre')).length
    }), [professores])

    const teacherDetailSections = useMemo((): DetailSection[] => {
        if (!selectedTeacher) return []

        return [
            {
                title: "Informações Pessoais",
                icon: <User className="h-4 w-4" />,
                fields: [
                    { label: "Data de Nascimento", value: formatDate(selectedTeacher.birth_date) },
                    { label: "CPF", value: selectedTeacher.cpf || 'N/A' },
                    { label: "RG", value: selectedTeacher.rg || 'N/A' },
                    { label: "Data de Admissão", value: formatDate(selectedTeacher.admission_date) },
                ]
            },
            {
                title: "Dados Profissionais",
                icon: <Briefcase className="h-4 w-4" />,
                fields: [
                    { label: "Formação", value: selectedTeacher.education },
                    {
                        label: "Disciplinas",
                        value: selectedTeacher.disciplines && selectedTeacher.disciplines.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {selectedTeacher.disciplines.map((d, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                        {d.name}
                                    </Badge>
                                ))}
                            </div>
                        ) : 'Nenhuma disciplina atribuída',
                        fullWidth: true
                    },
                ]
            },
            {
                title: "Contato",
                icon: <Phone className="h-4 w-4" />,
                fields: [
                    { label: "Email", value: selectedTeacher.email },
                    { label: "Telefone", value: selectedTeacher.phone },
                ]
            },
            {
                title: "Dados Bancários",
                icon: <CreditCard className="h-4 w-4" />,
                fields: [
                    { label: "Banco", value: selectedTeacher.bank || 'N/A' },
                    { label: "Agência", value: selectedTeacher.agency || 'N/A' },
                    { label: "Conta", value: selectedTeacher.account || 'N/A' },
                    { label: "PIX", value: selectedTeacher.pix || 'N/A' },
                ]
            },
        ]
    }, [selectedTeacher])

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse font-medium">Carregando professores...</p>
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
                        <span className="text-muted-foreground">Professores</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Corpo Docente
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Gerencie a equipe pedagógica e suas atribuições.
                    </p>
                </div>
                <Link href="/professores/novo">
                    <Button size="lg" className="shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95 rounded-xl">
                        <Plus className="mr-2 h-5 w-5" />
                        Novo Professor
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-none bg-indigo-500/10 shadow-none border border-indigo-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-indigo-600 font-medium">
                            <UserCheck className="h-4 w-4" />
                            Total de Professores
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-700">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-emerald-500/10 shadow-none border border-emerald-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-emerald-600 font-medium">
                            <BadgeCheck className="h-4 w-4" />
                            Ativos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-700">{stats.ativos}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-amber-500/10 shadow-none border border-amber-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-amber-600 font-medium">
                            <BookOpen className="h-4 w-4" />
                            Disciplinas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-700">{stats.disciplinas}</div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-blue-500/10 shadow-none border border-blue-500/20 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-blue-600 font-medium">
                            <Award className="h-4 w-4" />
                            Especialistas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700">{stats.especialistas}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                        placeholder="Buscar por nome, matrícula ou matéria..."
                        className="pl-10 h-11 bg-background border-muted rounded-xl focus:ring-primary/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProfessores.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted/40">
                            <UserCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-bold text-foreground">Nenhum professor encontrado</h3>
                            <p className="text-muted-foreground max-w-xs mt-2">
                                Tente ajustar sua busca ou adicione um novo professor.
                            </p>
                        </div>
                    ) : (
                        filteredProfessores.map((professor) => (
                            <Card key={professor.id} className="group overflow-hidden rounded-[2rem] border-muted/30 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 bg-background/50 backdrop-blur-sm flex flex-col">
                                <CardHeader className="pb-4 relative">
                                    <div className="absolute right-4 top-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl w-48">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setSelectedTeacher(professor)}>
                                                    <LayoutGrid className="mr-2 h-4 w-4" /> Ver Detalhes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/professores/editar/${professor.id}`}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Editar Cadastro
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => setDeleteId(professor.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir Professor
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex flex-col items-center text-center mt-4">
                                        <Avatar className="h-20 w-20 border-4 border-background shadow-lg mb-3 group-hover:scale-105 transition-transform duration-300">
                                            <AvatarImage src={professor.avatar || ""} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/30 text-primary text-xl font-bold">
                                                {getInitials(professor.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Badge variant={professor.status === 'ativo' ? 'default' : 'secondary'} className="mb-2 text-[10px] uppercase font-bold tracking-wider">
                                            {professor.status}
                                        </Badge>
                                        <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                            {professor.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs font-semibold uppercase tracking-tighter mt-1 opacity-70">
                                            Reg: {professor.registration}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-6 space-y-4 flex-1 text-center">
                                    <div className="flex flex-wrap justify-center gap-1.5 min-h-[52px]">
                                        {professor.disciplines && professor.disciplines.length > 0 ? (
                                            professor.disciplines.slice(0, 3).map((d) => (
                                                <Badge key={d.id} variant="secondary" className="bg-primary/5 text-primary border-none rounded-lg text-[10px] font-bold">
                                                    {d.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground italic mt-2">Nenhuma disciplina atribuída</span>
                                        )}
                                        {professor.disciplines && professor.disciplines.length > 3 && (
                                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-none rounded-lg text-[10px] font-bold">
                                                +{professor.disciplines.length - 3}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="bg-muted/30 p-4 rounded-2xl flex flex-col gap-2">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                                            <span className="truncate">{professor.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <Phone className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                                            <span>{professor.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 pb-6 px-6">
                                    <Button variant="outline" className="w-full rounded-xl hover:bg-primary hover:text-primary-foreground group-hover:border-primary transition-all" onClick={() => setSelectedTeacher(professor)}>
                                        Ver Perfil
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Teacher Details Sheet */}
            <DetailSheet
                open={!!selectedTeacher}
                onOpenChange={(open) => !open && setSelectedTeacher(null)}
                title={selectedTeacher?.name || ""}
                subtitle={`Matrícula: ${selectedTeacher?.registration}`}
                description="Informações detalhadas do professor"
                avatar={selectedTeacher?.avatar}
                avatarFallback={selectedTeacher ? getInitials(selectedTeacher.name) : ""}
                badge={{
                    label: selectedTeacher?.status === "ativo" ? "Ativo" : "Inativo",
                    variant: selectedTeacher?.status === "ativo" ? "default" : "secondary"
                }}
                sections={teacherDetailSections}
                editUrl={selectedTeacher ? `/professores/editar/${selectedTeacher.id}` : undefined}
                onDelete={() => {
                    if (selectedTeacher) {
                        setDeleteId(selectedTeacher.id)
                        setSelectedTeacher(null)
                    }
                }}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-[2.5rem]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Desvincular professor?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ao excluir o registro de <strong>{professores.find(p => p.id === deleteId)?.name}</strong>, ele será removido de todas as turmas e disciplinas vinculadas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                            Sim, Excluir Registro
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

