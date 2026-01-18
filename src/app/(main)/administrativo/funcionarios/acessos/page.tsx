"use client"

import { Shield, Check, X, Info } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

const niveisAcesso = [
    {
        nivel: "Administrador",
        descricao: "Acesso irrestrito a todas as funcionalidades do sistema.",
        usuarios: 2,
        cor: "red",
        permissoes: {
            financeiro: true,
            academico: true,
            pedagogico: true,
            configuracoes: true
        }
    },
    {
        nivel: "Gestor",
        descricao: "Gerencia setores específicos (Coordenação, Financeiro).",
        usuarios: 5,
        cor: "blue",
        permissoes: {
            financeiro: true,
            academico: true,
            pedagogico: true,
            configuracoes: false
        }
    },
    {
        nivel: "Operacional",
        descricao: "Realiza tarefas do dia a dia (Secretaria, Atendimento).",
        usuarios: 12,
        cor: "green",
        permissoes: {
            financeiro: false,
            academico: true,
            pedagogico: false,
            configuracoes: false
        }
    },
    {
        nivel: "Leitura",
        descricao: "Apenas visualização de relatórios e dados básicos.",
        usuarios: 3,
        cor: "slate",
        permissoes: {
            financeiro: false,
            academico: false,
            pedagogico: false,
            configuracoes: false
        }
    }
]

export default function TiposAcessoPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        Níveis de Acesso
                    </h1>
                    <p className="text-muted-foreground">
                        Matriz de permissões e definição de perfis de usuário
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {niveisAcesso.map((nivel) => (
                    <Card key={nivel.nivel} className={`border-t-4 border-t-${nivel.cor}-500`}>
                        <CardHeader>
                            <CardTitle className={`text-${nivel.cor}-600`}>{nivel.nivel}</CardTitle>
                            <CardDescription>{nivel.descricao}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{nivel.usuarios}</div>
                            <p className="text-xs text-muted-foreground">Usuários ativos</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Matriz de Permissões</CardTitle>
                    <CardDescription>
                        Visualize o que cada perfil pode acessar no sistema por padrão
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Nível de Acesso</TableHead>
                                <TableHead className="text-center">Financeiro</TableHead>
                                <TableHead className="text-center">Acadêmico</TableHead>
                                <TableHead className="text-center">Pedagógico</TableHead>
                                <TableHead className="text-center">Configurações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {niveisAcesso.map((nivel) => (
                                <TableRow key={nivel.nivel}>
                                    <TableCell className="font-medium">
                                        <Badge variant="outline" className={`text-${nivel.cor}-600 bg-${nivel.cor}-50 border-${nivel.cor}-200`}>
                                            {nivel.nivel}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {nivel.permissoes.financeiro ? (
                                            <Check className="mx-auto h-5 w-5 text-green-500" />
                                        ) : (
                                            <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {nivel.permissoes.academico ? (
                                            <Check className="mx-auto h-5 w-5 text-green-500" />
                                        ) : (
                                            <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {nivel.permissoes.pedagogico ? (
                                            <Check className="mx-auto h-5 w-5 text-green-500" />
                                        ) : (
                                            <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {nivel.permissoes.configuracoes ? (
                                            <Check className="mx-auto h-5 w-5 text-green-500" />
                                        ) : (
                                            <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
