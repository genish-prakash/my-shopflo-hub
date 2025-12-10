import { ReactNode } from "react";

interface TouchableCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
}

/**
 * TouchableCard - Card with touch-friendly interactions and hover states
 */
const TouchableCard = ({
  children,
  onClick,
  className = "",
  interactive = true,
}: TouchableCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-card rounded-xl shadow-card overflow-hidden
        ${interactive ? "hover:shadow-card-hover active:scale-[0.98] transition-all duration-200 cursor-pointer" : ""}
        ${className}
      `}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default TouchableCard;
