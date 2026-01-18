"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Plus, Search, Users, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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
import { userService, type User } from "@/services"
import { toast } from "sonner"

export default function FuncionariosPage() {
    const [employees, setEmployees] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchEmployees()
    }, [])

    const fetchEmployees = async () => {
        setIsLoading(true)
        try {
            const data = await userService.getAll()
            setEmployees(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Failed to fetch employees:", error)
            toast.error("Erro ao carregar funcionários")
            setEmployees([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este funcionário?")) return

        try {
            await userService.delete(id)
            toast.success("Funcionário excluído com sucesso")
            fetchEmployees()
        } catch (error) {
            console.error("Failed to delete employee:", error)
            toast.error("Erro ao excluir funcionário")
        }
    }

    const filteredEmployees = employees.filter(emp =>
        emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getRoleLabel = (role: string) => {
        const roles: Record<string, string> = {
            'ADMINISTRATIVO': 'Administrativo',
            'OPERACIONAL': 'Operacional',
            'FINANCEIRO': 'Financeiro',
        }
        return roles[role] || role
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Gerenciamento de Funcionários
                    </h1>
                    <p className="text-muted-foreground">
                        Visualize e gerencie os acessos dos funcionários ao sistema
                    </p>
                </div>
                <Link href="/administrativo/funcionarios/novo">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Funcionário
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Funcionários</CardTitle>
                    <CardDescription>
                        Todos os usuários cadastrados com seus respectivos níveis de acesso
                    </CardDescription>
                    <div className="flex items-center gap-2 pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, usuário ou email..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Funcionário</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Nível de Acesso</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : filteredEmployees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Nenhum funcionário encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <TableRow key={emp.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={emp.avatar} />
                                                    <AvatarFallback>
                                                        {emp.first_name ? emp.first_name[0] : emp.username[0]}
                                                        {emp.last_name ? emp.last_name[0] : ""}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {emp.first_name && emp.last_name
                                                            ? `${emp.first_name} ${emp.last_name}`
                                                            : emp.username}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">@{emp.username}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{emp.email}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-primary" />
                                                <span>{getRoleLabel(emp.role)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/administrativo/funcionarios/editar/${emp.id}`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(emp.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
