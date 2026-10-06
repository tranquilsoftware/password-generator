// In Badge.tsx
import { cva } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "bg-transparent",
      },
      color: {
        cyan: 'text-cyan-400 border-cyan-400 bg-cyan-600/20',
        red: 'text-red-400 border-red-500 bg-red-600/20',
        lime: 'text-lime-400 border-lime-500 bg-lime-600/20',
        purple: 'text-white border-purple-600 bg-purple-600/20',
        blue: 'text-blue-400 border-blue-500 bg-blue-600/20',
        green: 'text-green-400 border-green-500 bg-green-600/20',
        yellow: 'text-yellow-400 border-yellow-500 bg-yellow-600/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs border',
        md: 'px-3 py-1 text-sm border-2',
        lg: 'px-4 py-2 text-base border-2',
      }
    },
    defaultVariants: {
      variant: "default",
      color: "blue",
      size: "md",
    },
  }
)

export type BadgeVariant = 'default' | 'outline';
export type BadgeColor = 'cyan' | 'blue' | 'red' | 'purple' | 'lime' | 'green' | 'yellow';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  className?: string;
  children: React.ReactNode;
}

function Badge({ 
  variant = 'default',
  color = 'blue',
  size = 'md',
  className,
  children,
  ...props 
}: BadgeProps) {
  return (
    <div 
      className={badgeVariants({ variant, color, size, className })}
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge, badgeVariants }