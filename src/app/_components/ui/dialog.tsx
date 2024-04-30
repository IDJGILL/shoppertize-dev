"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { cn } from "~/lib/utils/functions/ui"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[100000000] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    hideBackdrop?: boolean
  }
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    {!!!props.hideBackdrop && <DialogOverlay />}

    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[50%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}

      <DialogPrimitive.Close className="absolute right-4 top-4 z-[1000000] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none", className)} {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

type ModelProps = {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (state: boolean) => void
  title?: string
  description?: string
  footer?: React.ReactNode
  height?: "screen" | "content"
  isLoading?: boolean
  scroll?: boolean
  confettiRef?: React.RefObject<HTMLCanvasElement>
  hideBackdrop?: boolean
}

interface ModelXDrawerProps extends React.HTMLAttributes<HTMLElement>, ModelProps {}

function ModelXDrawer({ ...props }: ModelXDrawerProps) {
  const {} = props

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>

      <DialogContent
        className={cn(
          "bottom-0 z-[100000000] max-w-full translate-y-[0%] overflow-hidden rounded-t-md data-[state=closed]:!slide-out-to-bottom-[48%] data-[state=open]:!slide-in-from-bottom-1/2 sm:top-[50%] sm:max-w-[425px] sm:translate-y-[-50%] md:h-max",
          {
            "top-[0%] z-[100000000] h-full gap-0 rounded-none": props.height === "screen",
            "h-[360px]": props.scroll,
          },
          props.className,
        )}
        hideBackdrop={props.hideBackdrop}
      >
        {props.title && (
          <DialogHeader className="p-4">
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>
        )}

        <main
          className={cn("relative h-full", {
            "overflow-y-auto": props.scroll,
          })}
        >
          {props.children}

          {props.isLoading && (
            <div className={cn("absolute inset-x-0 top-0 h-full w-full bg-white bg-opacity-50")}></div>
          )}
        </main>

        {props.footer}
      </DialogContent>
    </Dialog>
  )
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  ModelXDrawer,
}
