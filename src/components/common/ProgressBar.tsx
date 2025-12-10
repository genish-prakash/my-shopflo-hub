interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  variant?: "primary" | "accent" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  primary: "bg-gradient-primary",
  accent: "bg-gradient-accent",
  success: "bg-gradient-success",
};

const sizeStyles = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

/**
 * ProgressBar - Reusable progress indicator with gradient variants
 */
const ProgressBar = ({
  current,
  total,
  showLabel = true,
  variant = "primary",
  size = "md",
  className = "",
}: ProgressBarProps) => {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{current}/{total}</span>
        </div>
      )}
      <div className={`bg-secondary rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`h-full transition-all duration-300 ease-out ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
