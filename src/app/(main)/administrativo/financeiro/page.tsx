"use client"

import { useState, useEffect, useMemo } from "react"
import {
    DollarSign,
    FileText,
    Search,
    Upload,
    CheckCircle2,
    Calendar as CalendarIcon,
    ChevronRight,
    ChevronLeft,
    Loader2,
    TrendingUp,
    TrendingDown,
    Clock,
    AlertCircle,
    UserCircle,
    Download
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { financialService, academicService } from "@/services"
import { toast } from "sonner"

// Tipos para melhor organização
type StatusPagamento = 'pago' | 'atrasado' | 'pendente'

interface Mensalidade {
    id: number
    mes: string
    vencimento: string
    valor: number
    status: StatusPagamento
    comprovante?: string | null
    dataPagamento?: string | null
}

interface AlunoFinanceiro {
    id: number
    aluno: string
    matricula: string
    turma: string
    avatar: string
    historico: Mensalidade[]
}

export default function FinanceiroPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("todos")
    const [selectedAluno, setSelectedAluno] = useState<AlunoFinanceiro | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [alunosFinanceiro, setAlunosFinanceiro] = useState<AlunoFinanceiro[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [globalStats, setGlobalStats] = useState({ total: 0, pago: 0, pendente: 0, atrasado: 0 })

    // Fetch data from API
    useEffect(() => {
        fetchFinancialData(currentPage)
    }, [currentPage])

    const fetchFinancialData = async (page: number = 1) => {
        try {
            setIsLoading(true)

            // Parallel fetch for summary stats and paginated students
            const [statsRes, studentsResponse] = await Promise.all([
                financialService.fees.getSummary(),
                academicService.students.getAll(page, 10)
            ])

            setGlobalStats(statsRes)

            const students = studentsResponse.results
            setTotalPages(studentsResponse.total_pages)
            setTotalItems(studentsResponse.count)
            setCurrentPage(studentsResponse.current_page)

            // For the selected students on this page, fetch their fees
            // Optimization: Fetch all fees for these students specifically if backend supports it.
            const feesResponse = await financialService.fees.getAll(1, 1000)
            const fees = feesResponse.results

            // Map students to the AlunoFinanceiro structure
            const studentMap: Record<number, AlunoFinanceiro> = {}

            students.forEach(student => {
                studentMap[student.id] = {
                    id: student.id,
                    aluno: student.name,
                    matricula: student.registration,
                    turma: student.classroom_name || "N/A",
                    avatar: student.avatar || "",
                    historico: []
                }
            })

            // Format date dd/mm/yyyy
            const formatDate = (dateString: string) => {
                if (!dateString) return null
                const parts = dateString.split('-')
                if (parts.length !== 3) return dateString
                const [year, month, day] = parts
                return `${day}/${month}/${year}`
            }

            // Distribute fees to students on this page
            fees.forEach((fee: any) => {
                const studentId = fee.student
                if (studentMap[studentId]) {
                    studentMap[studentId].historico.push({
                        id: fee.id,
                        mes: fee.month,
                        vencimento: formatDate(fee.due_date) || "",
                        valor: parseFloat(fee.value),
                        status: fee.status as StatusPagamento,
                        comprovante: fee.proof_of_payment,
                        dataPagamento: formatDate(fee.payment_date)
                    })
                }
            })

            // Converter object to array
            const dataArray = Object.values(studentMap).map(aluno => {
                aluno.historico.sort((a, b) => b.id - a.id)
                return aluno
            })

            setAlunosFinanceiro(dataArray)
            return dataArray

        } catch (error: any) {
            console.error("Error fetching financial data:", error)
            toast.error("Erro ao carregar dados financeiros")
            return []
        } finally {
            setIsLoading(false)
        }
    }


    // Preparar lista para a tabela
    const alunosListagem = alunosFinanceiro.map(aluno => {
        // Pega a mensalidade mais recente (primeira da lista se ordenada, ou a pendente/atrasada mais antiga?)
        // Vamos mostrar a mais relevante: Atrasada > Pendente > Paga (mais recente)
        // Simplificação: Pega a última adicionada (que veio do banco)
        const ultimaMensalidade = aluno.historico[0] || { mes: "-", vencimento: "-", valor: 0, status: 'pendente' }
        return { ...aluno, ultimaMensalidade }
    }).filter(item => {
        const matchesSearch = item.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.matricula.includes(searchTerm)
        // const matchesStatus = statusFilter === "todos" || item.ultimaMensalidade.status === statusFilter
        // Simplificando filtro por texto apenas por enquanto, status requer mais lógica de "qual mensalidade?"
        return matchesSearch
    })


    // Calcular estatísticas financeiras (usando dados globais do backend)
    const stats = useMemo(() => {
        const formatCurrency = (val: number) =>
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

        return [
            {
                title: "Receita Total",
                value: formatCurrency(globalStats.total),
                description: "Volume total histórico",
                icon: DollarSign,
                color: "text-blue-600",
                bg: "bg-blue-100/50",
                gradient: "from-blue-500/10 to-blue-500/5"
            },
            {
                title: "Recebido",
                value: formatCurrency(globalStats.pago),
                description: "Total pago com sucesso",
                icon: TrendingUp,
                color: "text-emerald-600",
                bg: "bg-emerald-100/50",
                gradient: "from-emerald-500/10 to-emerald-500/5"
            },
            {
                title: "Em Aberto",
                value: formatCurrency(globalStats.pendente),
                description: "Aguardando pagamento",
                icon: Clock,
                color: "text-amber-600",
                bg: "bg-amber-100/50",
                gradient: "from-amber-500/10 to-amber-500/5"
            },
            {
                title: "Inadimplência",
                value: formatCurrency(globalStats.atrasado),
                description: "Mensalidades em atraso",
                icon: AlertCircle,
                color: "text-rose-600",
                bg: "bg-rose-100/50",
                gradient: "from-rose-500/10 to-rose-500/5"
            }
        ]
    }, [globalStats])

    const handleOpenHistorico = (aluno: AlunoFinanceiro) => {
        setSelectedAluno(aluno)
        setIsSheetOpen(true)
    }

    const [isUploading, setIsUploading] = useState<number | null>(null)

    const handleUploadComprovante = async (feeId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !selectedAluno) return

        try {
            setIsUploading(feeId)
            const formData = new FormData()
            formData.append('proof_of_payment', file)

            await financialService.fees.uploadProof(feeId, formData)

            toast.success("Comprovante enviado com sucesso!")

            // Refresh data to reflect changes
            const newData = await fetchFinancialData()

            // Update the selected aluno in the sheet to show paid status
            if (newData) {
                const updated = newData.find(a => a.id === selectedAluno.id)
                if (updated) setSelectedAluno(updated)
            }

        } catch (error: any) {
            console.error("Error uploading proof:", error)
            toast.error("Erro ao enviar comprovante")
        } finally {
            setIsUploading(null)
        }
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            {/* Header com Breadcrumbs */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary/80 mb-2 font-medium">
                        <span className="text-muted-foreground">Administrativo</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-muted-foreground">Financeiro</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Controle Financeiro
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie pagamentos, visualize históricos e controle a inadimplência.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="shadow-sm active:scale-95 transition-all">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar Relatório
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className={`overflow-hidden border-none shadow-md bg-gradient-to-br ${stat.gradient}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`rounded-xl p-2 ${stat.bg} ${stat.color} shadow-sm`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabela Principal */}
            <Card className="border-none shadow-xl bg-card/60 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b bg-muted/30 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                Mensalidades por Aluno
                            </CardTitle>
                            <CardDescription>
                                Clique em um registro para gerenciar o histórico financeiro
                            </CardDescription>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por aluno ou matrícula..."
                                className="pl-9 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex h-64 flex-col items-center justify-center gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
                            <p className="text-muted-foreground animate-pulse font-medium">Carregando dados financeiros...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                                        <TableHead className="py-4 font-bold text-foreground pl-6">Aluno</TableHead>
                                        <TableHead className="py-4 font-bold text-foreground">Último Registro</TableHead>
                                        <TableHead className="py-4 font-bold text-foreground">Valor</TableHead>
                                        <TableHead className="py-4 font-bold text-foreground">Status</TableHead>
                                        <TableHead className="py-4 font-bold text-foreground text-right pr-6">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alunosListagem.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-20">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <DollarSign className="h-12 w-12 opacity-20" />
                                                    <p className="text-lg font-medium">Nenhum registro encontrado</p>
                                                    <p className="text-sm">Tente ajustar seus termos de busca</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        alunosListagem.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="group cursor-pointer hover:bg-muted/40 transition-colors border-b border-muted/20"
                                                onClick={() => handleOpenHistorico(item)}
                                            >
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                                                            <AvatarImage src={item.avatar} />
                                                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                                {item.aluno.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{item.aluno}</span>
                                                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                                <UserCircle className="h-3 w-3" />
                                                                {item.turma}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                                                        <CalendarIcon className="h-3.5 w-3.5 text-primary/40" />
                                                        {item.ultimaMensalidade.mes}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-bold text-foreground">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.ultimaMensalidade.valor)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={item.ultimaMensalidade.status === 'pago' ? 'default' : item.ultimaMensalidade.status === 'atrasado' ? 'destructive' : 'secondary'}
                                                        className={`px-3 py-1 rounded-full font-semibold shadow-sm ${item.ultimaMensalidade.status === 'pago' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                                            item.ultimaMensalidade.status === 'atrasado' ? 'bg-rose-500 hover:bg-rose-600' : ''
                                                            }`}
                                                    >
                                                        {item.ultimaMensalidade.status === 'pago' ? 'Pago' : item.ultimaMensalidade.status === 'atrasado' ? 'Em Atraso' : 'Pendente'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors group/btn font-semibold">
                                                        Ver Detalhes
                                                        <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>

            {totalPages > 1 && (
                <CardFooter className="border-t bg-muted/20 px-6 py-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">
                        Mostrando <span className="text-foreground font-bold">{alunosFinanceiro.length}</span> de <span className="text-foreground font-bold">{totalItems}</span> alunos
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || isLoading}
                            className="rounded-xl transition-all active:scale-95"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                        </Button>
                        <div className="flex items-center gap-1 mx-2">
                            <span className="text-sm font-bold text-primary">{currentPage}</span>
                            <span className="text-sm text-muted-foreground">/</span>
                            <span className="text-sm font-medium text-muted-foreground">{totalPages}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || isLoading}
                            className="rounded-xl transition-all active:scale-95"
                        >
                            Próximo <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>

            {/* Histórico Lateral (Sheet) */ }
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
            {selectedAluno && (
                <>
                    <SheetHeader className="mb-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-primary/10">
                                <AvatarImage src={selectedAluno.avatar} />
                                <AvatarFallback className="text-xl">{selectedAluno.aluno.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <SheetTitle className="text-xl">{selectedAluno.aluno}</SheetTitle>
                                <SheetDescription>
                                    {selectedAluno.turma} • Matrícula: {selectedAluno.matricula}
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="space-y-6">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Histórico de Pagamentos</h3>

                        <div className="space-y-4">
                            {selectedAluno.historico.map((mensalidade, index) => (
                                <Card key={index} className={`border-l-4 ${mensalidade.status === 'pago' ? 'border-l-green-500' :
                                    mensalidade.status === 'atrasado' ? 'border-l-red-500' :
                                        'border-l-yellow-500'
                                    }`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="font-semibold text-lg">{mensalidade.mes}</p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <CalendarIcon className="h-3.5 w-3.5" />
                                                    Vencimento: {mensalidade.vencimento}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mensalidade.valor)}
                                                </p>
                                                <Badge
                                                    variant={mensalidade.status === 'pago' ? 'default' : 'outline'}
                                                    className={
                                                        mensalidade.status === 'pago' ? 'bg-green-600' :
                                                            mensalidade.status === 'atrasado' ? 'text-red-500 border-red-200 bg-red-50' :
                                                                'text-yellow-600 border-yellow-200 bg-yellow-50'
                                                    }
                                                >
                                                    {mensalidade.status === 'pago' ? 'PAGO' : mensalidade.status === 'atrasado' ? 'EM ATRASO' : 'PENDENTE'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t">
                                            {mensalidade.status === 'pago' ? (
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2 text-green-700">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        <span>Pago em {mensalidade.dataPagamento || "Data N/A"}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8"
                                                        onClick={() => {
                                                            if (mensalidade.comprovante) {
                                                                window.open(mensalidade.comprovante, '_blank')
                                                            }
                                                        }}
                                                    >
                                                        <FileText className="mr-2 h-3.5 w-3.5" />
                                                        Ver Comprovante
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground italic">
                                                        Nenhum comprovante
                                                    </span>

                                                    {/* Simulação do Input de Arquivo */}
                                                    <div className="relative">
                                                        <Input
                                                            type="file"
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                                                            onChange={(e) => handleUploadComprovante(mensalidade.id, e)}
                                                            disabled={isUploading === mensalidade.id}
                                                        />
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-dashed border-2 hover:bg-muted/50"
                                                            disabled={isUploading === mensalidade.id}
                                                        >
                                                            {isUploading === mensalidade.id ? (
                                                                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <Upload className="mr-2 h-3.5 w-3.5" />
                                                            )}
                                                            {isUploading === mensalidade.id ? "Enviando..." : "Anexar"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </SheetContent>
    </Sheet>
</div >
    )
}
