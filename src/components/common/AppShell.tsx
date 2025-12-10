import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * AppShell - Main layout wrapper with safe area handling for mobile
 */
const AppShell = ({ children, header, footer, className = "" }: AppShellProps) => {
  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`}>
      {header && (
        <div className="safe-top sticky top-0 z-50">
          {header}
        </div>
      )}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {children}
      </main>
      {footer && (
        <div className="safe-bottom sticky bottom-0 z-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default AppShell;
