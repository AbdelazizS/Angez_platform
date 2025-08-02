import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

function Breadcrumbs({ breadcrumbs }) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbs.map((crumb, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <ChevronDown className="h-4 w-4 rotate-[-90deg]" />}
          {crumb.href ? (
            <Link 
              href={crumb.href} 
              className="hover:text-foreground transition-colors font-medium"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-semibold">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumbs; 