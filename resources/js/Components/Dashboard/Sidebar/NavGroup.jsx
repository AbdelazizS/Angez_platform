"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion";
import { NavItem } from "./NavItem";

export function NavGroup({ icon: Icon, label, items }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={label} className="border-b-0">
        <AccordionTrigger className="py-2 hover:no-underline">
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-1 pl-8">
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
} 