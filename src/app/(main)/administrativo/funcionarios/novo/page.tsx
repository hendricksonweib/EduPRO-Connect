"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Users, ArrowLeft, Save, Loader2, Upload, User as UserIcon, Shield, Mail, UserPlus, Key, ChevronRight } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { userService, apiClient, type User } from "@/services"
import { toast } from "sonner"

export default function NovoFuncionarioPage() {
    const router = useRouter()
    const params = useParams()
    const isEditing = !!params?.id
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(isEditing)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        role: "OPERACIONAL" as User['role'],
    })

    useEffect(() => {
        if (isEditing) {
            fetchEmployee()
        }
    }, [isEditing])

    const fetchEmployee = async () => {
        try {
            const user = await userService.getById(Number(params?.id))
            setFormData({
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                password: "",
                role: user.role,
            })
            if (user.avatar) {
                setAvatarPreview(user.avatar)
            }
        } catch (error) {
            console.error("Failed to fetch employee:", error)
            toast.error("Erro ao carregar dados do funcionário")
            router.push("/administrativo/funcionarios")
        } finally {
            setIsFetching(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, role: value as User['role'] }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const data = new FormData()
            data.append("username", formData.username)
            data.append("email", formData.email)
            data.append("first_name", formData.first_name)
            data.append("last_name", formData.last_name)
            data.append("role", formData.role)

            if (formData.password) {
                data.append("password", formData.password)
            }

            if (avatarFile) {
                data.append("avatar", avatarFile)
            }

            if (isEditing) {
                await userService.update(Number(params?.id), data)
                toast.success("Funcionário atualizado com sucesso")
            } else {
                if (!formData.password) {
                    toast.error("Senha é obrigatória para novos usuários")
                    setIsLoading(false)
                    return
                }
                await userService.create(data)
                toast.success("Funcionário criado com sucesso")
            }
            router.push("/administrativo/funcionarios")
        } catch (error) {
            console.error("Failed to save employee:", error)
            const errorMessage = apiClient.handleError(error)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center gap-4">
                <Link href="/administrativo/funcionarios">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary/80 mb-2 font-medium">
                        <span className="text-muted-foreground">Administrativo</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <Link href="/administrativo/funcionarios" className="hover:text-primary transition-colors">
                            Funcionários
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-muted-foreground">{isEditing ? "Editar" : "Novo"}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditing ? "Editar Funcionário" : "Novo Funcionário"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Altere as informações do funcionário" : "Cadastre um novo usuário para acesso ao sistema"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-[1fr_300px]">
                {/* Coluna Principal */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                Informações Pessoais
                            </CardTitle>
                            <CardDescription>
                                Dados básicos do funcionário
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Avatar Mobile */}
                            <div className="flex flex-col gap-4 md:hidden mb-6">
                                <Label>Foto do Funcionário</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={avatarPreview || ""} />
                                        <AvatarFallback>{formData.first_name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                    <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Alterar Foto
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">Nome</Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        placeholder="Ex: João"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Sobrenome</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        placeholder="Ex: Silva"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="joao@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Acesso e Permissões
                            </CardTitle>
                            <CardDescription>
                                Credenciais e nível de autorização no sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="flex items-center gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        Usuário (Login)
                                    </Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="joaosilva"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Nível de Acesso</Label>
                                    <Select onValueChange={handleSelectChange} value={formData.role}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o nível" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                                            <SelectItem value="OPERACIONAL">Operacional</SelectItem>
                                            <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    {isEditing ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!isEditing}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
                            <Link href="/administrativo/funcionarios">
                                <Button variant="outline" type="button">Cancelar</Button>
                            </Link>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {isEditing ? "Salvar Alterações" : "Criar Funcionário"}
                                    </>
                                )}
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
                                <AvatarImage src={avatarPreview || ""} />
                                <AvatarFallback className="text-4xl">
                                    {formData.first_name?.[0] || formData.username?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Button type="button" className="w-full" variant="outline" onClick={triggerFileInput}>
                                <Upload className="mr-2 h-4 w-4" />
                                {avatarFile ? "Trocar Imagem" : "Carregar Foto"}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Formatos: JPG, PNG. Máx: 2MB.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}
