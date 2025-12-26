"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Plus, Search, BookOpen, Users, FileText } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

// Dados de exemplo
const mockTurmas = [
    {
        id: 1,
        nome: "3º Ano A - Ensino Médio",
        periodo: "Matutino",
        ano: "2024",
        totalAlunos: 28,
        totalMaterias: 12,
        professor: "Prof. Carlos Eduardo",
        status: "ativa",
    },
    {
        id: 2,
        nome: "2º Ano B - Ensino Médio",
        periodo: "Vespertino",
        ano: "2024",
        totalAlunos: 32,
        totalMaterias: 11,
        professor: "Profa. Mariana Costa",
        status: "ativa",
    },
    {
        id: 3,
        nome: "1º Ano A - Ensino Fundamental",
        periodo: "Matutino",
        ano: "2024",
        totalAlunos: 25,
        totalMaterias: 8,
        professor: "Profa. Ana Paula",
        status: "ativa",
    },
    {
        id: 4,
        nome: "3º Ano B - Ensino Médio (2023)",
        periodo: "Matutino",
        ano: "2023",
        totalAlunos: 30,
        totalMaterias: 12,
        professor: "Prof. Roberto Silva",
        status: "arquivada",
    },
]

export default function TurmasPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredTurmas = mockTurmas.filter(turma =>
        turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turma.periodo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turma.professor.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <BookOpen className="h-6 w-6" />
                        Gerenciamento de Turmas
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie turmas, alunos e matérias
                    </p>
                </div>
                <Link href="/turmas/nova">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Turma
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Turmas</CardTitle>
                    <CardDescription>
                        Visualize, edite ou gerencie turmas e seus conteúdos
                    </CardDescription>
                    <div className="flex items-center gap-2 pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, período ou professor..."
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
                                <TableHead>Turma</TableHead>
                                <TableHead>Período</TableHead>
                                <TableHead>Ano Letivo</TableHead>
                                <TableHead>Alunos</TableHead>
                                <TableHead>Matérias</TableHead>
                                <TableHead>Professor Responsável</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTurmas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        Nenhuma turma encontrada
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTurmas.map((turma) => (
                                    <TableRow key={turma.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{turma.nome}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{turma.periodo}</TableCell>
                                        <TableCell>{turma.ano}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{turma.totalAlunos}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{turma.totalMaterias}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{turma.professor}</TableCell>
                                        <TableCell>
                                            <Badge variant={turma.status === "ativa" ? "default" : "secondary"}>
                                                {turma.status === "ativa" ? "Ativa" : "Arquivada"}
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
                                                        <Link href={`/turmas/${turma.id}/materias`}>
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            Ver Matérias
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/turmas/editar/${turma.id}`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Editar Turma
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
