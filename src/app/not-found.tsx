import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background">
            <div className="relative h-64 w-64">
                <Image
                    src="/error.gif"
                    alt="Página não encontrada"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Página não encontrada</h2>
                <p className="text-muted-foreground">
                    A página que você está procurando não existe ou foi movida.
                </p>
            </div>
            <Button asChild variant="default">
                <Link href="/">
                    Voltar para o início
                </Link>
            </Button>
        </div>
    )
}
