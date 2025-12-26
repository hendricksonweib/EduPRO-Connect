"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Plus, Search, UserCheck } from "lucide-react"
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
const mockProfessores = [
    {
        id: 1,
        nome: "Dr. Carlos Eduardo Santos",
        matricula: "PROF2024001",
        materias: ["Matemática", "Física"],
        formacao: "Mestrado",
        telefone: "(11) 98765-1234",
        status: "ativo",
        avatar: "",
    },
    {
        id: 2,
        nome: "Prof. Mariana Costa Lima",
        matricula: "PROF2024002",
        materias: ["Português", "Literatura"],
        formacao: "Pós-Graduação",
        telefone: "(11) 97654-5678",
        status: "ativo",
        avatar: "",
    },
    {
        id: 3,
        nome: "Roberto Silva Oliveira",
        matricula: "PROF2024003",
        materias: ["História", "Geografia"],
        formacao: "Graduação",
        telefone: "(11) 96543-9012",
        status: "ativo",
        avatar: "",
    },
    {
        id: 4,
        nome: "Dra. Ana Paula Ferreira",
        matricula: "PROF2024004",
        materias: ["Química", "Biologia"],
        formacao: "Doutorado",
        telefone: "(11) 95432-3456",
        status: "inativo",
        avatar: "",
    },
]

export default function ProfessoresPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredProfessores = mockProfessores.filter(professor =>
        professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.matricula.includes(searchTerm) ||
        professor.materias.some(materia => materia.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <UserCheck className="h-6 w-6" />
                        Gerenciamento de Professores
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie todos os professores cadastrados no sistema
                    </p>
                </div>
                <Link href="/professores/novo">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Professor
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Professores</CardTitle>
                    <CardDescription>
                        Visualize, edite ou remova professores cadastrados
                    </CardDescription>
                    <div className="flex items-center gap-2 pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, matrícula ou matéria..."
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
                                <TableHead>Professor</TableHead>
                                <TableHead>Matrícula</TableHead>
                                <TableHead>Matérias</TableHead>
                                <TableHead>Formação</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProfessores.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Nenhum professor encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProfessores.map((professor) => (
                                    <TableRow key={professor.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={professor.avatar} />
                                                    <AvatarFallback>
                                                        {professor.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{professor.nome}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{professor.matricula}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {professor.materias.map((materia, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {materia}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{professor.formacao}</TableCell>
                                        <TableCell>{professor.telefone}</TableCell>
                                        <TableCell>
                                            <Badge variant={professor.status === "ativo" ? "default" : "secondary"}>
                                                {professor.status === "ativo" ? "Ativo" : "Inativo"}
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
                                                        <Link href={`/professores/editar/${professor.id}`}>
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
