"use client"

import { Bell, Calendar as CalendarIcon, Filter, Megaphone, Plus, Search, User } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const avisos = [
    {
        id: 1,
        title: "Renovação de Matrículas 2025",
        content: "O período de renovação de matrículas para o ano letivo de 2025 começa na próxima segunda-feira. Procure a secretaria.",
        author: "Secretaria",
        date: "20/10/2024",
        category: "Administrativo",
        priority: "high"
    },
    {
        id: 2,
        title: "Feira de Ciências",
        content: "A feira de ciências deste ano terá como tema 'Sustentabilidade e Tecnologia'. As inscrições para projetos estão abertas.",
        author: "Coordenação Pedagógica",
        date: "18/10/2024",
        category: "Eventos",
        priority: "normal"
    },
    {
        id: 3,
        title: "Manutenção no Sistema",
        content: "O sistema de notas passará por manutenção programada neste sábado das 08h às 12h.",
        author: "TI Suporte",
        date: "15/10/2024",
        category: "Sistema",
        priority: "low"
    }
]

export default function AvisosPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Mural de Avisos</h1>
                <Button>
                    <Megaphone className="mr-2 h-4 w-4" />
                    Novo Aviso
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar avisos..." className="pl-8" />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrar
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {avisos.map((aviso) => (
                    <Card key={aviso.id} className={`flex flex-col justify-between border-l-4 ${aviso.priority === 'high' ? 'border-l-red-500' :
                            aviso.priority === 'normal' ? 'border-l-blue-500' : 'border-l-green-500'
                        }`}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">{aviso.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 text-xs">
                                        <span className="bg-muted px-2 py-0.5 rounded-full">{aviso.category}</span>
                                        <span>•</span>
                                        <span>{aviso.date}</span>
                                    </CardDescription>
                                </div>
                                {aviso.priority === 'high' && (
                                    <Bell className="h-4 w-4 text-red-500 animate-pulse" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {aviso.content}
                            </p>
                        </CardContent>
                        <CardFooter className="pt-4 border-t bg-muted/20">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                        {aviso.author.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium">Por: {aviso.author}</span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
