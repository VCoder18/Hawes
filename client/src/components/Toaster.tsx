import {
  ToastRoot,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/useToast"
import { useEffect } from "react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  useEffect(() => {
    const handleClickOutside = () => {
      if (toasts.length > 0) {
        dismiss()
      }
    }

    if (toasts.length > 0) {
      document.addEventListener("click", handleClickOutside)
      return () => {
        document.removeEventListener("click", handleClickOutside)
      }
    }
  }, [toasts, dismiss])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, open, onOpenChange, variant, ...props }) {
        return (
          <ToastRoot
            key={id}
            open={open}
            onOpenChange={onOpenChange}
            variant={variant}
            onClick={(e) => {
              e.stopPropagation()
              dismiss(id)
            }}
            {...props}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </ToastRoot>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
