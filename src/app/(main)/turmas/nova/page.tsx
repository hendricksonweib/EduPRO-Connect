"use client"

import { useEffect, useState } from "react"
import { BookOpen, Users, X, Plus, Search, Loader2, ChevronRight } from "lucide-react"
import Link from "next/link"
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
import { academicService } from "@/services/academic.service"
import { Student, Teacher } from "@/services/types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function NovaTurmaPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [allStudents, setAllStudents] = useState<Student[]>([])
    const [alunosSelecionados, setAlunosSelecionados] = useState<Student[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    // Form states
    const [nome, setNome] = useState("")
    const [periodo, setPeriodo] = useState("")
    const [ano, setAno] = useState(new Date().getFullYear())
    const [professorId, setProfessorId] = useState("")

    useEffect(() => {
        async function loadData() {
            try {
                const [teachersRes, studentsRes] = await Promise.all([
                    academicService.teachers.getAll(),
                    academicService.students.getAll()
                ])
                setTeachers(teachersRes?.results || [])
                setAllStudents(studentsRes?.results || [])
            } catch (error) {
                console.error("Erro ao carregar dados:", error)
                toast.error("Erro ao carregar professores e alunos.")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const studentsDisponiveis = (allStudents || []).filter(
        aluno => !(alunosSelecionados || []).find(a => a.id === aluno.id)
    ).filter(
        aluno => (aluno.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (aluno.registration || "").includes(searchTerm)
    )

    const adicionarAluno = (aluno: Student) => {
        setAlunosSelecionados([...alunosSelecionados, aluno])
        setSearchTerm("")
    }

    const removerAluno = (alunoId: number) => {
        setAlunosSelecionados(alunosSelecionados.filter(a => a.id !== alunoId))
    }

    const handleSubmit = async () => {
        if (!nome || !periodo || !ano) {
            toast.error("Por favor, preencha todos os campos obrigatórios.")
            return
        }

        try {
            setSubmitting(true)
            await academicService.classes.create({
                name: nome,
                period: periodo as any,
                year: ano,
                responsible_teacher: professorId ? parseInt(professorId) : undefined,
                student_ids: alunosSelecionados.map(a => a.id) as any,
                status: 'ativa'
            })
            toast.success("Turma criada com sucesso!")
            router.push("/turmas")
        } catch (error) {
            console.error("Erro ao criar turma:", error)
            toast.error(academicService.handleError(error))
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Carregando dados...</span>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary/80 mb-2 font-medium">
                        <Link href="/turmas" className="hover:text-primary transition-colors">
                            Turmas
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-muted-foreground">Nova Turma</span>
                    </div>
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
                                <Input
                                    id="nome"
                                    placeholder="Ex: 3º Ano A - Ensino Médio"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="periodo">Período</Label>
                                    <select
                                        id="periodo"
                                        value={periodo}
                                        onChange={(e) => setPeriodo(e.target.value)}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Matutino">Matutino</option>
                                        <option value="Vespertino">Vespertino</option>
                                        <option value="Noturno">Noturno</option>
                                        <option value="Integral">Integral</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ano">Ano Letivo</Label>
                                    <Input
                                        id="ano"
                                        type="number"
                                        placeholder="2024"
                                        value={ano}
                                        onChange={(e) => setAno(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="professor">Professor Responsável</Label>
                                <select
                                    id="professor"
                                    value={professorId}
                                    onChange={(e) => setProfessorId(e.target.value)}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <option value="">Selecione...</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                    ))}
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
                                                    <AvatarImage src={aluno.avatar || ""} />
                                                    <AvatarFallback>
                                                        {aluno.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{aluno.name}</p>
                                                    <p className="text-xs text-muted-foreground">Mat: {aluno.registration}</p>
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
                            <Button variant="outline" onClick={() => router.push("/turmas")}>Cancelar</Button>
                            <Button onClick={handleSubmit} disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Criar Turma
                            </Button>
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
                                {studentsDisponiveis.length === 0 ? (
                                    <div className="text-center py-4 text-sm text-muted-foreground">
                                        {searchTerm ? "Nenhum aluno encontrado" : "Busque alunos para adicionar"}
                                    </div>
                                ) : (
                                    studentsDisponiveis.map((aluno) => (
                                        <div
                                            key={aluno.id}
                                            className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={aluno.avatar || ""} />
                                                    <AvatarFallback className="text-xs">
                                                        {aluno.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{aluno.name}</p>
                                                    <p className="text-xs text-muted-foreground">{aluno.registration}</p>
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
