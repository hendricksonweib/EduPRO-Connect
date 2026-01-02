"use client"

import Image from "next/image"
import banner from "@/assets/banner.jpg"
import {
  Users,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Trophy,
  GraduationCap,
  AlertTriangle,
  BarChart3
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Dados Mockados para Insights
const kpis = [
  {
    title: "Média Global",
    value: "8.4",
    description: "+0.2 pontos vs. mês anterior",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/20"
  },
  {
    title: "Frequência Geral",
    value: "96%",
    description: "Estável comparado à semana passada",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    title: "Matérias em Alerta",
    value: "2",
    description: "Matérias com média abaixo de 7.0",
    icon: AlertTriangle,
    color: "text-orange-600",
    bg: "bg-orange-100 dark:bg-orange-900/20"
  },
  {
    title: "Turmas Ativas",
    value: "12",
    description: "Total de turmas cadastradas",
    icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/20"
  }
]

const desempenhoPorMateria = [
  { nome: "História", nota: 9.2, status: "excelente" },
  { nome: "Geografia", nota: 8.9, status: "excelente" },
  { nome: "Português", nota: 8.5, status: "bom" },
  { nome: "Matemática", nota: 7.2, status: "medio" },
  { nome: "Física", nota: 6.8, status: "alerta" },
]

const rankingTurmas = [
  { nome: "3º Ano A - Médio", media: 9.1, alunos: 28 },
  { nome: "2º Ano B - Médio", media: 8.8, alunos: 32 },
  { nome: "9º Ano A - Fund.", media: 8.5, alunos: 25 },
  { nome: "1º Ano A - Médio", media: 7.9, alunos: 30 },
]

const alunosDestaque = [
  { nome: "Beatriz Santos", turma: "3º Ano A", media: 9.8, avatar: "" },
  { nome: "João Silva", turma: "3º Ano A", media: 9.7, avatar: "" },
  { nome: "Mariana Costa", turma: "2º Ano B", media: 9.6, avatar: "" },
  { nome: "Pedro Oliveira", turma: "9º Ano A", media: 9.5, avatar: "" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Banner Section */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-sm">
        <Image
          src={banner}
          alt="Dashboard Banner"
          className="w-full h-auto object-cover max-h-[200px]"
          placeholder="blur"
          priority
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Pedagógico</h1>
          <p className="text-muted-foreground">
            Visão geral do desempenho acadêmico e insights da escola
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            Ano Letivo 2025
          </Badge>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Desempenho por Matéria */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Desempenho por Disciplina
            </CardTitle>
            <CardDescription>
              Média geral das notas dos alunos nas principais disciplinas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {desempenhoPorMateria.map((materia) => (
                <div key={materia.nome} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{materia.nome}</div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{materia.nota}</span>
                      <span className="text-muted-foreground text-xs">/ 10</span>
                    </div>
                  </div>
                  <Progress
                    value={materia.nota * 10}
                    className={`h-2 
                                            ${materia.status === 'excelente' ? '[&>div]:bg-green-500' :
                        materia.status === 'alerta' ? '[&>div]:bg-red-500' :
                          materia.status === 'medio' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-blue-500'
                      }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ranking de Turmas e Alunos */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Destaques do Mês
            </CardTitle>
            <CardDescription>
              Turmas e alunos com melhor desempenho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Melhor Turma */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Melhores Turmas (Média Geral)
              </h4>
              <div className="space-y-3">
                {rankingTurmas.slice(0, 3).map((turma, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center font-bold text-muted-foreground w-6">
                        {i + 1}º
                      </div>
                      <div>
                        <div className="font-medium text-sm">{turma.nome}</div>
                        <div className="text-xs text-muted-foreground">{turma.alunos} alunos</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-background">
                      {turma.media}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Alunos */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                Alunos Destaque
              </h4>
              <div className="space-y-4">
                {alunosDestaque.map((aluno, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={aluno.avatar} />
                        <AvatarFallback>{aluno.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{aluno.nome}</p>
                        <p className="text-xs text-muted-foreground">{aluno.turma}</p>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-green-600">
                      {aluno.media}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
