"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, User, Shield, Lock, Briefcase, Mail } from "lucide-react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function NovoFuncionarioPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Link href="/administrativo/funcionarios">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Novo Funcionário</h1>
                    <p className="text-muted-foreground">
                        Cadastre um novo colaborador e defina suas permissões de sistema
                    </p>
                </div>
            </div>

            <div className="grid gap-6">

                {/* Dados Pessoais e Profissionais */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Dados Pessoais e Profissionais
                        </CardTitle>
                        <CardDescription>
                            Informações básicas de identificação e cargo
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed relative overflow-hidden group cursor-pointer hover:bg-muted/80 transition-colors">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                                <span className="text-xs text-muted-foreground">Foto de Perfil</span>
                            </div>

                            <div className="grid gap-4 flex-1 md:grid-cols-2">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="nome">Nome Completo</Label>
                                    <Input id="nome" placeholder="Ex: Ana Maria Silva" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input id="cpf" placeholder="000.000.000-00" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nascimento">Data de Nascimento</Label>
                                    <Input id="nascimento" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Corporativo</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" className="pl-8" placeholder="nome@edupro.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                                    <Input id="telefone" placeholder="(00) 00000-0000" />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
                            <div className="space-y-2">
                                <Label htmlFor="cargo">Cargo</Label>
                                <Input id="cargo" placeholder="Ex: Secretária" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="departamento">Departamento</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="diretoria">Diretoria</SelectItem>
                                        <SelectItem value="secretaria">Secretaria</SelectItem>
                                        <SelectItem value="financeiro">Financeiro</SelectItem>
                                        <SelectItem value="pedagogico">Pedagógico</SelectItem>
                                        <SelectItem value="ti">T.I.</SelectItem>
                                        <SelectItem value="servicos">Serviços Gerais</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admissao">Data de Admissão</Label>
                                <Input id="admissao" type="date" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Configurações de Acesso */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Configurações de Acesso
                        </CardTitle>
                        <CardDescription>
                            Defina o nível de permissão deste usuário no sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nivel">Nível de Acesso</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o perfil" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            <span className="font-bold text-red-600">Administrador</span> - Acesso total
                                        </SelectItem>
                                        <SelectItem value="gestor">
                                            <span className="font-bold text-blue-600">Gestor</span> - Gerencia módulos específicos
                                        </SelectItem>
                                        <SelectItem value="operacional">
                                            <span className="font-bold text-green-600">Operacional</span> - Tarefas básicas
                                        </SelectItem>
                                        <SelectItem value="visualizador">
                                            <span className="font-bold text-slate-600">Leitura</span> - Apenas visualização
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Determina quais módulos e ações o usuário poderá acessar.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="senha">Senha Inicial</Label>
                                <div className="relative">
                                    <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="senha" type="password" className="pl-8" defaultValue="Mudar@123" />
                                </div>
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Senha padrão sugerida. O usuário deverá alterar no primeiro acesso.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label>Permissões Específicas (Opcional)</Label>
                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <Checkbox id="perm_fin" />
                                    <label htmlFor="perm_fin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Acesso ao Módulo Financeiro
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <Checkbox id="perm_rh" />
                                    <label htmlFor="perm_rh" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Pode Cadastrar Novos Funcionários
                                    </label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 flex justify-end gap-2 border-t py-4">
                        <Link href="/administrativo/funcionarios">
                            <Button variant="ghost">Cancelar</Button>
                        </Link>
                        <Button className="bg-blue-600 hover:bg-blue-700">Salvar Cadastro</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
