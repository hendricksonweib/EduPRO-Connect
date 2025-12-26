"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Clock, MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock de dias do mês (exemplo: Outubro 2024 apenas para visualização)
const days = Array.from({ length: 35 }, (_, i) => {
    const day = i - 1 // Começando dia 29 do mês anterior
    return day > 0 && day <= 31 ? day : null
})

const events = [
    { id: 1, title: "Reunião Pedagógica", date: "10/10", time: "14:00", type: "Reunião" },
    { id: 2, title: "Feriado - Dia do Professor", date: "15/10", time: "Dia todo", type: "Feriado" },
    { id: 3, title: "Conselho de Classe", date: "20/10", time: "08:00", type: "Acadêmico" },
]

export default function CalendarioPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Calendário Escolar</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Evento
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                {/* Calendário Visual */}
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Outubro 2024</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Anterior</Button>
                            <Button variant="outline" size="sm">Próximo</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4 text-muted-foreground font-medium">
                            <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((day, index) => (
                                <div
                                    key={index}
                                    className={`
                                min-h-[80px] p-2 border rounded-md flex flex-col items-start justify-start transition-colors
                                ${day === null ? "bg-muted/20 border-transparent" : "hover:bg-muted/50 cursor-pointer"}
                                ${day === 10 ? "border-primary/50 bg-primary/5" : ""}
                            `}
                                >
                                    <span className={`text-sm font-medium ${day === null ? "opacity-0" : ""}`}>
                                        {day}
                                    </span>
                                    {day === 10 && (
                                        <div className="mt-1 w-full rounded bg-primary px-1 py-0.5 text-[10px] text-primary-foreground truncate">
                                            Reunião
                                        </div>
                                    )}
                                    {day === 15 && (
                                        <div className="mt-1 w-full rounded bg-red-500 px-1 py-0.5 text-[10px] text-white truncate">
                                            Feriado
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de Próximos Eventos */}
                <div className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Próximos Eventos</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {events.map((event) => (
                                <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                                    <div className="flex flex-col items-center justify-center rounded-md border bg-muted p-2 w-12 h-12">
                                        <span className="text-xs font-semibold">{event.date.split('/')[0]}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase">{event.date.split('/')[1] === '10' ? 'Out' : ''}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{event.title}</p>
                                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                                            <Clock className="h-3 w-3" />
                                            <span>{event.time}</span>
                                        </div>
                                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {event.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
