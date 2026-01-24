# DetailSheet Component - Documentação

## 📋 Visão Geral

O `DetailSheet` é um componente **genérico e reutilizável** que exibe detalhes de qualquer entidade em um painel lateral (Sheet). Perfeito para mostrar informações completas ao clicar em linhas de tabelas.

## 🎯 Características

- ✅ **100% Reutilizável** - Funciona com qualquer tipo de dados
- ✅ **Seções Customizáveis** - Organize informações em categorias
- ✅ **Avatar e Badge** - Suporte visual para identidade e status
- ✅ **Ações Integradas** - Botões de editar e excluir prontos
- ✅ **Responsivo** - Adapta-se a mobile e desktop
- ✅ **TypeScript** - Totalmente tipado

---

## 📦 Instalação

O componente já está em:
```
/src/components/detail-sheet.tsx
```

## 🚀 Uso Básico

### 1. Importar o Componente

```tsx
import { DetailSheet, type DetailSection } from "@/components/detail-sheet"
```

### 2. Definir as Seções

```tsx
const sections: DetailSection[] = [
    {
        title: "Informações Pessoais",
        icon: <User className="h-4 w-4" />,
        fields: [
            { label: "Nome", value: "João Silva" },
            { label: "CPF", value: "123.456.789-00" },
            { label: "Email", value: "joao@example.com" },
        ]
    },
    {
        title: "Contato",
        icon: <Phone className="h-4 w-4" />,
        fields: [
            { label: "Telefone", value: "(11) 98765-4321" },
            { label: "Endereço", value: "Rua Exemplo, 123", fullWidth: true },
        ]
    }
]
```

### 3. Usar o Componente

```tsx
<DetailSheet
    open={!!selectedItem}
    onOpenChange={(open) => !open && setSelectedItem(null)}
    title="João Silva"
    subtitle="Matrícula: 2024001"
    description="Informações detalhadas"
    avatar="/avatar.jpg"
    avatarFallback="JS"
    badge={{
        label: "Ativo",
        variant: "default"
    }}
    sections={sections}
    editUrl="/alunos/editar/1"
    onDelete={() => handleDelete(1)}
/>
```

---

## 📖 Props

### Principais

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `open` | `boolean` | ✅ | Controla se o Sheet está aberto |
| `onOpenChange` | `(open: boolean) => void` | ✅ | Callback quando o estado muda |
| `title` | `string` | ✅ | Título principal (nome da entidade) |
| `sections` | `DetailSection[]` | ✅ | Array de seções com campos |

### Opcionais

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `subtitle` | `string` | - | Subtítulo (ex: matrícula) |
| `description` | `string` | `"Informações detalhadas"` | Descrição do Sheet |
| `avatar` | `string \| null` | - | URL do avatar |
| `avatarFallback` | `string` | Auto (iniciais) | Fallback do avatar |
| `badge` | `BadgeConfig` | - | Configuração do badge de status |
| `editUrl` | `string` | - | URL para edição (mostra botão) |
| `onDelete` | `() => void` | - | Callback de exclusão (mostra botão) |
| `customActions` | `ReactNode` | - | Ações personalizadas |

### Tipos

```typescript
interface DetailSection {
    title: string
    icon?: ReactNode
    fields: DetailField[]
}

interface DetailField {
    label: string
    value: string | number | ReactNode
    fullWidth?: boolean  // Campo ocupa largura total
}

interface BadgeConfig {
    label: string
    variant?: "default" | "secondary" | "destructive" | "outline"
}
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Alunos

```tsx
const studentSections: DetailSection[] = [
    {
        title: "Informações Pessoais",
        icon: <User className="h-4 w-4" />,
        fields: [
            { label: "Data de Nascimento", value: formatDate(student.birth_date) },
            { label: "CPF", value: student.cpf || 'N/A' },
        ]
    },
    {
        title: "Contato",
        icon: <Phone className="h-4 w-4" />,
        fields: [
            { label: "Telefone", value: student.phone },
            { label: "Responsável", value: student.guardian },
        ]
    }
]

<DetailSheet
    open={!!selectedStudent}
    onOpenChange={(open) => !open && setSelectedStudent(null)}
    title={selectedStudent?.name || ""}
    subtitle={`Matrícula: ${selectedStudent?.registration}`}
    avatar={selectedStudent?.avatar}
    badge={{
        label: selectedStudent?.status === "ativo" ? "Ativo" : "Inativo",
        variant: selectedStudent?.status === "ativo" ? "default" : "secondary"
    }}
    sections={studentSections}
    editUrl={`/alunos/editar/${selectedStudent?.id}`}
    onDelete={() => handleDelete(selectedStudent?.id)}
/>
```

### Exemplo 2: Professores

```tsx
const teacherSections: DetailSection[] = [
    {
        title: "Dados Profissionais",
        icon: <Briefcase className="h-4 w-4" />,
        fields: [
            { label: "Formação", value: teacher.education },
            { label: "Matérias", value: (
                <div className="flex flex-wrap gap-1">
                    {teacher.disciplines?.map(d => (
                        <Badge key={d.id} variant="outline">{d.name}</Badge>
                    ))}
                </div>
            ), fullWidth: true },
        ]
    },
    {
        title: "Dados Bancários",
        icon: <CreditCard className="h-4 w-4" />,
        fields: [
            { label: "Banco", value: teacher.bank || 'N/A' },
            { label: "Agência", value: teacher.agency || 'N/A' },
            { label: "Conta", value: teacher.account || 'N/A' },
        ]
    }
]
```

### Exemplo 3: Turmas

```tsx
const classroomSections: DetailSection[] = [
    {
        title: "Informações da Turma",
        icon: <BookOpen className="h-4 w-4" />,
        fields: [
            { label: "Período", value: classroom.period },
            { label: "Ano", value: classroom.year },
            { label: "Professor Responsável", value: classroom.responsible_teacher_name },
        ]
    },
    {
        title: "Estatísticas",
        icon: <BarChart className="h-4 w-4" />,
        fields: [
            { label: "Total de Alunos", value: classroom.total_students },
            { label: "Total de Matérias", value: classroom.total_disciplines },
        ]
    }
]
```

---

## 🎨 Customização

### Campos com Largura Total

Use `fullWidth: true` para campos que precisam de mais espaço:

```tsx
{
    label: "Endereço Completo",
    value: "Rua Exemplo, 123 - Bairro - Cidade/UF",
    fullWidth: true
}
```

### Valores Personalizados

Você pode passar qualquer ReactNode como valor:

```tsx
{
    label: "Status",
    value: <Badge variant="success">Aprovado</Badge>
}
```

### Ações Personalizadas

```tsx
<DetailSheet
    {...props}
    customActions={
        <>
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
            </Button>
            <Button variant="secondary" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
            </Button>
        </>
    }
/>
```

---

## 🔧 Dicas de Uso

### 1. Use useMemo para Seções

```tsx
const sections = useMemo((): DetailSection[] => {
    if (!selectedItem) return []
    
    return [
        // ... suas seções
    ]
}, [selectedItem])
```

### 2. Formatação de Dados

Crie funções auxiliares:

```tsx
const formatDate = (date?: string | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('pt-BR')
}

const formatCurrency = (value?: number) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(value)
}
```

### 3. Click na Linha da Tabela

```tsx
<TableRow 
    className="cursor-pointer hover:bg-muted/50"
    onClick={() => setSelectedItem(item)}
>
    {/* ... células */}
    <TableCell onClick={(e) => e.stopPropagation()}>
        {/* Menu de ações - não propaga o click */}
    </TableCell>
</TableRow>
```

---

## 📱 Responsividade

O componente é totalmente responsivo:

- **Desktop**: Sheet lateral de 512px
- **Mobile**: Sheet ocupa tela inteira
- **Scroll**: Automático para conteúdo longo

---

## ✅ Checklist de Implementação

- [ ] Importar `DetailSheet` e tipos
- [ ] Criar estado `selectedItem`
- [ ] Definir seções com `useMemo`
- [ ] Adicionar `onClick` nas linhas da tabela
- [ ] Configurar props do `DetailSheet`
- [ ] Testar abertura/fechamento
- [ ] Testar ações (editar/excluir)

---

## 🎯 Próximos Passos

Implemente em:
- ✅ Alunos (já implementado)
- ⏳ Professores
- ⏳ Turmas
- ⏳ Funcionários
- ⏳ Matérias da Turma

---

**Criado por**: EduPro Connect Team
**Versão**: 1.0.0
**Data**: Janeiro 2026
