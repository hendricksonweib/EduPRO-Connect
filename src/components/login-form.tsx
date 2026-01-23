"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/utils/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authService, apiClient } from "@/services"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await authService.login(username, password)
      router.push("/dashboard")
    } catch (err) {
      const errorMessage = apiClient.handleError(err)

      if (errorMessage === "No active account found with the given credentials") {
        setError("Usuário ou senha incorretos. Por favor, verifique suas credenciais.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <Image
            src="/logo(4).png"
            alt="Logo"
            width={200}
            height={60}
            priority
          />
        </div>
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="username">Usuário</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="Digite seu usuário"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            aria-invalid={!!error}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            aria-invalid={!!error}
          />
        </Field>
        <Field>
          <FieldSeparator />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
