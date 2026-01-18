
"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"

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

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      items?: {
        title: string
        url: string
      }[]
    }[]
  }[]
}) {
  const pathname = usePathname() || ""
  const searchParams = useSearchParams()

  const checkIsActive = (url: string) => {
    const currentSearch = searchParams?.toString() ? `?${searchParams.toString()}` : ""
    const currentUrl = `${pathname}${currentSearch}`
    return currentUrl === url || currentUrl.startsWith(`${url}/`)
  }

  // Recursive function to check if any nested item is active
  const hasActiveChild = (items: any[]): boolean => {
    return items.some(item => {
      if (checkIsActive(item.url)) return true
      if (item.items) return hasActiveChild(item.items)
      return false
    })
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Check if current path matches item url or if any sub-item matches
          const isActive = checkIsActive(item.url) ||
            (item.items ? hasActiveChild(item.items) : false)

          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                >
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          // Check if subitem or any of its children matches
                          const isSubActive = checkIsActive(subItem.url) ||
                            (subItem.items ? hasActiveChild(subItem.items) : false)

                          return (
                            <Collapsible key={subItem.title} asChild defaultOpen={isSubActive} className="group/collapsible">
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                                {subItem.items?.length ? (
                                  <>
                                    <CollapsibleTrigger asChild>
                                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                                        <ChevronRight />
                                        <span className="sr-only">Toggle</span>
                                      </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                      <SidebarMenuSub>
                                        {subItem.items?.map((subSubItem) => {
                                          const isSubSubActive = checkIsActive(subSubItem.url)
                                          return (
                                            <SidebarMenuSubItem key={subSubItem.title}>
                                              <SidebarMenuSubButton asChild isActive={isSubSubActive}>
                                                <a href={subSubItem.url}>
                                                  <span>{subSubItem.title}</span>
                                                </a>
                                              </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                          )
                                        })}
                                      </SidebarMenuSub>
                                    </CollapsibleContent>
                                  </>
                                ) : null}
                              </SidebarMenuSubItem>
                            </Collapsible>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

