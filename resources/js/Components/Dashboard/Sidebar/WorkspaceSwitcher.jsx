import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Building2 } from "lucide-react";

export function WorkspaceSwitcher({ currentWorkspace }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>{currentWorkspace.name}</span>
          </div>
          <ChevronsUpDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--sidebar-width)]">
        <DropdownMenuItem>Acme Inc</DropdownMenuItem>
        <DropdownMenuItem>Personal</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 