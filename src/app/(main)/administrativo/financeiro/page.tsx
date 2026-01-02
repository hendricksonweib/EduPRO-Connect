"use client"

import { useState } from "react"
import {
    DollarSign,
    Download,
    FileText,
    Filter,
    MoreHorizontal,
    Search,
    Upload,
    AlertCircle,
    CheckCircle2,
    Clock,
    Calendar as CalendarIcon,
    History,
    ChevronRight,
    X
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
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Tipos para melhor organização
type StatusPagamento = 'pago' | 'atrasado'

interface Mensalidade {
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

// Mock de dados mais complexo para suportar histórico
const mockAlunosFinanceiro: AlunoFinanceiro[] = [
    {
        id: 1,
        aluno: "João Silva Santos",
        matricula: "2024001",
        turma: "3º Ano A",
        avatar: "",
        historico: [
            { mes: "Dezembro/2025", vencimento: "10/12/2025", valor: 1200.00, status: "pago", comprovante: "comp_dez.pdf", dataPagamento: "08/12/2025" },
            { mes: "Novembro/2025", vencimento: "10/11/2025", valor: 1200.00, status: "pago", comprovante: "comp_nov.pdf", dataPagamento: "09/11/2025" },
            { mes: "Outubro/2025", vencimento: "10/10/2025", valor: 1200.00, status: "pago", comprovante: "comp_out.pdf", dataPagamento: "10/10/2025" },
        ]
    },
    {
        id: 2,
        aluno: "Ana Paula Costa",
        matricula: "2024002",
        turma: "2º Ano B",
        avatar: "",
        historico: [
            { mes: "Dezembro/2025", vencimento: "10/12/2025", valor: 1150.00, status: "atrasado", comprovante: null },
            { mes: "Novembro/2025", vencimento: "10/11/2025", valor: 1150.00, status: "pago", comprovante: "comp_nov_ana.pdf", dataPagamento: "11/11/2025" },
        ]
    },
    {
        id: 3,
        aluno: "Pedro Henrique Oliveira",
        matricula: "2024003",
        turma: "1º Ano A",
        avatar: "",
        historico: [
            { mes: "Dezembro/2025", vencimento: "10/12/2025", valor: 1100.00, status: "atrasado", comprovante: null },
            { mes: "Novembro/2025", vencimento: "10/11/2025", valor: 1100.00, status: "atrasado", comprovante: null },
        ]
    },
    {
        id: 4,
        aluno: "Beatriz Santos Lima",
        matricula: "2024004",
        turma: "3º Ano B",
        avatar: "",
        historico: [
            { mes: "Dezembro/2025", vencimento: "10/12/2025", valor: 1200.00, status: "pago", comprovante: "comp_dez_bia.jpg", dataPagamento: "10/12/2025" },
        ]
    },
    {
        id: 5,
        aluno: "Carlos Eduardo Ferreira",
        matricula: "2024005",
        turma: "3º Ano A",
        avatar: "",
        historico: [
            { mes: "Dezembro/2025", vencimento: "10/12/2025", valor: 1200.00, status: "atrasado", comprovante: null },
        ]
    },
]

export default function FinanceiroPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("todos")
    const [selectedAluno, setSelectedAluno] = useState<AlunoFinanceiro | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    // Simulação de "última mensalidade" para a tabela principal
    const alunosListagem = mockAlunosFinanceiro.map(aluno => {
        const ultimaMensalidade = aluno.historico[0] // Assumindo ordenação decrescente
        return {
            ...aluno,
            ultimaMensalidade
        }
    }).filter(item => {
        const matchesSearch = item.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.matricula.includes(searchTerm)
        const matchesStatus = statusFilter === "todos" || item.ultimaMensalidade.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Totais (Baseados apenas na mensalidade atual para o dashboard simplificado)
    const totalRecebido = alunosListagem
        .filter(a => a.ultimaMensalidade.status === 'pago')
        .reduce((acc, curr) => acc + curr.ultimaMensalidade.valor, 0)

    const totalAtrasado = alunosListagem
        .filter(a => a.ultimaMensalidade.status === 'atrasado')
        .reduce((acc, curr) => acc + curr.ultimaMensalidade.valor, 0)

    const handleOpenHistorico = (aluno: AlunoFinanceiro) => {
        setSelectedAluno(aluno)
        setIsSheetOpen(true)
    }

    const handleUploadComprovante = (mesIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !selectedAluno) return

        // Simulação de upload e atualização de estado
        const novoHistorico = [...selectedAluno.historico]
        novoHistorico[mesIndex] = {
            ...novoHistorico[mesIndex],
            status: 'pago',
            comprovante: file.name,
            dataPagamento: new Date().toLocaleDateString('pt-BR')
        }

        setSelectedAluno({
            ...selectedAluno,
            historico: novoHistorico
        })

        // Atualiza também a lista principal (opcional, para refletir se fechar o sheet)
        // Em uma app real, isso seria um refetch ou atualização do contexto/store
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
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status (Mês Atual)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="pago">Pago</SelectItem>
                                <SelectItem value="atrasado">Em Atraso</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Aluno</TableHead>
                                <TableHead>Mês Atual</TableHead>
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
                                                variant={item.ultimaMensalidade.status === 'pago' ? 'default' : 'destructive'}
                                                className={item.ultimaMensalidade.status === 'pago' ? 'bg-green-600 hover:bg-green-600' : ''}
                                            >
                                                {item.ultimaMensalidade.status === 'pago' ? 'Pago' : 'Em Atraso'}
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
                                        <Card key={index} className={`border-l-4 ${mensalidade.status === 'pago' ? 'border-l-green-500' : 'border-l-red-500'}`}>
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
                                                            className={mensalidade.status === 'pago' ? 'bg-green-600' : 'text-red-500 border-red-200 bg-red-50'}
                                                        >
                                                            {mensalidade.status === 'pago' ? 'PAGO' : 'EM ATRASO'}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="pt-2 border-t">
                                                    {mensalidade.status === 'pago' ? (
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-2 text-green-700">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                <span>Pago em {mensalidade.dataPagamento}</span>
                                                            </div>
                                                            <Button variant="ghost" size="sm" className="h-8">
                                                                <FileText className="mr-2 h-3.5 w-3.5" />
                                                                Ver Comprovante
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-muted-foreground italic">
                                                                Nenhum comprovante anexado
                                                            </span>

                                                            {/* Simulação do Input de Arquivo */}
                                                            <div className="relative">
                                                                <Input
                                                                    type="file"
                                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                                    onChange={(e) => handleUploadComprovante(index, e)}
                                                                />
                                                                <Button size="sm" variant="outline" className="border-dashed border-2 hover:bg-muted/50">
                                                                    <Upload className="mr-2 h-3.5 w-3.5" />
                                                                    Anexar Comprovante
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
