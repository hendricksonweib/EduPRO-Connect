"use client"

import { useState } from "react"
import { Upload, User, FileText, MapPin, Users, DollarSign, Calendar, ChevronRight } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { academicService } from "@/services"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CadastroAlunosPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        birth_date: "",
        rg: "",
        cpf: "",
        cep: "",
        address: "",
        guardian: "",
        phone: "",
        responsible1_name: "",
        responsible2_name: "",
        monthly_fee: "",
        due_day: "",
        registration: `2026${Math.floor(Math.random() * 1000)}` // Auto-generate simple ID for now
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true)

            // Basic validation
            if (!formData.name || !formData.guardian || !formData.phone) {
                toast.error("Por favor, preencha os campos obrigatórios (Nome, Responsável, Telefone)")
                return
            }

            const payload = {
                ...formData,
                monthly_fee: formData.monthly_fee ? parseFloat(formData.monthly_fee) : 0,
                due_day: formData.due_day ? parseInt(formData.due_day) : 5,
                // Status defaults to 'ativo' in backend
            }

            await academicService.students.create(payload)
            toast.success("Aluno cadastrado com sucesso!")
            router.push("/alunos")
        } catch (error: any) {
            console.error("Error creating student:", error)
            const message = academicService.handleError(error) || "Erro ao cadastrar aluno"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary/80 mb-2 font-medium">
                        <Link href="/alunos" className="hover:text-primary transition-colors">
                            Alunos
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-muted-foreground">Novo Aluno</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Cadastro de Aluno</h1>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                {/* Coluna Principal - Formulário */}
                <div className="space-y-6">

                    {/* Dados e Documentos do Aluno */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Dados Pessoais
                            </CardTitle>
                            <CardDescription>
                                Informações pessoais e documentos de identificação.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo *</Label>
                                    <Input id="name" placeholder="Nome do aluno" value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                                    <Input id="birth_date" type="date" value={formData.birth_date} onChange={handleInputChange} />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="rg">RG</Label>
                                    <Input id="rg" placeholder="Número do RG" value={formData.rg} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input id="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleInputChange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financeiro */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Financeiro Inicial
                            </CardTitle>
                            <CardDescription>
                                Defina o valor da mensalidade e dia de vencimento.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="monthly_fee">Valor da Mensalidade (R$)</Label>
                                    <Input
                                        id="monthly_fee"
                                        type="number"
                                        placeholder="0.00"
                                        step="0.01"
                                        value={formData.monthly_fee}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="due_day">Dia de Vencimento</Label>
                                    <Input
                                        id="due_day"
                                        type="number"
                                        placeholder="Dia (1-31)"
                                        min="1"
                                        max="31"
                                        value={formData.due_day}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Endereço */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Endereço
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cep">CEP</Label>
                                    <Input id="cep" placeholder="00000-000" value={formData.cep} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Endereço</Label>
                                    <Input id="address" placeholder="Rua, Número" value={formData.address} onChange={handleInputChange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Filiação */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Responsáveis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="guardian">Responsável Financeiro/Legal *</Label>
                                        <Input id="guardian" placeholder="Nome do principal responsável" value={formData.guardian} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                                        <Input id="phone" placeholder="(00) 00000-0000" value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="responsible1_name">Pai / Mãe 1</Label>
                                    <Input id="responsible1_name" placeholder="Nome" value={formData.responsible1_name} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="responsible2_name">Pai / Mãe 2</Label>
                                    <Input id="responsible2_name" placeholder="Nome" value={formData.responsible2_name} onChange={handleInputChange} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>Cancelar</Button>
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar Cadastro"}
                            </Button>
                        </CardFooter>
                    </Card>

                </div>

                {/* Coluna Lateral - Foto */}
                <div className="hidden md:flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Foto</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Avatar className="h-40 w-40 border-4 border-muted">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback className="text-4xl">FT</AvatarFallback>
                            </Avatar>
                            <Button className="w-full" variant="outline" disabled>
                                <Upload className="mr-2 h-4 w-4" />
                                Carregar Foto (Em breve)
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
