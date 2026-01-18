"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Upload, User, Briefcase, CreditCard, FileText, MapPin, GraduationCap } from "lucide-react"
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
import { academicService } from "@/services/academic.service"
import { Discipline, Teacher } from "@/services/types"
import { toast } from "sonner"

export default function EditarProfessorPage() {
    const params = useParams() as { id: string }
    const router = useRouter()
    const professorId = Number(params?.id)

    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [disciplines, setDisciplines] = useState<Discipline[]>([])

    const [formData, setFormData] = useState({
        name: "",
        birth_date: "",
        cpf: "",
        rg: "",
        email: "",
        phone: "",
        education: "",
        admission_date: "",
        registration: "",
        bank: "",
        agency: "",
        account: "",
        pix: "",
        discipline_ids: [] as number[]
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teacherData, disciplinesData] = await Promise.all([
                    academicService.teachers.getById(professorId),
                    academicService.subjects.getAll()
                ])

                setDisciplines(Array.isArray(disciplinesData) ? disciplinesData : disciplinesData.results)

                // Map backend data to form state
                setFormData({
                    name: teacherData.name || "",
                    birth_date: teacherData.birth_date || "",
                    cpf: teacherData.cpf || "",
                    rg: teacherData.rg || "",
                    email: teacherData.email || "",
                    phone: teacherData.phone || "",
                    education: teacherData.education || "",
                    admission_date: teacherData.admission_date || "",
                    registration: teacherData.registration || "",
                    bank: teacherData.bank || "",
                    agency: teacherData.agency || "",
                    account: teacherData.account || "",
                    pix: teacherData.pix || "",
                    discipline_ids: teacherData.disciplines?.map(d => d.id) || []
                })
            } catch (error) {
                console.error("Error fetching data:", error)
                toast.error("Erro ao carregar dados do professor")
                router.push("/professores")
            } finally {
                setIsLoading(false)
            }
        }

        if (professorId) fetchData()
    }, [professorId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleDisciplineChange = (id: number, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            discipline_ids: checked
                ? [...prev.discipline_ids, id]
                : prev.discipline_ids.filter(dId => dId !== id)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Sanitize data: convert empty strings to null for date fields
        const sanitizedData = {
            ...formData,
            birth_date: formData.birth_date || null,
            admission_date: formData.admission_date || null,
        }

        try {
            await academicService.teachers.update(professorId, sanitizedData)
            toast.success("Professor atualizado com sucesso!")
            router.push("/professores")
        } catch (error: any) {
            console.error("Error updating teacher:", error)
            const message = academicService.handleError(error) || "Erro ao atualizar professor"
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center">Carregando dados...</div>
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Editar Professor</h1>
                    <p className="text-muted-foreground">ID: {professorId} - {formData.registration}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                {/* Coluna Principal - Formulário */}
                <div className="space-y-6">

                    {/* Dados Pessoais */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Dados Pessoais
                            </CardTitle>
                            <CardDescription>
                                Informações básicas e de identificação do professor.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Foto Mobile */}
                            <div className="flex flex-col gap-4 md:hidden">
                                <Label>Foto de Perfil</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="/placeholder-user.jpg" />
                                        <AvatarFallback>PF</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline" size="sm" type="button">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Alterar Foto
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input
                                        id="name"
                                        placeholder="Nome do professor"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                                    <Input
                                        id="birth_date"
                                        type="date"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input
                                        id="cpf"
                                        placeholder="000.000.000-00"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rg">RG</Label>
                                    <Input
                                        id="rg"
                                        placeholder="Número do RG"
                                        value={formData.rg}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Institucional</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="professor@escola.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone / Celular</Label>
                                    <Input
                                        id="phone"
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dados Profissionais e Matérias */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Dados Profissionais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Matérias que Leciona</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                    {disciplines.length === 0 ? (
                                        <p className="text-sm text-muted-foreground col-span-full">Nenhuma disciplina cadastrada.</p>
                                    ) : (
                                        disciplines.map(discipline => (
                                            <div key={discipline.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`discipline-${discipline.id}`}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                    checked={formData.discipline_ids.includes(discipline.id)}
                                                    onChange={(e) => handleDisciplineChange(discipline.id, e.target.checked)}
                                                />
                                                <Label htmlFor={`discipline-${discipline.id}`}>{discipline.name}</Label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="education">Formação Acadêmica</Label>
                                    <div className="relative">
                                        <select
                                            id="education"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.education}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Selecione...</option>
                                            <option value="Graduação">Graduação</option>
                                            <option value="Pós-Graduação">Pós-Graduação</option>
                                            <option value="Mestrado">Mestrado</option>
                                            <option value="Doutorado">Doutorado</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admission_date">Data de Admissão</Label>
                                    <Input
                                        id="admission_date"
                                        type="date"
                                        value={formData.admission_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="diploma">Diploma / Certificados (Upload)</Label>
                                <Input id="diploma" type="file" multiple disabled />
                                <p className="text-[0.8rem] text-muted-foreground">Funcionalidade de upload em breve.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dados Bancários */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Dados Bancários
                            </CardTitle>
                            <CardDescription>Para processamento da folha de pagamento.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="bank">Banco</Label>
                                    <Input
                                        id="bank"
                                        placeholder="Ex: Banco do Brasil"
                                        value={formData.bank}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="agency">Agência</Label>
                                    <Input
                                        id="agency"
                                        placeholder="0000"
                                        value={formData.agency}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account">Conta Corrente</Label>
                                    <Input
                                        id="account"
                                        placeholder="00000-0"
                                        value={formData.account}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pix">Chave PIX</Label>
                                <Input
                                    id="pix"
                                    placeholder="CPF, Email ou Aleatória"
                                    value={formData.pix}
                                    onChange={handleChange}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => router.push("/professores")}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </CardFooter>
                    </Card>

                </div>

                {/* Coluna Lateral */}
                <div className="hidden md:flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Foto de Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Avatar className="h-40 w-40 border-4 border-muted">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback className="text-4xl">PF</AvatarFallback>
                            </Avatar>
                            <Button className="w-full" variant="outline" type="button">
                                <Upload className="mr-2 h-4 w-4" />
                                Carregar Foto
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Use uma foto profissional e de boa qualidade. (EM BREVE)
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Documentos Pendentes</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                <span>Comprovante de Residência</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                <span>Carteira de Trabalho</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </form>
    )
}
