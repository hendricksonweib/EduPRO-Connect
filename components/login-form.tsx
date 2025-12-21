import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">EduPro</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Connect
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="Digite seu e-mail" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
          </div>
          <Input id="password" type="password" placeholder="Digite sua senha" required />
        </Field>
        <Field>
          <Button type="submit">Entrar</Button>
        </Field>
        <FieldSeparator/>
        <Field>
          <FieldDescription className="text-center">
            Novo por aqui?{" "}
            <a href="#" className="underline underline-offset-4">
              Crie sua conta
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
