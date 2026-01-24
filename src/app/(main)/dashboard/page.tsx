"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
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
  BarChart3,
  LayoutGrid,
  School,
  Clock
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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

const ICON_MAP = {
  TrendingUp,
  Users,
  AlertTriangle,
  GraduationCap,
  BarChart3
} as const

const STATUS_COLORS = {
  excelente: '[&>div]:bg-green-500',
  alerta: '[&>div]:bg-red-500',
  medio: '[&>div]:bg-yellow-500',
  default: '[&>div]:bg-blue-500'
} as const

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
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

  const getProgressColor = useCallback((status: string) =>
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default,
    []
  )

  const getInitials = useCallback((name: string) =>
    name.substring(0, 2).toUpperCase(),
    []
  )

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
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

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      {/* Header Simplificado */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground/80 font-medium">
          <span>Dashboards</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
          <span className="text-primary font-semibold">Dashboard</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Dashboard Pedagógico
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Acompanhamento completo do desempenho escolar em tempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Banner de Boas-vindas Premium */}
      <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 group">
        <Image
          src={banner}
          alt="Dashboard Banner"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center px-8 border-b border-white/10">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Gestão Inteligente Triunne
          </h2>
          <p className="text-white/80 max-w-lg text-sm font-medium leading-relaxed">
            Seja bem-vindo ao seu centro de controle acadêmico. Monitore o crescimento e tome decisões baseadas em dados reais.
          </p>
        </div>
      </div>

      {/* KPIS com design premium */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => {
          const IconComponent = ICON_MAP[kpi.icon as keyof typeof ICON_MAP] || BarChart3
          // Mapear cores para gradientes
          const gradients: Record<string, string> = {
            'text-blue-600': 'from-blue-500/10 to-blue-500/5',
            'text-green-600': 'from-emerald-500/10 to-emerald-500/5',
            'text-red-500': 'from-rose-500/10 to-rose-500/5',
            'text-purple-600': 'from-purple-500/10 to-purple-500/5'
          }
          const gradientClass = gradients[kpi.color] || 'from-primary/10 to-primary/5'

          return (
            <Card key={index} className={`overflow-hidden border-none shadow-md bg-gradient-to-br ${gradientClass} transition-all hover:scale-[1.02] cursor-default group`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1.5 font-medium flex items-center gap-1">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Desempenho por Matéria */}
        <Card className="col-span-4 border-none shadow-xl bg-card/60 backdrop-blur-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Desempenho por Disciplina
                </CardTitle>
                <CardDescription>
                  Média geral das notas nos principais componentes curriculares
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                Ver Tudo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <div className="space-y-7">
              {performance_per_discipline.length > 0 ? (
                performance_per_discipline.map((materia) => (
                  <div key={materia.nome} className="group">
                    <div className="flex items-center justify-between text-sm mb-2 font-medium">
                      <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                        <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-all group-hover:scale-150" />
                        {materia.nome}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base">{materia.nota}</span>
                        <span className="text-muted-foreground text-xs font-normal">/ 10</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress
                        value={materia.nota * 10}
                        className={`h-2.5 bg-muted rounded-full overflow-hidden ${getProgressColor(materia.status)}`}
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 top-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity bg-white"
                        style={{ width: `${materia.nota * 10}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 opacity-10 mb-2" />
                  <p className="text-sm font-medium">Nenhum dado de desempenho disponível</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ranking de Turmas e Alunos */}
        <div className="col-span-3 space-y-6">
          {/* Melhores Turmas */}
          <Card className="border-none shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-muted/20 bg-muted/10">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Top Turmas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {ranking_turmas.length > 0 ? (
                ranking_turmas.map((turma, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all border border-transparent hover:border-primary/5 cursor-default group">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-background shadow-sm font-bold text-xs text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {i + 1}º
                      </div>
                      <div>
                        <div className="font-bold text-sm tracking-tight">{turma.nome}</div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{turma.alunos} alunos</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-none font-bold text-primary px-2.5">
                      {turma.media}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-center text-muted-foreground py-4 italic">Nenhuma turma ranqueada.</p>
              )}
            </CardContent>
          </Card>

          {/* Alunos Destaque */}
          <Card className="border-none shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden flex-1">
            <CardHeader className="pb-3 border-b border-muted/20 bg-muted/10">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-500" />
                Alunos Destaque
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              {alunos_destaque.length > 0 ? (
                alunos_destaque.map((aluno, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-9 w-9 border-2 border-background shadow-sm hover:scale-105 transition-transform">
                          <AvatarImage src={aluno.avatar} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{getInitials(aluno.nome)}</AvatarFallback>
                        </Avatar>
                        {i === 0 && <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-amber-400 rounded-full border-2 border-background flex items-center justify-center text-[8px] text-white">🏆</div>}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none tracking-tight group-hover:text-primary transition-colors">{aluno.nome}</p>
                        <p className="text-[11px] text-muted-foreground font-medium mt-1 flex items-center gap-1">
                          <School className="h-2.5 w-2.5" />
                          {aluno.turma}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="font-bold text-sm text-emerald-600">
                        {aluno.media}
                      </div>
                      <div className="h-1 w-12 bg-emerald-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(aluno.media / 10) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-center text-muted-foreground py-4 italic">Nenhum aluno em destaque.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
