'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div className="relative h-64 w-64">
                <Image
                    src="/error.gif"
                    alt="Erro"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Ops! Algo deu errado</h2>
                <p className="text-muted-foreground">
                    Ocorreu um erro ao processar sua solicitação.
                </p>
            </div>
            <Button onClick={() => reset()} variant="default">
                Tentar novamente
            </Button>
        </div>
    )
}
