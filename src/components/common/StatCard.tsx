import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: "primary" | "accent" | "success" | "tertiary";
  className?: string;
}

const iconColorStyles = {
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
  tertiary: "text-tertiary",
};

/**
 * StatCard - Compact stat display with icon
 */
const StatCard = ({
  icon: Icon,
  label,
  value,
  variant = "primary",
  className = "",
}: StatCardProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColorStyles[variant]}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
};

export default StatCard;
