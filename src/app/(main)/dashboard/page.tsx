"use client"

import { useEffect, useState } from "react"
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
import { academicService } from "@/services/academic.service"
import { DashboardData } from "@/services/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const stats = await academicService.getDashboardStats()
        setData(stats)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px]" />
          <Skeleton className="col-span-3 h-[400px]" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const { kpis, performance_per_discipline, ranking_turmas, alunos_destaque } = data

  // Map icon strings to components
  const iconMap: Record<string, any> = {
    TrendingUp,
    Users,
    AlertTriangle,
    GraduationCap
  }

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
        {kpis.map((kpi, index) => {
          const IconComponent = iconMap[kpi.icon] || BarChart3
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${kpi.bg}`}>
                  <IconComponent className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
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
              {performance_per_discipline.length > 0 ? (
                performance_per_discipline.map((materia) => (
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
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground py-10">Nenhum dado de desempenho disponível.</p>
              )}
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
                {ranking_turmas.length > 0 ? (
                  ranking_turmas.map((turma, i) => (
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
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">Nenhuma turma ranqueada.</p>
                )}
              </div>
            </div>

            {/* Top Alunos */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                Alunos Destaque
              </h4>
              <div className="space-y-4">
                {alunos_destaque.length > 0 ? (
                  alunos_destaque.map((aluno, i) => (
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
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">Nenhum aluno em destaque.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
