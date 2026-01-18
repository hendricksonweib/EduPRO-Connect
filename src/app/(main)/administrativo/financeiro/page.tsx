"use client"

import { useState, useEffect } from "react"
import {
    DollarSign,
    FileText,
    Search,
    Upload,
    CheckCircle2,
    Calendar as CalendarIcon,
    ChevronRight,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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
import { financialService } from "@/services"
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

    // Fetch data from API
    useEffect(() => {
        fetchFinancialData()
    }, [])

    const fetchFinancialData = async () => {
        try {
            setIsLoading(true)
            const response = await financialService.fees.getAll()

            // Group fees by student
            const groupedData: Record<number, AlunoFinanceiro> = {}

            response.results.forEach((fee: any) => {
                const studentId = fee.student

                if (!groupedData[studentId]) {
                    groupedData[studentId] = {
                        id: studentId,
                        aluno: fee.student_name,
                        matricula: fee.student_registration || "N/A",
                        turma: fee.student_class || "N/A",
                        avatar: "", // API doesn't send avatar yet in serializer, assume empty
                        historico: []
                    }
                }

                // Format date dd/mm/yyyy
                const formatDate = (dateString: string) => {
                    if (!dateString) return null
                    const [year, month, day] = dateString.split('-')
                    return `${day}/${month}/${year}`
                }

                groupedData[studentId].historico.push({
                    id: fee.id,
                    mes: fee.month,
                    vencimento: formatDate(fee.due_date) || "",
                    valor: parseFloat(fee.value),
                    status: fee.status as StatusPagamento,
                    comprovante: fee.proof_of_payment,
                    dataPagamento: formatDate(fee.payment_date)
                })
            })

            // Converter object to array and sort history
            const dataArray = Object.values(groupedData).map(aluno => {
                // Sort history by due date descending (assuming simple string comparison works for YYYY-MM-DD but here we formatted it. 
                // Better to sort by ID or keep raw date. For now, rely on insertion order or backend order).
                return aluno
            })

            setAlunosFinanceiro(dataArray)

        } catch (error: any) {
            console.error("Error fetching financial data:", error)
            toast.error("Erro ao carregar dados financeiros")
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


    const handleOpenHistorico = (aluno: AlunoFinanceiro) => {
        setSelectedAluno(aluno)
        setIsSheetOpen(true)
    }

    const handleUploadComprovante = (feeId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !selectedAluno) return

        toast.info("Upload de comprovante em desenvolvimento (Frontend only for now)")

        // Em um cenário real:
        // const formData = new FormData()
        // formData.append('proof_of_payment', file)
        // await financialService.fees.uploadProof(feeId, formData)
        // fetchFinancialData()
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <DollarSign className="h-6 w-6" />
                        Controle Financeiro
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie pagamentos e visualize históricos por aluno
                    </p>
                </div>
            </div>

            {/* Tabela Principal */}
            <Card>
                <CardHeader>
                    <CardTitle>Alunos e Mensalidades</CardTitle>
                    <CardDescription>
                        Clique em um aluno para ver o histórico completo e anexar comprovantes
                    </CardDescription>

                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar aluno..."
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
                                    <TableHead>Último Registro</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {alunosListagem.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            Nenhum registro encontrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    alunosListagem.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleOpenHistorico(item)}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={item.avatar} />
                                                        <AvatarFallback>{item.aluno.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{item.aluno}</span>
                                                        <span className="text-xs text-muted-foreground">{item.turma}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{item.ultimaMensalidade.mes}</TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.ultimaMensalidade.valor)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={item.ultimaMensalidade.status === 'pago' ? 'default' : item.ultimaMensalidade.status === 'atrasado' ? 'destructive' : 'secondary'}
                                                    className={item.ultimaMensalidade.status === 'pago' ? 'bg-green-600 hover:bg-green-600' : ''}
                                                >
                                                    {item.ultimaMensalidade.status === 'pago' ? 'Pago' : item.ultimaMensalidade.status === 'atrasado' ? 'Em Atraso' : 'Pendente'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    Histórico <ChevronRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Histórico Lateral (Sheet) */}
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
                                                            <Button variant="ghost" size="sm" className="h-8">
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
                                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                                    onChange={(e) => handleUploadComprovante(mensalidade.id, e)}
                                                                />
                                                                <Button size="sm" variant="outline" className="border-dashed border-2 hover:bg-muted/50">
                                                                    <Upload className="mr-2 h-3.5 w-3.5" />
                                                                    Anexar
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
        </div>
    )
}
