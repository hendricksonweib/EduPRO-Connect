"use client"

import { useState, useEffect } from "react"
import { Upload, User, FileText, MapPin, Users, DollarSign, Calendar, Loader2 } from "lucide-react"
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
import { useParams, useRouter } from "next/navigation"
import { academicService } from "@/services"
import { toast } from "sonner"

export default function EditarAlunoPage() {
    const params = useParams()
    const router = useRouter()
    const requestAlunoId = params?.id
    const alunoId = Array.isArray(requestAlunoId) ? requestAlunoId[0] : requestAlunoId

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
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
        registration: ""
    })

    useEffect(() => {
        if (alunoId) {
            fetchAluno(parseInt(alunoId))
        }
    }, [alunoId])

    const fetchAluno = async (id: number) => {
        try {
            setIsLoading(true)
            const student = await academicService.students.getById(id)
            setFormData({
                name: student.name || "",
                birth_date: student.birth_date || "",
                rg: student.rg || "",
                cpf: student.cpf || "",
                cep: student.cep || "",
                address: student.address || "",
                guardian: student.guardian || "",
                phone: student.phone || "",
                responsible1_name: student.responsible1_name || "",
                responsible2_name: student.responsible2_name || "",
                monthly_fee: student.monthly_fee ? student.monthly_fee.toString() : "",
                due_day: student.due_day ? student.due_day.toString() : "",
                registration: student.registration || ""
            })
        } catch (error: any) {
            console.error("Error fetching student:", error)
            toast.error("Erro ao carregar dados do aluno")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async () => {
        if (!alunoId) return

        try {
            setIsSaving(true)

            // Basic validation
            if (!formData.name || !formData.guardian || !formData.phone) {
                toast.error("Por favor, preencha os campos obrigatórios")
                return
            }

            const payload = {
                ...formData,
                monthly_fee: formData.monthly_fee ? parseFloat(formData.monthly_fee) : 0,
                due_day: formData.due_day ? parseInt(formData.due_day) : 5,
            }

            await academicService.students.update(parseInt(alunoId), payload)
            toast.success("Aluno atualizado com sucesso!")
            router.push("/alunos")
        } catch (error: any) {
            console.error("Error updating student:", error)
            const message = academicService.handleError(error) || "Erro ao atualizar aluno"
            toast.error(message)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Editar Aluno</h1>
                    <p className="text-muted-foreground">Matrícula: {formData.registration}</p>
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
                                Dados Financeiros
                            </CardTitle>
                            <CardDescription>
                                Configuração de mensalidade e vencimento.
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
                            <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>Cancelar</Button>
                            <Button onClick={handleSubmit} disabled={isSaving}>
                                {isSaving ? "Salvando..." : "Salvar Alterações"}
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
