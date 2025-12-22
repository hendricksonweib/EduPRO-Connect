import { Construction } from "lucide-react"

export default function WorkInProgressPage() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
            <div className="flex flex-col items-center gap-2 text-center">
                <Construction className="size-16 text-muted-foreground" />
                <h1 className="text-3xl font-bold">Ops! Ainda estamos trabalhando nisso</h1>
                <p className="text-muted-foreground text-lg max-w-md">
                    Esta funcionalidade está em desenvolvimento e estará disponível em breve.
                </p>
            </div>
        </div>
    )
}
