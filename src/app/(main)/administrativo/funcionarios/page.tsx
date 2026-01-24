"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Plus,
    Search,
    Users,
    Shield,
    Loader2,
    User,
    Mail,
    ChevronRight,
    Briefcase,
    ShieldCheck,
    Key,
    UserPlus
} from "lucide-react"
import Link from "next/link"
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { userService, type User as UserType } from "@/services"
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

const getInitials = (user: UserType) => {
    if (user.first_name && user.last_name) {
        return `${user.first_name[0]}${user.last_name[0]}`
    }
    return user.username.slice(0, 2).toUpperCase()
}

const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
        'ADMINISTRATIVO': 'Administrativo',
        'OPERACIONAL': 'Operacional',
        'FINANCEIRO': 'Financeiro',
    }
    return roles[role] || role
}

const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
        'ADMINISTRATIVO': 'default',
        'FINANCEIRO': 'secondary',
        'OPERACIONAL': 'outline',
    }
    return variants[role] || 'outline'
}

export default function FuncionariosPage() {
    const [employees, setEmployees] = useState<UserType[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [selectedEmployee, setSelectedEmployee] = useState<UserType | null>(null)

    const fetchEmployees = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await userService.getAll()
            setEmployees(Array.isArray(data) ? data : [])
        } catch (error: any) {
            console.error("Failed to fetch employees:", error)
            toast.error("Erro ao carregar funcionários")
            setEmployees([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchEmployees()
    }, [fetchEmployees])

    const handleDelete = useCallback(async () => {
        if (!deleteId) return

        try {
            await userService.delete(deleteId)
            toast.success("Funcionário excluído com sucesso")
            setEmployees(prev => prev.filter(e => e.id !== deleteId))
            setSelectedEmployee(null)
        } catch (error: any) {
            console.error("Failed to delete employee:", error)
            toast.error("Erro ao excluir funcionário")
        } finally {
            setDeleteId(null)
        }
    }, [deleteId])

    const filteredEmployees = useMemo(() =>
        employees.filter(emp => {
            const term = searchTerm.toLowerCase()
            const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase()
            return emp.username.toLowerCase().includes(term) ||
                emp.email.toLowerCase().includes(term) ||
                fullName.includes(term)
        }),
        [employees, searchTerm]
    )

    const stats = useMemo(() => {
        const total = employees.length
        const admin = employees.filter(e => e.role === 'ADMINISTRATIVO').length
        const finance = employees.filter(e => e.role === 'FINANCEIRO').length
        const operational = employees.filter(e => e.role === 'OPERACIONAL').length

        return [
            {
                title: "Total de Funcionários",
                value: total.toString(),
                description: "Colaboradores registrados",
                icon: Users,
                color: "text-blue-600",
                bg: "bg-blue-100/50",
                gradient: "from-blue-500/10 to-blue-500/5"
            },
            {
                title: "Administrativo",
                value: admin.toString(),
                description: "Acessos administrativos",
                icon: ShieldCheck,
                color: "text-purple-600",
                bg: "bg-purple-100/50",
                gradient: "from-purple-500/10 to-purple-500/5"
            },
            {
                title: "Financeiro",
                value: finance.toString(),
                description: "Gestores financeiros",
                icon: Key,
                color: "text-amber-600",
                bg: "bg-amber-100/50",
                gradient: "from-amber-500/10 to-amber-500/5"
            },
            {
                title: "Operacional",
                value: operational.toString(),
                description: "Equipe de apoio",
                icon: Briefcase,
                color: "text-emerald-600",
                bg: "bg-emerald-100/50",
                gradient: "from-emerald-500/10 to-emerald-500/5"
            }
        ]
    }, [employees])

    const employeeDetailSections = useMemo((): DetailSection[] => {
        if (!selectedEmployee) return []

        return [
            {
                title: "Informações Pessoais",
                icon: <User className="h-4 w-4" />,
                fields: [
                    { label: "Nome Completo", value: selectedEmployee.first_name && selectedEmployee.last_name ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : 'N/A' },
                    { label: "Nome de Usuário", value: selectedEmployee.username },
                ]
            },
            {
                title: "Contato",
                icon: <Mail className="h-4 w-4" />,
                fields: [
                    { label: "Email", value: selectedEmployee.email },
                ]
            },
            {
                title: "Nível de Acesso",
                icon: <Shield className="h-4 w-4" />,
                fields: [
                    {
                        label: "Função",
                        value: (
                            <Badge variant={getRoleBadgeVariant(selectedEmployee.role)}>
                                {getRoleLabel(selectedEmployee.role)}
                            </Badge>
                        )
                    },
                ]
            },
        ]
    }, [selectedEmployee])

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            {/* Header com Breadcrumbs */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary/80 mb-2 font-medium">
                        <span className="text-muted-foreground">Administrativo</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-muted-foreground">Funcionários</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Gestão de Funcionários
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie os membros da equipe e seus níveis de acesso ao sistema.
                    </p>
                </div>
                <Link href="/administrativo/funcionarios/novo">
                    <Button className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Novo Funcionário
                    </Button>
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className={`overflow-hidden border-none shadow-md bg-gradient-to-br ${stat.gradient}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`rounded-xl p-2 ${stat.bg} ${stat.color} shadow-sm`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-xl bg-card/60 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b bg-muted/30 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Lista de Colaboradores
                            </CardTitle>
                            <CardDescription>
                                Total de {filteredEmployees.length} funcionários encontrados
                            </CardDescription>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, usuário ou email..."
                                className="pl-9 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex h-64 flex-col items-center justify-center gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
                            <p className="text-muted-foreground animate-pulse font-medium">Carregando dados...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                                        <TableHead className="py-4 font-bold text-foreground pl-6">Funcionário</TableHead>
                                        <TableHead className="py-4 font-bold text-foreground">Email</TableHead>
                                        <TableHead className="py-4 font-bold text-foreground">Nível de Acesso</TableHead>
                                        <TableHead className="py-4 font-bold text-foreground text-right pr-6">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEmployees.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-20">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Users className="h-12 w-12 opacity-20" />
                                                    <p className="text-lg font-medium">Nenhum funcionário encontrado</p>
                                                    <p className="text-sm">Tente ajustar seus termos de busca</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredEmployees.map((emp) => (
                                            <TableRow
                                                key={emp.id}
                                                className="group cursor-pointer hover:bg-muted/40 transition-colors border-b border-muted/20"
                                                onClick={() => setSelectedEmployee(emp)}
                                            >
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                                                                <AvatarImage src={emp.avatar} />
                                                                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                                    {getInitials(emp)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background shadow-sm" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                                {emp.first_name && emp.last_name
                                                                    ? `${emp.first_name} ${emp.last_name}`
                                                                    : emp.username}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground font-medium italic">@{emp.username}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                        <Mail className="h-3.5 w-3.5 text-primary/40" />
                                                        {emp.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getRoleBadgeVariant(emp.role)}
                                                        className="px-3 py-1 rounded-full font-semibold shadow-sm"
                                                    >
                                                        <Shield className="mr-1.5 h-3 w-3" />
                                                        {getRoleLabel(emp.role)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors rounded-full">
                                                                <span className="sr-only">Abrir menu</span>
                                                                <MoreHorizontal className="h-5 w-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 p-2">
                                                            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase">Gerenciamento</DropdownMenuLabel>
                                                            <DropdownMenuSeparator className="my-1" />
                                                            <DropdownMenuItem asChild className="cursor-pointer rounded-md focus:bg-primary/5 focus:text-primary transition-colors">
                                                                <Link href={`/administrativo/funcionarios/editar/${emp.id}`} className="flex items-center w-full">
                                                                    <Pencil className="mr-2.5 h-4 w-4 text-primary/60" />
                                                                    <span className="font-medium">Editar Perfil</span>
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:bg-destructive/10 cursor-pointer rounded-md transition-colors"
                                                                onClick={() => setDeleteId(emp.id)}
                                                            >
                                                                <Trash2 className="mr-2.5 h-4 w-4 text-destructive/60" />
                                                                <span className="font-medium">Excluir Acesso</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Employee Details Sheet */}
            <DetailSheet
                open={!!selectedEmployee}
                onOpenChange={(open) => !open && setSelectedEmployee(null)}
                title={selectedEmployee?.first_name && selectedEmployee?.last_name
                    ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                    : selectedEmployee?.username || ""}
                subtitle={`@${selectedEmployee?.username}`}
                description="Informações detalhadas do funcionário"
                avatar={selectedEmployee?.avatar}
                avatarFallback={selectedEmployee ? getInitials(selectedEmployee) : ""}
                badge={{
                    label: selectedEmployee ? getRoleLabel(selectedEmployee.role) : "",
                    variant: selectedEmployee ? getRoleBadgeVariant(selectedEmployee.role) : "outline"
                }}
                sections={employeeDetailSections}
                editUrl={selectedEmployee ? `/administrativo/funcionarios/editar/${selectedEmployee.id}` : undefined}
                onDelete={() => {
                    if (selectedEmployee) {
                        setDeleteId(selectedEmployee.id)
                        setSelectedEmployee(null)
                    }
                }}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o funcionário
                            e removerá seu acesso ao sistema.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
