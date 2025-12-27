"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Users,
    Plus,
    Search,
    MoreHorizontal,
    Shield,
    Briefcase,
    Mail,
    Phone,
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Mock de Funcionários
const mockFuncionarios = [
    {
        id: 1,
        nome: "Ricardo Alberti",
        email: "ricardo.dir@edupro.com",
        cargo: "Diretor Geral",
        departamento: "Diretoria",
        nivelAcesso: "Administrador",
        status: "ativo",
        avatar: "",
    },
    {
        id: 2,
        nome: "Fernanda Lima",
        email: "fernanda.sec@edupro.com",
        cargo: "Secretária Acadêmica",
        departamento: "Secretaria",
        nivelAcesso: "Gestor",
        status: "ativo",
        avatar: "",
    },
    {
        id: 3,
        nome: "Roberto Campos",
        email: "roberto.fin@edupro.com",
        cargo: "Analista Financeiro",
        departamento: "Financeiro",
        nivelAcesso: "Gestor",
        status: "ativo",
        avatar: "",
    },
    {
        id: 4,
        nome: "Juliana Mendes",
        email: "juliana.coord@edupro.com",
        cargo: "Coordenadora Pedagógica",
        departamento: "Pedagógico",
        nivelAcesso: "Gestor",
        status: "ferias",
        avatar: "",
    },
    {
        id: 5,
        nome: "Marcos Silva",
        email: "marcos.ti@edupro.com",
        cargo: "Suporte Técnico",
        departamento: "TI",
        nivelAcesso: "Operacional",
        status: "ativo",
        avatar: "",
    }
]

const acessoColors = {
    "Administrador": "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    "Gestor": "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    "Operacional": "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200",
}

export default function FuncionariosPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [depFilter, setDepFilter] = useState("todos")

    const filteredFuncionarios = mockFuncionarios.filter(func => {
        const matchesSearch = func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            func.cargo.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesDep = depFilter === "todos" || func.departamento === depFilter

        return matchesSearch && matchesDep
    })

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Funcionários
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie a equipe administrativa e seus níveis de acesso ao sistema
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
                    <CardTitle>Equipe Administrativa</CardTitle>
                    <CardDescription>
                        Lista de todos os colaboradores com acesso ao sistema
                    </CardDescription>

                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome ou cargo..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={depFilter} onValueChange={setDepFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Departamento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos Departamentos</SelectItem>
                                <SelectItem value="Diretoria">Diretoria</SelectItem>
                                <SelectItem value="Secretaria">Secretaria</SelectItem>
                                <SelectItem value="Financeiro">Financeiro</SelectItem>
                                <SelectItem value="Pedagógico">Pedagógico</SelectItem>
                                <SelectItem value="TI">T.I.</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Colaborador</TableHead>
                                <TableHead>Cargo / Depto</TableHead>
                                <TableHead>Nível de Acesso</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFuncionarios.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Nenhum funcionário encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredFuncionarios.map((func) => (
                                    <TableRow key={func.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={func.avatar} />
                                                    <AvatarFallback>{func.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{func.nome}</span>
                                                    <span className="text-xs text-muted-foreground">{func.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{func.cargo}</span>
                                                <span className="text-xs text-muted-foreground">{func.departamento}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`font-normal ${acessoColors[func.nivelAcesso as keyof typeof acessoColors]}`}
                                            >
                                                <Shield className="mr-1 h-3 w-3" />
                                                {func.nivelAcesso}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {func.status === 'ativo' ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-orange-500" />
                                                )}
                                                <span className="capitalize text-sm">{func.status}</span>
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
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Editar Dados
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Shield className="mr-2 h-4 w-4" />
                                                        Gerenciar Acesso
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Desativar Conta
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
