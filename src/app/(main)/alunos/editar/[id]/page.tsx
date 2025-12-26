"use client"

import { Upload, User, FileText, MapPin, Users } from "lucide-react"
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

export default function EditarAlunoPage() {
    const params = useParams()
    const alunoId = params.id

    // Aqui você buscaria os dados do aluno pelo ID
    // const aluno = fetchAlunoById(alunoId)

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Editar Aluno</h1>
                    <p className="text-muted-foreground">ID: {alunoId}</p>
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
                                Dados e Documentos do Aluno
                            </CardTitle>
                            <CardDescription>
                                Informações pessoais e documentos de identificação do aluno.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Foto do Aluno - Mobile/Desktop */}
                            <div className="flex flex-col gap-4 md:hidden">
                                <Label>Foto do Aluno</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="/placeholder-user.jpg" />
                                        <AvatarFallback>FT</AvatarFallback>
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
                                    <Input id="nome" placeholder="Nome do aluno" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nascimento">Data de Nascimento</Label>
                                    <Input id="nascimento" type="date" />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="rg">Documento de Identidade (RG)</Label>
                                    <div className="grid gap-2">
                                        <Input id="rg" placeholder="Número do RG" />
                                        <div className="flex items-center gap-2">
                                            <Input id="rg-file" type="file" className="text-sm cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <div className="grid gap-2">
                                        <Input id="cpf" placeholder="000.000.000-00" />
                                        <div className="flex items-center gap-2">
                                            <Input id="cpf-file" type="file" className="text-sm cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Endereço e Comprovante */}
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
                                    <Input id="cep" placeholder="00000-000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endereco">Endereço</Label>
                                    <Input id="endereco" placeholder="Rua, Número" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comprovante">Comprovante de Residência (Upload)</Label>
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Clique para fazer upload ou arraste o arquivo</span>
                                    <Input id="comprovante" type="file" className="hidden" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documentos dos Pais */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Filiação e Responsáveis
                            </CardTitle>
                            <CardDescription>Documentos dos pais ou responsáveis legais.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Responsável 1</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="resp1-nome">Nome</Label>
                                        <Input id="resp1-nome" placeholder="Nome do pai/mãe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="resp1-doc">Documento (Upload)</Label>
                                        <Input id="resp1-doc" type="file" />
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Responsável 2 (Opcional)</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="resp2-nome">Nome</Label>
                                        <Input id="resp2-nome" placeholder="Nome do pai/mãe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="resp2-doc">Documento (Upload)</Label>
                                        <Input id="resp2-doc" type="file" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline">Cancelar</Button>
                            <Button>Salvar Alterações</Button>
                        </CardFooter>
                    </Card>

                </div>

                {/* Coluna Lateral - Foto e Status */}
                <div className="hidden md:flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Foto do Aluno</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Avatar className="h-40 w-40 border-4 border-muted">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback className="text-4xl">FT</AvatarFallback>
                            </Avatar>
                            <Button className="w-full" variant="outline">
                                <Upload className="mr-2 h-4 w-4" />
                                Carregar Foto
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Formatos: JPG, PNG. Máx: 2MB.
                            </p>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
