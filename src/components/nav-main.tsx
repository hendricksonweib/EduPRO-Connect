"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useMemo, useCallback } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: NavSubItem[]
}

type NavSubItem = {
  title: string
  url: string
  items?: { title: string; url: string }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname() || ""
  const searchParams = useSearchParams()

  const currentUrl = useMemo(() => {
    const search = searchParams?.toString()
    return search ? `${pathname}?${search}` : pathname
  }, [pathname, searchParams])

  const checkIsActive = useCallback((url: string) =>
    currentUrl === url || currentUrl.startsWith(`${url}/`),
    [currentUrl]
  )

  const hasActiveChild = useCallback((items: NavSubItem[]): boolean =>
    items.some(item => checkIsActive(item.url) || (item.items && hasActiveChild(item.items))),
    [checkIsActive]
  )

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = checkIsActive(item.url) || (item.items && hasActiveChild(item.items))

          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubActive = checkIsActive(subItem.url) ||
                            (subItem.items && hasActiveChild(subItem.items))

                          return (
                            <Collapsible key={subItem.title} asChild defaultOpen={isSubActive} className="group/collapsible">
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                                {subItem.items?.length && (
                                  <>
                                    <CollapsibleTrigger asChild>
                                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                                        <ChevronRight />
                                        <span className="sr-only">Toggle</span>
                                      </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                      <SidebarMenuSub>
                                        {subItem.items.map((subSubItem) => (
                                          <SidebarMenuSubItem key={subSubItem.title}>
                                            <SidebarMenuSubButton asChild isActive={checkIsActive(subSubItem.url)}>
                                              <a href={subSubItem.url}>
                                                <span>{subSubItem.title}</span>
                                              </a>
                                            </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                        ))}
                                      </SidebarMenuSub>
                                    </CollapsibleContent>
                                  </>
                                )}
                              </SidebarMenuSubItem>
                            </Collapsible>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
