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

import { useEffect } from "react"
import { academicService } from "@/services/academic.service"
import { Teacher as TeacherType } from "@/services/types"
import { toast } from "sonner"

export default function ProfessoresPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [professores, setProfessores] = useState<TeacherType[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const response = await academicService.teachers.getAll();
                // Handle both paginated and non-paginated responses
                setProfessores(Array.isArray(response) ? response : response.results);
            } catch (error) {
                console.error("Error fetching teachers:", error);
                toast.error("Erro ao carregar lista de professores");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfessores();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm("Tem certeza que deseja excluir este professor?")) {
            try {
                await academicService.teachers.delete(id);
                setProfessores(prev => prev.filter(p => p.id !== id));
                toast.success("Professor excluído com sucesso");
            } catch (error) {
                console.error("Error deleting teacher:", error);
                toast.error("Erro ao excluir professor");
            }
        }
    };

    const filteredProfessores = professores.filter(professor =>
        professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.registration.includes(searchTerm) ||
        professor.disciplines?.some(discipline => discipline.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                <TableHead>Telefone</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Carregando professores...
                                    </TableCell>
                                </TableRow>
                            ) : filteredProfessores.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                                                        {professor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{professor.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{professor.registration}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {professor.disciplines?.map((discipline, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {discipline.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{professor.phone}</TableCell>
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
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(professor.id)}
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
