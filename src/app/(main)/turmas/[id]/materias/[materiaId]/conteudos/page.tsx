"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2, Plus, Search, FileText, Video, Link as LinkIcon, File, Download, Eye, Upload } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo
const mockConteudos = [
    {
        id: 1,
        titulo: "Introdução às Equações do 2º Grau",
        tipo: "pdf",
        url: "#",
        tamanho: "2.5 MB",
        dataUpload: "2024-12-20",
        visualizacoes: 45,
    },
    {
        id: 2,
        titulo: "Vídeo Aula - Resolução de Equações",
        tipo: "video",
        url: "https://youtube.com/watch?v=example",
        tamanho: "-",
        dataUpload: "2024-12-21",
        visualizacoes: 38,
    },
    {
        id: 3,
        titulo: "Exercícios Práticos - Lista 01",
        tipo: "pdf",
        url: "#",
        tamanho: "1.8 MB",
        dataUpload: "2024-12-19",
        visualizacoes: 52,
    },
    {
        id: 4,
        titulo: "Artigo: História das Equações Matemáticas",
        tipo: "link",
        url: "https://example.com/article",
        tamanho: "-",
        dataUpload: "2024-12-18",
        visualizacoes: 21,
    },
    {
        id: 5,
        titulo: "Slides da Aula - Bhaskara",
        tipo: "pdf",
        url: "#",
        tamanho: "3.2 MB",
        dataUpload: "2024-12-22",
        visualizacoes: 67,
    },
]

const tipoIcons = {
    pdf: File,
    video: Video,
    link: LinkIcon,
}

const tipoLabels = {
    pdf: "PDF",
    video: "Vídeo",
    link: "Link",
}

export default function ConteudosPage() {
    const params = useParams()
    const turmaId = params?.id ?? 'unknown'
    const materiaId = params?.materiaId ?? 'unknown'
    const [searchTerm, setSearchTerm] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)

    const filteredConteudos = mockConteudos.filter(conteudo =>
        conteudo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conteudo.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Link href="/turmas" className="hover:underline">
                            Turmas
                        </Link>
                        <span>/</span>
                        <Link href={`/turmas/${turmaId}/materias`} className="hover:underline">
                            3º Ano A
                        </Link>
                        <span>/</span>
                        <span>Matemática</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="h-6 w-6" />
                        Conteúdos - Matemática
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie PDFs, vídeos, links e outros materiais da matéria
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Conteúdo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Conteúdo</DialogTitle>
                            <DialogDescription>
                                Faça upload de um arquivo ou adicione um link de conteúdo
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="titulo">Título do Conteúdo</Label>
                                <Input
                                    id="titulo"
                                    placeholder="Ex: Aula 01 - Introdução"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo de Conteúdo</Label>
                                <select
                                    id="tipo"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="pdf">PDF</option>
                                    <option value="video">Link de Vídeo</option>
                                    <option value="link">Link / Artigo</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="arquivo">Upload de Arquivo ou URL</Label>
                                <Input
                                    id="arquivo"
                                    type="file"
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Ou cole a URL do conteúdo:
                                </p>
                                <Input
                                    id="url"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={() => setDialogOpen(false)}>
                                Adicionar Conteúdo
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total de Conteúdos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockConteudos.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">PDFs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockConteudos.filter(c => c.tipo === 'pdf').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Vídeos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockConteudos.filter(c => c.tipo === 'video').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockConteudos.filter(c => c.tipo === 'link').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Conteúdos</CardTitle>
                    <CardDescription>
                        Visualize e gerencie os materiais desta matéria
                    </CardDescription>
                    <div className="flex items-center gap-2 pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar conteúdo..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Tamanho</TableHead>
                                <TableHead>Data Upload</TableHead>
                                <TableHead>Visualizações</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredConteudos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Nenhum conteúdo encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredConteudos.map((conteudo) => {
                                    const Icon = tipoIcons[conteudo.tipo as keyof typeof tipoIcons]
                                    return (
                                        <TableRow key={conteudo.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{conteudo.titulo}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {tipoLabels[conteudo.tipo as keyof typeof tipoLabels]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{conteudo.tamanho}</TableCell>
                                            <TableCell>
                                                {new Date(conteudo.dataUpload).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span>{conteudo.visualizacoes}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Visualizar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Baixar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
