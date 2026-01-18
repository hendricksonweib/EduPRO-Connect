"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Loader2 } from "lucide-react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { calendarService } from "@/services/calendar.service"
import type { Event } from "@/services/types"
import { toast } from "sonner"

export default function CalendarioPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newEvent, setNewEvent] = useState<Partial<Event>>({
        title: "",
        date: "",
        time: "",
        type: "Outro",
        description: ""
    })

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [viewEventDialogOpen, setViewEventDialogOpen] = useState(false)

    const handleViewEvent = (event: Event) => {
        setSelectedEvent(event)
        setViewEventDialogOpen(true)
    }

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return

        try {
            await calendarService.events.delete(selectedEvent.id)
            toast.success("Evento removido com sucesso!")
            setViewEventDialogOpen(false)
            fetchEvents()
        } catch (error) {
            console.error("Erro ao remover evento:", error)
            toast.error("Erro ao remover evento.")
        }
    }

    const fetchEvents = async () => {
        setIsLoading(true)
        try {
            // Fetching all events for now. Ideally we would filter by month/year range.
            const response = await calendarService.events.getAll()
            setEvents(response.results)
        } catch (error) {
            console.error("Erro ao carregar eventos:", error)
            toast.error("Erro ao carregar eventos do calendário.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleCreateEvent = async () => {
        if (!newEvent.title || !newEvent.date || !newEvent.type) {
            toast.error("Preencha os campos obrigatórios.")
            return
        }

        setIsSubmitting(true)
        try {
            await calendarService.events.create(newEvent)
            toast.success("Evento criado com sucesso!")
            setIsDialogOpen(false)
            setNewEvent({
                title: "",
                date: "",
                time: "",
                type: "Outro",
                description: ""
            })
            fetchEvents()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao criar evento.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Calendar Helper Functions
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay()
    }

    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

    const calendarDays = Array.from({ length: 42 }, (_, i) => {
        const day = i - firstDay + 1
        return day > 0 && day <= daysInMonth ? day : null
    })

    // Filter events for the current month view
    const getEventsForDay = (day: number) => {
        if (!day) return []
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return events.filter(e => e.date === dateStr)
    }

    // Sort upcoming events
    const upcomingEvents = [...events]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Reunião': return 'bg-blue-500 text-white'
            case 'Feriado': return 'bg-red-500 text-white'
            case 'Acadêmico': return 'bg-green-500 text-white'
            default: return 'bg-gray-500 text-white'
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Calendário Escolar</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Evento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Criar Novo Evento</DialogTitle>
                            <DialogDescription>
                                Adicione um novo evento ao calendário escolar.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Título *
                                </Label>
                                <Input
                                    id="title"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">
                                    Data *
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="time" className="text-right">
                                    Hora
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={newEvent.time || ""}
                                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                    Tipo *
                                </Label>
                                <Select
                                    value={newEvent.type}
                                    onValueChange={(val: any) => setNewEvent({ ...newEvent, type: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Reunião">Reunião</SelectItem>
                                        <SelectItem value="Feriado">Feriado</SelectItem>
                                        <SelectItem value="Acadêmico">Acadêmico</SelectItem>
                                        <SelectItem value="Outro">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Descrição
                                </Label>
                                <Input
                                    id="description"
                                    value={newEvent.description || ""}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button onClick={handleCreateEvent} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Dialog open={viewEventDialogOpen} onOpenChange={setViewEventDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedEvent?.title}</DialogTitle>
                        <DialogDescription>Detalhes do evento</DialogDescription>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(selectedEvent.type)}`}>
                                    {selectedEvent.type}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    {new Date(selectedEvent.date).toLocaleDateString('pt-BR')}
                                </span>
                                {selectedEvent.time && (
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {selectedEvent.time}
                                    </span>
                                )}
                            </div>
                            {selectedEvent.description && (
                                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                    {selectedEvent.description}
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleDeleteEvent}>
                            Excluir Evento
                        </Button>
                        <Button variant="outline" onClick={() => setViewEventDialogOpen(false)}>
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                {/* Calendário Visual */}
                <Card className="h-full min-h-[600px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>{monthNames[currentMonth]} {currentYear}</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handlePrevMonth}>Anterior</Button>
                            <Button variant="outline" size="sm" onClick={handleNextMonth}>Próximo</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4 text-muted-foreground font-medium">
                            <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, index) => {
                                const dayEvents = getEventsForDay(day!);
                                return (
                                    <div
                                        key={index}
                                        className={`
                                            min-h-[100px] p-2 border rounded-md flex flex-col items-start justify-start transition-colors
                                            ${day === null ? "bg-muted/20 border-transparent" : "hover:bg-muted/50"}
                                        `}
                                    >
                                        <span className={`text-sm font-medium ${day === null ? "opacity-0" : ""}`}>
                                            {day}
                                        </span>
                                        {dayEvents.map(event => (
                                            <div
                                                key={event.id}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleViewEvent(event)
                                                }}
                                                className={`mt-1 w-full rounded px-1 py-0.5 text-[10px] truncate ${getTypeColor(event.type)} cursor-pointer hover:opacity-80 transition-opacity`}
                                                title={event.title}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                )
                            })}
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
                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : upcomingEvents.length === 0 ? (
                                <div className="text-center text-sm text-muted-foreground py-4">
                                    Nenhum evento futuro
                                </div>
                            ) : (
                                upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleViewEvent(event)}
                                        className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center justify-center rounded-md border bg-muted p-2 w-12 h-12 shrink-0">
                                            <span className="text-xs font-semibold">{event.date.split('-')[2]}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase">
                                                {new Date(event.date + 'T12:00:00').toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                                            </span>
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                            <p className="text-sm font-medium leading-none truncate" title={event.title}>{event.title}</p>
                                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                                                {event.time && (
                                                    <>
                                                        <Clock className="h-3 w-3" />
                                                        <span>{event.time}</span>
                                                    </>
                                                )}
                                            </div>
                                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors border-transparent ${getTypeColor(event.type)} opacity-80`}>
                                                {event.type}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
