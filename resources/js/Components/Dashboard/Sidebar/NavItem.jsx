import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";

export function NavItem({ href, icon: Icon, label, active, ...props }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
      {...props}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
} 