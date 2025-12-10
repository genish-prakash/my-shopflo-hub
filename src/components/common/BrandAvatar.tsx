interface BrandAvatarProps {
  logo: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-lg",
  md: "h-10 w-10 text-xl",
  lg: "h-12 w-12 text-2xl",
  xl: "h-14 w-14 text-3xl",
};

/**
 * BrandAvatar - Consistent brand logo display with emoji or image support
 */
const BrandAvatar = ({ logo, name, size = "md", className = "" }: BrandAvatarProps) => {
  const isEmoji = /^\p{Emoji}$/u.test(logo);

  return (
    <div
      className={`rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 ${sizeStyles[size]} ${className}`}
      aria-label={name}
    >
      {isEmoji ? (
        <span>{logo}</span>
      ) : (
        <img src={logo} alt={name} className="h-full w-full object-cover rounded-xl" />
      )}
    </div>
  );
};

export default BrandAvatar;
