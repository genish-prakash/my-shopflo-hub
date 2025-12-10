import { Badge } from "@/components/ui/badge";

type StatusType = "success" | "warning" | "error" | "info" | "default";

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  error: "bg-destructive text-destructive-foreground",
  info: "bg-primary text-primary-foreground",
  default: "bg-muted text-muted-foreground",
};

/**
 * StatusBadge - Reusable status indicator with consistent styling
 */
const StatusBadge = ({ status, type = "default", className = "" }: StatusBadgeProps) => {
  return (
    <Badge className={`${statusStyles[type]} ${className}`}>
      {status}
    </Badge>
  );
};

export default StatusBadge;

// Helper to determine status type from common status strings
export const getStatusType = (status: string): StatusType => {
  const lowercaseStatus = status.toLowerCase();
  
  if (["delivered", "completed", "success", "active"].includes(lowercaseStatus)) {
    return "success";
  }
  if (["in transit", "processing", "pending"].includes(lowercaseStatus)) {
    return "info";
  }
  if (["warning", "delayed"].includes(lowercaseStatus)) {
    return "warning";
  }
  if (["cancelled", "failed", "error"].includes(lowercaseStatus)) {
    return "error";
  }
  
  return "default";
};
