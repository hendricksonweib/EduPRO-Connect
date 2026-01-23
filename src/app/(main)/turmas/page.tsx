"use client"

import { useEffect, useState } from "react"
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
import { academicService } from "@/services/academic.service"
import { Classroom } from "@/services/types"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export default function TurmasPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [turmas, setTurmas] = useState<Classroom[]>([])
    const [loading, setLoading] = useState(true)

    const fetchTurmas = async () => {
        try {
            setLoading(true)
            const response = await academicService.classes.getAll()
            setTurmas(response?.results || [])
        } catch (error) {
            console.error("Erro ao buscar turmas:", error)
            toast.error("Não foi possível carregar as turmas.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTurmas()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir esta turma?")) return

        try {
            await academicService.classes.delete(id)
            toast.success("Turma excluída com sucesso!")
            fetchTurmas()
        } catch (error) {
            console.error("Erro ao excluir turma:", error)
            toast.error("Erro ao excluir a turma.")
        }
    }

    const filteredTurmas = (turmas || []).filter(turma =>
        (turma.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (turma.period || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (turma.responsible_teacher_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        Gerenciamento de Turmas
                    </h1>
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
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={8}>
                                            <Skeleton className="h-8 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : filteredTurmas.length === 0 ? (
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
                                                <span className="font-medium">{turma.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{turma.period}</TableCell>
                                        <TableCell>{turma.year}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{turma.total_students || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{turma.total_disciplines || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{turma.responsible_teacher_name || "Não atribuído"}</TableCell>
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
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(turma.id)}
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
