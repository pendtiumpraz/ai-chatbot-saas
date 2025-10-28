import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils/cn"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-primary-600 text-white hover:bg-primary-700",
      secondary: "bg-secondary-600 text-white hover:bg-secondary-700",
      outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
      ghost: "text-primary-600 hover:bg-primary-50",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export default Button
