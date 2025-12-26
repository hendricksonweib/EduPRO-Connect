"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Plus, Search, GraduationCap } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

// Dados de exemplo
const mockAlunos = [
    {
        id: 1,
        nome: "João Silva Santos",
        matricula: "2024001",
        turma: "3º Ano A",
        responsavel: "Maria Silva",
        telefone: "(11) 98765-4321",
        status: "ativo",
        avatar: "",
    },
    {
        id: 2,
        nome: "Ana Paula Costa",
        matricula: "2024002",
        turma: "2º Ano B",
        responsavel: "Carlos Costa",
        telefone: "(11) 97654-3210",
        status: "ativo",
        avatar: "",
    },
    {
        id: 3,
        nome: "Pedro Henrique Oliveira",
        matricula: "2024003",
        turma: "1º Ano A",
        responsavel: "Fernanda Oliveira",
        telefone: "(11) 96543-2109",
        status: "ativo",
        avatar: "",
    },
    {
        id: 4,
        nome: "Beatriz Santos Lima",
        matricula: "2024004",
        turma: "3º Ano B",
        responsavel: "Roberto Lima",
        telefone: "(11) 95432-1098",
        status: "inativo",
        avatar: "",
    },
]

export default function AlunosPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredAlunos = mockAlunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.matricula.includes(searchTerm) ||
        aluno.turma.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <GraduationCap className="h-6 w-6" />
                        Gerenciamento de Alunos
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie todos os alunos cadastrados no sistema
                    </p>
                </div>
                <Link href="/alunos/novo">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Aluno
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Alunos</CardTitle>
                    <CardDescription>
                        Visualize, edite ou remova alunos cadastrados
                    </CardDescription>
                    <div className="flex items-center gap-2 pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, matrícula ou turma..."
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
                                <TableHead>Aluno</TableHead>
                                <TableHead>Matrícula</TableHead>
                                <TableHead>Turma</TableHead>
                                <TableHead>Responsável</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAlunos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Nenhum aluno encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAlunos.map((aluno) => (
                                    <TableRow key={aluno.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={aluno.avatar} />
                                                    <AvatarFallback>
                                                        {aluno.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{aluno.nome}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{aluno.matricula}</TableCell>
                                        <TableCell>{aluno.turma}</TableCell>
                                        <TableCell>{aluno.responsavel}</TableCell>
                                        <TableCell>{aluno.telefone}</TableCell>
                                        <TableCell>
                                            <Badge variant={aluno.status === "ativo" ? "default" : "secondary"}>
                                                {aluno.status === "ativo" ? "Ativo" : "Inativo"}
                                            </Badge>
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
                                                        <Link href={`/alunos/editar/${aluno.id}`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
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
