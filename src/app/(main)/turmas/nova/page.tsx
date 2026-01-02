"use client"

import { useState } from "react"
import { BookOpen, Users, X, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock de alunos disponíveis
const mockAlunosDisponiveis = [
    { id: 1, nome: "João Silva Santos", matricula: "2024001", avatar: "" },
    { id: 2, nome: "Ana Paula Costa", matricula: "2024002", avatar: "" },
    { id: 3, nome: "Pedro Henrique Oliveira", matricula: "2024003", avatar: "" },
    { id: 4, nome: "Beatriz Santos Lima", matricula: "2024004", avatar: "" },
    { id: 5, nome: "Carlos Eduardo Ferreira", matricula: "2024005", avatar: "" },
    { id: 6, nome: "Mariana Costa Silva", matricula: "2024006", avatar: "" },
]

export default function NovaTurmaPage() {
    const [alunosSelecionados, setAlunosSelecionados] = useState<typeof mockAlunosDisponiveis>([])
    const [searchTerm, setSearchTerm] = useState("")

    const alunosDisponiveis = mockAlunosDisponiveis.filter(
        aluno => !alunosSelecionados.find(a => a.id === aluno.id)
    ).filter(
        aluno => aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            aluno.matricula.includes(searchTerm)
    )

    const adicionarAluno = (aluno: typeof mockAlunosDisponiveis[0]) => {
        setAlunosSelecionados([...alunosSelecionados, aluno])
        setSearchTerm("")
    }

    const removerAluno = (alunoId: number) => {
        setAlunosSelecionados(alunosSelecionados.filter(a => a.id !== alunoId))
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <BookOpen className="h-6 w-6" />
                        Nova Turma
                    </h1>
                    <p className="text-muted-foreground">
                        Crie uma nova turma e adicione alunos
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_400px]">
                {/* Coluna Principal - Formulário */}
                <div className="space-y-6">
                    {/* Dados Básicos da Turma */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações da Turma</CardTitle>
                            <CardDescription>
                                Defina o nome, período e ano letivo da turma
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome da Turma</Label>
                                <Input id="nome" placeholder="Ex: 3º Ano A - Ensino Médio" />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="periodo">Período</Label>
                                    <select
                                        id="periodo"
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="matutino">Matutino</option>
                                        <option value="vespertino">Vespertino</option>
                                        <option value="noturno">Noturno</option>
                                        <option value="integral">Integral</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ano">Ano Letivo</Label>
                                    <Input id="ano" type="number" placeholder="2024" defaultValue="2024" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="professor">Professor Responsável</Label>
                                <select
                                    id="professor"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="1">Prof. Carlos Eduardo Santos</option>
                                    <option value="2">Profa. Mariana Costa Lima</option>
                                    <option value="3">Prof. Roberto Silva Oliveira</option>
                                    <option value="4">Profa. Ana Paula Ferreira</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alunos da Turma */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Alunos da Turma
                            </CardTitle>
                            <CardDescription>
                                {alunosSelecionados.length} aluno(s) adicionado(s)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {alunosSelecionados.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Nenhum aluno adicionado ainda
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {alunosSelecionados.map((aluno) => (
                                        <div
                                            key={aluno.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={aluno.avatar} />
                                                    <AvatarFallback>
                                                        {aluno.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{aluno.nome}</p>
                                                    <p className="text-xs text-muted-foreground">Mat: {aluno.matricula}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removerAluno(aluno.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline">Cancelar</Button>
                            <Button>Criar Turma</Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Coluna Lateral - Adicionar Alunos */}
                <div className="space-y-6">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Adicionar Alunos</CardTitle>
                            <CardDescription>
                                Busque e adicione alunos à turma
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar aluno..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {alunosDisponiveis.length === 0 ? (
                                    <div className="text-center py-4 text-sm text-muted-foreground">
                                        {searchTerm ? "Nenhum aluno encontrado" : "Todos os alunos foram adicionados"}
                                    </div>
                                ) : (
                                    alunosDisponiveis.map((aluno) => (
                                        <div
                                            key={aluno.id}
                                            className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={aluno.avatar} />
                                                    <AvatarFallback className="text-xs">
                                                        {aluno.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{aluno.nome}</p>
                                                    <p className="text-xs text-muted-foreground">{aluno.matricula}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => adicionarAluno(aluno)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
