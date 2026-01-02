"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Plus, Search, FileText, BookOpen, Users } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
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
const mockMaterias = [
    {
        id: 1,
        nome: "Matemática",
        professor: "Prof. Carlos Eduardo Santos",
        totalConteudos: 15,
        ultimaAtualizacao: "2024-12-20",
    },
    {
        id: 2,
        nome: "Português",
        professor: "Profa. Mariana Costa Lima",
        totalConteudos: 22,
        ultimaAtualizacao: "2024-12-22",
    },
    {
        id: 3,
        nome: "História",
        professor: "Prof. Roberto Silva Oliveira",
        totalConteudos: 18,
        ultimaAtualizacao: "2024-12-19",
    },
    {
        id: 4,
        nome: "Geografia",
        professor: "Prof. Roberto Silva Oliveira",
        totalConteudos: 12,
        ultimaAtualizacao: "2024-12-18",
    },
]

export default function MateriasPage() {
    const params = useParams()
    const turmaId = params?.id ?? 'unknown'
    const [searchTerm, setSearchTerm] = useState("")

    const filteredMaterias = mockMaterias.filter(materia =>
        materia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materia.professor.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Link href="/turmas" className="hover:underline">
                            Turmas
                        </Link>
                        <span>/</span>
                        <span>3º Ano A - Ensino Médio</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <BookOpen className="h-6 w-6" />
                        Matérias da Turma
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie as matérias e conteúdos desta turma
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Matéria
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total de Matérias</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockMaterias.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total de Conteúdos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockMaterias.reduce((acc, m) => acc + m.totalConteudos, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Alunos na Turma</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            28
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Matérias</CardTitle>
                    <CardDescription>
                        Visualize e gerencie os conteúdos de cada matéria
                    </CardDescription>
                    <div className="flex items-center gap-2 pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por matéria ou professor..."
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
                                <TableHead>Matéria</TableHead>
                                <TableHead>Professor</TableHead>
                                <TableHead>Conteúdos</TableHead>
                                <TableHead>Última Atualização</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMaterias.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Nenhuma matéria encontrada
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredMaterias.map((materia) => (
                                    <TableRow key={materia.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{materia.nome}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{materia.professor}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {materia.totalConteudos} conteúdo(s)
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(materia.ultimaAtualizacao).toLocaleDateString('pt-BR')}
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
                                                        <Link href={`/turmas/${turmaId}/materias/${materia.id}/conteudos`}>
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            Ver Conteúdos
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Editar Matéria
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
