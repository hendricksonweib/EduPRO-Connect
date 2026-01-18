"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/utils/utils"
import { buttonVariants } from "@/components/ui/button"

function AlertDialog({ ...props }: React.ComponentProps<typeof Dialog>) {
    return <Dialog {...props} />
}

function AlertDialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger {...props} />
}

function AlertDialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal {...props} />
}

function AlertDialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            className={cn(
                "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                className
            )}
            {...props}
        />
    )
}

function AlertDialogContent({
    className,
    ...props
}: React.ComponentProps<typeof DialogContent>) {
    return (
        <DialogContent
            className={cn("sm:max-w-lg", className)}
            showCloseButton={false}
            {...props}
        />
    )
}

function AlertDialogHeader({
    className,
    ...props
}: React.ComponentProps<typeof DialogHeader>) {
    return <DialogHeader className={cn("text-center sm:text-left", className)} {...props} />
}

function AlertDialogFooter({
    className,
    ...props
}: React.ComponentProps<typeof DialogFooter>) {
    return <DialogFooter className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2", className)} {...props} />
}

function AlertDialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogTitle>) {
    return <DialogTitle className={cn("text-lg font-semibold", className)} {...props} />
}

function AlertDialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogDescription>) {
    return <DialogDescription className={cn("text-sm text-muted-foreground", className)} {...props} />
}

function AlertDialogAction({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return (
        <DialogPrimitive.Close
            className={cn(buttonVariants(), className)}
            {...props}
        />
    )
}

function AlertDialogCancel({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return (
        <DialogPrimitive.Close
            className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-2 sm:mt-0",
                className
            )}
            {...props}
        />
    )
}

export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
}
