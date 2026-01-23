"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { MoreHorizontal, Pencil, Trash2, Plus, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
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

const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2)

export default function AlunosPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [alunos, setAlunos] = useState<Student[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const fetchAlunos = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await academicService.students.getAll()
            setAlunos(response.results)
        } catch (error: any) {
            console.error("Error fetching students:", error)
            toast.error(academicService.handleError(error) || "Erro ao carregar alunos")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAlunos()
    }, [fetchAlunos])

    const handleDelete = useCallback(async () => {
        if (!deleteId) return

        try {
            await academicService.students.delete(deleteId)
            toast.success("Aluno excluído com sucesso!")
            setAlunos(prev => prev.filter(a => a.id !== deleteId))
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

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    Gerenciamento de Alunos
                </h1>
                <Link href="/alunos/novo">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Aluno
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
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
                    {isLoading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
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
                                                        <AvatarImage src={aluno.avatar || ""} />
                                                        <AvatarFallback>
                                                            {getInitials(aluno.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{aluno.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{aluno.registration}</TableCell>
                                            <TableCell>{aluno.classroom_name || "N/A"}</TableCell>
                                            <TableCell>{aluno.guardian}</TableCell>
                                            <TableCell>{aluno.phone}</TableCell>
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
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => setDeleteId(aluno.id)}
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
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o aluno
                            e todos os dados associados do sistema.
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
