import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      icons={{
        success: <CircleCheckIcon className="size-4 text-current" />,
        info: <InfoIcon className="size-4 text-current" />,
        warning: <TriangleAlertIcon className="size-4 text-current" />,
        error: <OctagonXIcon className="size-4 text-current" />,
        loading: <Loader2Icon className="size-4 animate-spin text-current" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          // Status colors: Neutral high-contrast for meaning (DESIGN.md)
          "--success-bg": "oklch(0.96 0.04 145)",
          "--success-text": "oklch(0.25 0.08 145)",
          "--success-border": "oklch(0.85 0.1 145)",
          "--error-bg": "oklch(0.96 0.04 25)",
          "--error-text": "oklch(0.25 0.08 25)",
          "--error-border": "oklch(0.85 0.1 25)",
          "--warning-bg": "oklch(0.96 0.04 75)",
          "--warning-text": "oklch(0.25 0.08 75)",
          "--warning-border": "oklch(0.85 0.1 75)",
          "--info-bg": "var(--secondary)",
          "--info-text": "var(--secondary-foreground)",
          "--info-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:shadow-lg group-[.toaster]:border",
          success: "group-[.toaster]:bg-[var(--success-bg)] group-[.toaster]:text-[var(--success-text)] group-[.toaster]:border-[var(--success-border)]",
          error: "group-[.toaster]:bg-[var(--error-bg)] group-[.toaster]:text-[var(--error-text)] group-[.toaster]:border-[var(--error-border)]",
          warning: "group-[.toaster]:bg-[var(--warning-bg)] group-[.toaster]:text-[var(--warning-text)] group-[.toaster]:border-[var(--warning-border)]",
          info: "group-[.toaster]:bg-[var(--info-bg)] group-[.toaster]:text-[var(--info-text)] group-[.toaster]:border-[var(--info-border)]",
          description: "group-[.toast]:text-current group-[.toast]:opacity-80 group-[.toast]:font-medium",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
