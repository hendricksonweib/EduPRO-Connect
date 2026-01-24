"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Plus,
    Search,
    FileText,
    Video,
    Link as LinkIcon,
    File,
    Download,
    Eye,
    Upload,
    Loader2,
    Calendar,
    BarChart3,
    ArrowLeft,
    ChevronRight,
    ExternalLink,
    FileType,
    Layers
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { academicService, type LearningContent, type ClassroomSubject } from "@/services"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DetailSheet, type DetailSection } from "@/components/detail-sheet"
import { Skeleton } from "@/components/ui/skeleton"

const TIPO_ICONS = {
    pdf: FileType,
    video: Video,
    link: LinkIcon,
    other: FileText,
} as const

const TIPO_LABELS = {
    pdf: "PDF",
    video: "Vídeo",
    link: "Link",
    other: "Outro",
} as const

const TIPO_COLORS = {
    pdf: "text-red-500 bg-red-50",
    video: "text-blue-500 bg-blue-50",
    link: "text-emerald-500 bg-emerald-50",
    other: "text-amber-500 bg-amber-50",
} as const

const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
        ? `https://www.youtube.com/embed/${match[2]}`
        : null;
}

export default function ConteudosPage() {
    const params = useParams()
    const turmaId = Number(params?.id)
    const materiaId = Number(params?.materiaId)

    const [searchTerm, setSearchTerm] = useState("")
    const [conteudos, setConteudos] = useState<LearningContent[]>([])
    const [classroomSubject, setClassroomSubject] = useState<ClassroomSubject | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [selectedContent, setSelectedContent] = useState<LearningContent | null>(null)
    const [previewItem, setPreviewItem] = useState<LearningContent | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content_type: "pdf" as "pdf" | "video" | "link" | "other",
        url: "",
        file: null as File | null,
    })

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true)
            const [subjectData, contentsData] = await Promise.all([
                academicService.classroomSubjects.getById(materiaId),
                academicService.learningContents.getAll(materiaId)
            ])
            setClassroomSubject(subjectData)
            setConteudos(contentsData.results)
        } catch (error: any) {
            console.error("Error fetching data:", error)
            toast.error(academicService.handleError(error) || "Erro ao carregar dados")
        } finally {
            setIsLoading(false)
        }
    }, [materiaId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setIsSubmitting(true)
            const data = new FormData()
            data.append('classroom_subject', materiaId.toString())
            data.append('title', formData.title)
            data.append('content_type', formData.content_type)

            if (formData.description) {
                data.append('description', formData.description)
            }

            if (formData.content_type === 'link' || formData.content_type === 'video') {
                if (!formData.url) {
                    toast.error("URL é obrigatória para este tipo de conteúdo")
                    return
                }
                data.append('external_url', formData.url)
            } else if (formData.file) {
                data.append('file', formData.file)
            } else {
                toast.error("Arquivo é obrigatório para este tipo de conteúdo")
                return
            }

            await academicService.learningContents.create(data)
            toast.success("Conteúdo adicionado com sucesso!")
            setDialogOpen(false)
            setFormData({
                title: "",
                description: "",
                content_type: "pdf",
                url: "",
                file: null,
            })
            fetchData()
        } catch (error: any) {
            console.error("Error creating content:", error)
            toast.error(academicService.handleError(error) || "Erro ao adicionar conteúdo")
        } finally {
            setIsSubmitting(false)
        }
    }, [formData, materiaId, fetchData])

    const handleDelete = useCallback(async () => {
        if (!deleteId) return

        try {
            await academicService.learningContents.delete(deleteId)
            toast.success("Conteúdo excluído com sucesso!")
            setConteudos(prev => prev.filter(c => c.id !== deleteId))
            setSelectedContent(null)
        } catch (error: any) {
            console.error("Error deleting content:", error)
            toast.error(academicService.handleError(error) || "Erro ao excluir conteúdo")
        } finally {
            setDeleteId(null)
        }
    }, [deleteId])

    const filteredConteudos = useMemo(() =>
        conteudos.filter(conteudo => {
            const term = searchTerm.toLowerCase()
            return conteudo.title.toLowerCase().includes(term) ||
                conteudo.content_type.toLowerCase().includes(term)
        }),
        [conteudos, searchTerm]
    )

    const stats = useMemo(() => ({
        total: conteudos.length,
        pdf: conteudos.filter(c => c.content_type === 'pdf').length,
        video: conteudos.filter(c => c.content_type === 'video').length,
        link: conteudos.filter(c => c.content_type === 'link').length,
    }), [conteudos])

    const contentDetailSections = useMemo((): DetailSection[] => {
        if (!selectedContent) return []

        return [
            {
                title: "Informações do Conteúdo",
                icon: <FileText className="h-4 w-4" />,
                fields: [
                    { label: "Título", value: selectedContent.title },
                    {
                        label: "Tipo", value: (
                            <Badge variant="outline">
                                {TIPO_LABELS[selectedContent.content_type as keyof typeof TIPO_LABELS]}
                            </Badge>
                        )
                    },
                    { label: "Descrição", value: selectedContent.description || 'Sem descrição', fullWidth: true },
                ]
            },
            {
                title: "Detalhes do Arquivo",
                icon: <FileType className="h-4 w-4" />,
                fields: [
                    ...(selectedContent.file_size ? [{ label: "Tamanho", value: formatFileSize(selectedContent.file_size) }] : []),
                    ...(selectedContent.external_url ? [{ label: "URL", value: selectedContent.external_url, fullWidth: true }] : []),
                    { label: "Data de Upload", value: formatDate(selectedContent.created_at) },
                ]
            },
            {
                title: "Estatísticas",
                icon: <BarChart3 className="h-4 w-4" />,
                fields: [
                    {
                        label: "Visualizações",
                        value: (
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="font-bold">{selectedContent.views || 0}</span>
                            </div>
                        )
                    },
                ]
            },
        ]
    }, [selectedContent])

    if (isLoading && conteudos.length === 0) {
        return (
            <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Skeleton className="h-4 w-20" />
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                            <Skeleton className="h-4 w-24" />
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-9 w-64" />
                        </div>
                        <Skeleton className="h-6 w-48 mt-2 ml-12" />
                    </div>
                    <Skeleton className="h-11 w-44 rounded-xl" />
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                    ))}
                </div>

                <div className="space-y-4">
                    <Skeleton className="h-11 w-full max-w-md rounded-xl" />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-[2rem]" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary/80 mb-2 font-medium">
                        <Link href="/turmas" className="hover:text-primary transition-colors">
                            Turmas
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <Link href={`/turmas/${turmaId}/materias`} className="hover:text-primary transition-colors font-medium">
                            {classroomSubject?.classroom_name || 'Turma'}
                        </Link>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-muted-foreground">{classroomSubject?.subject_name || 'Matéria'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild className="rounded-full">
                            <Link href={`/turmas/${turmaId}/materias`}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Materiais de Estudo
                        </h1>
                    </div>
                    <p className="text-muted-foreground mt-1 text-lg italic ml-12">
                        {classroomSubject?.subject_name} • {classroomSubject?.teacher_name}
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-lg shadow-primary/20 rounded-xl">
                            <Plus className="mr-2 h-5 w-5" />
                            Novo Material
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] rounded-3xl">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Adicionar Material</DialogTitle>
                                <DialogDescription>
                                    Compartilhe arquivos, vídeos ou links com a turma.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="space-y-2">
                                    <Label htmlFor="titulo" className="font-semibold">Título do Material *</Label>
                                    <Input
                                        id="titulo"
                                        placeholder="Ex: Apostila de Revisão - Cap 01"
                                        className="rounded-xl h-11"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tipo" className="font-semibold">Tipo de Material *</Label>
                                    <select
                                        id="tipo"
                                        className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={formData.content_type}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            content_type: e.target.value as any,
                                            file: null,
                                            url: ""
                                        }))}
                                    >
                                        <option value="pdf">Documento PDF</option>
                                        <option value="video">Vídeo (YouTube/Vimeo)</option>
                                        <option value="link">Link de Artigo / Site</option>
                                        <option value="other">Outro Arquivo</option>
                                    </select>
                                </div>

                                {(formData.content_type === 'link' || formData.content_type === 'video') ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="url" className="font-semibold">URL do Recurso *</Label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="url"
                                                type="url"
                                                placeholder="https://exemplo.com/recurso"
                                                className="pl-10 rounded-xl h-11"
                                                value={formData.url}
                                                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="arquivo" className="font-semibold">Upload do Arquivo *</Label>
                                        <div className="border-2 border-dashed border-muted-foreground/20 rounded-2xl p-4 transition-colors hover:border-primary/40 group">
                                            <Input
                                                id="arquivo"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    file: e.target.files?.[0] || null
                                                }))}
                                                accept={formData.content_type === 'pdf' ? '.pdf' : undefined}
                                                required
                                            />
                                            <Label htmlFor="arquivo" className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4">
                                                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                                                    <Upload className="h-6 w-6 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground">
                                                    {formData.file ? formData.file.name : "Clique para selecionar o arquivo"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formData.content_type === 'pdf' ? "Apenas arquivos .pdf" : "Formatos variados suportados"}
                                                </span>
                                            </Label>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="descricao" className="font-semibold">Observações (Opcional)</Label>
                                    <Textarea
                                        id="descricao"
                                        placeholder="Instruções para os alunos..."
                                        className="rounded-xl min-h-[100px]"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl">
                                    Cancelar
                                </Button>
                                <Button type="submit" className="rounded-xl px-8 shadow-md" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    Publicar Material
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Total", val: stats.total, icon: Layers, color: "blue" },
                    { label: "PDFs", val: stats.pdf, icon: FileType, color: "red" },
                    { label: "Vídeos", val: stats.video, icon: Video, color: "blue" },
                    { label: "Links", val: stats.link, icon: LinkIcon, color: "emerald" },
                ].map((s, idx) => (
                    <Card key={idx} className="border-none bg-muted/30 shadow-none border border-muted/20 rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardDescription className="font-medium text-foreground/70">{s.label}</CardDescription>
                            <s.icon className={`h-4 w-4 text-${s.color}-500 opacity-70`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{s.val}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                        placeholder="Pesquisar em materiais..."
                        className="pl-10 h-11 bg-background border-muted rounded-xl focus:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredConteudos.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted/40">
                            <div className="bg-background p-5 rounded-full shadow-sm mb-4">
                                <FileText className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Nenhum material encontrado</h3>
                            <p className="text-muted-foreground max-w-xs mt-2">
                                {searchTerm ? "Não encontramos resultados para sua busca." : "Ainda não existem materiais cadastrados para esta disciplina."}
                            </p>
                        </div>
                    ) : (
                        filteredConteudos.map((conteudo) => {
                            const Icon = TIPO_ICONS[conteudo.content_type as keyof typeof TIPO_ICONS] || FileText
                            const colorClass = TIPO_COLORS[conteudo.content_type as keyof typeof TIPO_COLORS] || ""

                            return (
                                <Card key={conteudo.id} className="group relative overflow-hidden rounded-[2rem] border-muted/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col">
                                    <div className={`absolute top-0 left-0 w-2 h-full ${colorClass.split(' ')[0]}`} />
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className={`p-3 rounded-2xl ${colorClass}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setPreviewItem(conteudo)}>
                                                        <Eye className="mr-2 h-4 w-4" /> Visualizar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setSelectedContent(conteudo)}>
                                                        <Layers className="mr-2 h-4 w-4" /> Detalhes
                                                    </DropdownMenuItem>
                                                    {conteudo.file_url && (
                                                        <DropdownMenuItem asChild>
                                                            <a href={conteudo.file_url} download>
                                                                <Download className="mr-2 h-4 w-4" /> Baixar
                                                            </a>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => setDeleteId(conteudo.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-4">
                                        <div>
                                            <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors cursor-pointer" onClick={() => setPreviewItem(conteudo)}>
                                                {conteudo.title}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 italic">
                                                {conteudo.description || "Sem descrição adicional"}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">
                                                {TIPO_LABELS[conteudo.content_type as keyof typeof TIPO_LABELS]}
                                            </Badge>
                                            {conteudo.file_size && (
                                                <Badge variant="outline" className="text-[10px] py-0">
                                                    {formatFileSize(conteudo.file_size)}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2 pb-6 flex items-center justify-between border-t border-muted/10 bg-muted/5">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {formatDate(conteudo.created_at)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="outline" className="rounded-full h-8 px-4" onClick={() => setPreviewItem(conteudo)}>
                                                {conteudo.content_type === 'pdf' || conteudo.content_type === 'video' ? 'Visualizar' : 'Acessar'} <Eye className="ml-2 h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            )
                        })
                    )}

                </div>
            </div>

            {/* Preview Dialog */}
            <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
                <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[1100px] h-[90vh] p-0 overflow-hidden flex flex-col rounded-[2rem] border-none shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)]">
                    <DialogHeader className="p-6 bg-muted/30 border-b relative">
                        <div className="flex items-center gap-4">
                            {previewItem && (
                                <div className={`p-3 rounded-2xl ${TIPO_COLORS[previewItem.content_type as keyof typeof TIPO_COLORS] || ""}`}>
                                    {(() => {
                                        const Icon = TIPO_ICONS[previewItem.content_type as keyof typeof TIPO_ICONS] || FileText
                                        return <Icon className="h-6 w-6" />
                                    })()}
                                </div>
                            )}
                            <div className="pr-8">
                                <DialogTitle className="text-2xl font-bold tracking-tight">{previewItem?.title}</DialogTitle>
                                <DialogDescription className="text-sm font-medium mt-0.5">
                                    {previewItem ? TIPO_LABELS[previewItem.content_type as keyof typeof TIPO_LABELS] : ""} • {classroomSubject?.subject_name}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 bg-background relative overflow-hidden">
                        {previewItem?.content_type === 'pdf' && (
                            <iframe
                                src={`${previewItem.file_url}#toolbar=0`}
                                className="w-full h-full border-none"
                                title={previewItem.title}
                            />
                        )}

                        {previewItem?.content_type === 'video' && (() => {
                            const embedUrl = getYouTubeEmbedUrl(previewItem.external_url || "");
                            if (embedUrl) {
                                return (
                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                        <iframe
                                            src={embedUrl}
                                            className="w-full h-full aspect-video border-none"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={previewItem.title}
                                        />
                                    </div>
                                );
                            }
                            return (
                                <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-6">
                                    <div className="p-6 rounded-full bg-blue-100 dark:bg-blue-900/20">
                                        <Video className="h-12 w-12 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Vídeo Externo</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto">
                                            Este vídeo reside em uma plataforma externa que não permite incorporação direta.
                                        </p>
                                    </div>
                                    <Button size="lg" className="rounded-xl px-8" asChild>
                                        <a href={previewItem?.external_url || ""} target="_blank" rel="noopener noreferrer">
                                            Ver na Plataforma Original <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            );
                        })()}

                        {previewItem?.content_type === 'link' && (
                            <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-8">
                                <div className="p-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 relative">
                                    <LinkIcon className="h-16 w-16 text-emerald-600" />
                                    <div className="absolute -top-1 -right-1 h-6 w-6 bg-background rounded-full flex items-center justify-center border-2 border-emerald-600">
                                        <ExternalLink className="h-3 w-3 text-emerald-600" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold mb-4">Link de Estudo</h3>
                                    <p className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed">
                                        Você está prestes a abrir um recurso externo. Os materiais em links externos podem conter leituras complementares recomendadas.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-4 w-full">
                                    <Button size="lg" className="rounded-2xl px-12 h-14 text-lg shadow-xl shadow-emerald-500/10" asChild>
                                        <a href={previewItem?.external_url || ""} target="_blank" rel="noopener noreferrer">
                                            Abrir Conteúdo <ExternalLink className="ml-2 h-5 w-5" />
                                        </a>
                                    </Button>
                                    <div className="px-6 py-2 bg-muted rounded-full text-[10px] font-mono text-muted-foreground select-all opacity-60 hover:opacity-100 transition-opacity">
                                        {previewItem?.external_url}
                                    </div>
                                </div>
                            </div>
                        )}

                        {previewItem?.content_type === 'other' && (
                            <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-8">
                                <div className="p-8 rounded-full bg-amber-100 dark:bg-amber-900/20">
                                    <FileText className="h-16 w-16 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold mb-4">Download Necessário</h3>
                                    <p className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed">
                                        Este tipo de arquivo ({previewItem?.file_url?.split('.').pop()?.toUpperCase()}) deve ser baixado para visualização em seu computador ou tablet.
                                    </p>
                                </div>
                                <Button size="lg" className="rounded-2xl px-12 h-14 text-lg shadow-xl shadow-amber-500/10" asChild>
                                    <a href={previewItem?.file_url || ""} download>
                                        Baixar agora <Download className="ml-2 h-5 w-5" />
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="px-8 py-5 border-t bg-muted/20 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{previewItem && formatDate(previewItem.created_at)}</span>
                            </div>
                            <div className="h-4 w-px bg-muted-foreground/20 hidden md:block" />
                            <div className="text-foreground/70">
                                {previewItem?.description || "Sem descrição disponível."}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {previewItem?.file_url && (
                                <Button variant="outline" size="sm" className="rounded-xl px-4" asChild>
                                    <a href={previewItem.file_url} download>
                                        <Download className="mr-2 h-4 w-4" /> Salvar Cópia
                                    </a>
                                </Button>
                            )}
                            <Button className="rounded-xl px-6 min-w-[120px]" onClick={() => setPreviewItem(null)}>
                                Fechar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Content Details Sheet */}
            <DetailSheet
                open={!!selectedContent}
                onOpenChange={(open) => !open && setSelectedContent(null)}
                title={selectedContent?.title || ""}
                subtitle={selectedContent ? TIPO_LABELS[selectedContent.content_type as keyof typeof TIPO_LABELS] : ""}
                description="Informações detalhadas do conteúdo"
                badge={{
                    label: selectedContent ? TIPO_LABELS[selectedContent.content_type as keyof typeof TIPO_LABELS] : "",
                    variant: "outline"
                }}
                sections={contentDetailSections}
                onDelete={() => {
                    if (selectedContent) {
                        setDeleteId(selectedContent.id)
                        setSelectedContent(null)
                    }
                }}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir material permanentemente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação removerá o arquivo de nossos servidores e nenhum aluno poderá mais acessá-lo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                            Sim, Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

