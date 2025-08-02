import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Pagination({ links = [], className = '' }) {
    const { t, i18n } = useTranslation();
    
    // Filter out null URLs and empty labels
    const filteredLinks = links.filter(link => link.url !== null && link.label.trim() !== '');

    if (filteredLinks.length <= 1) return null;

    // Extract navigation links
    const previousLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    return (
        <nav 
            className={`flex items-center justify-between ${className}`}
            dir={i18n.dir()}
            aria-label={t('common.pagination.navigation')}
        >
            {/* Previous Page Link */}
            <div className="flex-1 flex justify-start">
                {previousLink.url && (
                    <Link
                        href={previousLink.url}
                        preserveScroll
                        preserveState
                        className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                            previousLink.url 
                                ? 'text-foreground bg-card hover:bg-muted border-border' 
                                : 'text-muted-foreground bg-muted cursor-not-allowed'
                        }`}
                        aria-label={t('common.pagination.previous')}
                        disabled={!previousLink.url}
                    >
                        {i18n.dir() === 'rtl' ? (
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        )}
                        <span className="mx-1">{t('common.pagination.previous')}</span>
                    </Link>
                )}
            </div>

            {/* Page Numbers */}
            <div className="hidden md:flex items-center gap-1">
                {pageLinks.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={`px-4 py-2 border text-sm font-medium rounded-md ${
                            link.active
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-card text-foreground border-border hover:bg-muted'
                        }`}
                        aria-current={link.active ? 'page' : undefined}
                    >
                        {link.label.replace(/&[^;]+;/g, '')}
                    </Link>
                ))}
            </div>

            {/* Next Page Link */}
            <div className="flex-1 flex justify-end">
                {nextLink.url && (
                    <Link
                        href={nextLink.url}
                        preserveScroll
                        preserveState
                        className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                            nextLink.url 
                                ? 'text-foreground bg-card hover:bg-muted border-border' 
                                : 'text-muted-foreground bg-muted cursor-not-allowed'
                        }`}
                        aria-label={t('common.pagination.next')}
                        disabled={!nextLink.url}
                    >
                        <span className="mx-1">{t('common.pagination.next')}</span>
                        {i18n.dir() === 'rtl' ? (
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        )}
                    </Link>
                )}
            </div>
        </nav>
    );
}