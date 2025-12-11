import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { getUserInitials } from "@/lib/userUtils";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
  fallbackClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
};

const fallbackSizeClasses = {
  sm: "text-xs",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

/**
 * UserAvatar - Displays user avatar with initials from user data
 * Falls back to user icon if no name is available
 */
const UserAvatar = ({ className, fallbackClassName, size = "md" }: UserAvatarProps) => {
  const { user } = useUser();
  const initials = getUserInitials(user);

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback
        className={cn(
          "bg-neutral-200 text-neutral-600 font-semibold",
          fallbackSizeClasses[size],
          fallbackClassName
        )}
      >
        {initials || <User className={iconSizeClasses[size]} />}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
