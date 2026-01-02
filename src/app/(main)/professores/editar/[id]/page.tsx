"use client"

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
import { useParams } from "next/navigation"

export default function EditarProfessorPage() {
    const params = useParams()
    const professorId = params.id

    // Aqui você buscaria os dados do professor pelo ID
    // const professor = fetchProfessorById(professorId)

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Editar Professor</h1>
                    <p className="text-muted-foreground">ID: {professorId}</p>
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
                                    <Button variant="outline" size="sm">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Alterar Foto
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome Completo</Label>
                                    <Input id="nome" placeholder="Nome do professor" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nascimento">Data de Nascimento</Label>
                                    <Input id="nascimento" type="date" />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input id="cpf" placeholder="000.000.000-00" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rg">RG</Label>
                                    <Input id="rg" placeholder="Número do RG" />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Institucional</Label>
                                    <Input id="email" type="email" placeholder="professor@escola.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefone">Telefone / Celular</Label>
                                    <Input id="telefone" placeholder="(00) 00000-0000" />
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
                                    {/* Substituindo Checkbox por input type="checkbox" */}
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="matemática" className="h-4 w-4 rounded border-gray-300" />
                                        <Label htmlFor="matemática">Matemática</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="portugues" className="h-4 w-4 rounded border-gray-300" />
                                        <Label htmlFor="portugues">Português</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="historia" className="h-4 w-4 rounded border-gray-300" />
                                        <Label htmlFor="historia">História</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="geografia" className="h-4 w-4 rounded border-gray-300" />
                                        <Label htmlFor="geografia">Geografia</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="ciencias" className="h-4 w-4 rounded border-gray-300" />
                                        <Label htmlFor="ciencias">Ciências</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="ingles" className="h-4 w-4 rounded border-gray-300" />
                                        <Label htmlFor="ingles">Inglês</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="educacao-fisica" className="h-4 w-4 rounded border-gray-300" />
                                        <Label htmlFor="educacao-fisica">Ed. Física</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox" id="artes" className="h-4 w-4 rounded border-gray-300" />
                                        <Label htmlFor="artes">Artes</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="formacao">Formação Acadêmica</Label>
                                    <div className="relative">
                                        <select
                                            id="formacao"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="" disabled selected>Selecione...</option>
                                            <option value="graduacao">Graduação</option>
                                            <option value="pos">Pós-Graduação</option>
                                            <option value="mestrado">Mestrado</option>
                                            <option value="doutorado">Doutorado</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="admissao">Data de Admissão</Label>
                                    <Input id="admissao" type="date" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="diploma">Diploma / Certificados (Upload)</Label>
                                <Input id="diploma" type="file" multiple />
                                <p className="text-[0.8rem] text-muted-foreground">Pode selecionar múltiplos arquivos.</p>
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
                                    <Label htmlFor="banco">Banco</Label>
                                    <Input id="banco" placeholder="Ex: Banco do Brasil" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="agencia">Agência</Label>
                                    <Input id="agencia" placeholder="0000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="conta">Conta Corrente</Label>
                                    <Input id="conta" placeholder="00000-0" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pix">Chave PIX</Label>
                                <Input id="pix" placeholder="CPF, Email ou Aleatória" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline">Cancelar</Button>
                            <Button>Salvar Alterações</Button>
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
                            <Button className="w-full" variant="outline">
                                <Upload className="mr-2 h-4 w-4" />
                                Carregar Foto
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Use uma foto profissional e de boa qualidade.
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
        </div>
    )
}
