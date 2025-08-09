import { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Grid,
    List,
    Star,
    Users,
    TrendingUp,
    ArrowRight,
    X,
    MapPin,
    Clock,
    CheckCircle,
    Award,
    Eye,
    Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import SearchBar from '@/components/SearchBar';
import Navbar from '@/components/Home/Navbar';
import Footer from '@/components/Home/Footer';

export default function ServicesIndex({ 
    services, 
    categories, 
    subcategories, 
    filters,
    pagination 
}) {
    const [viewMode, setViewMode] = useState('grid');
    const [isLoading, setIsLoading] = useState(false);
    const resultsRef = useRef(null);

    // Handle search
    const handleSearch = (query) => {
        setIsLoading(true);
        router.get(route('search'), { 
            ...filters, 
            query,
            page: 1 // Reset to first page on new search
        }, {
            preserveState: true,
            onFinish: () => {
                setIsLoading(false);
                resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    };

    // Handle filter changes
    const handleFilterChange = (filter, value) => {
        setIsLoading(true);
        router.get(route('search'), { 
            ...filters, 
            [filter]: value,
            page: 1 // Reset to first page on filter change
        }, {
            preserveState: true,
            onFinish: () => {
                setIsLoading(false);
                resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    };

    // Handle pagination
    const handlePageChange = (page) => {
        if (page === pagination.currentPage) return;
        
        setIsLoading(true);
        router.get(route('search'), { 
            ...filters, 
            page 
        }, {
            preserveState: true,
            onFinish: () => {
                setIsLoading(false);
                resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setIsLoading(true);
        router.get(route('search'), {
            query: '',
            category: 'all',
            subcategory: 'all',
            priceRange: 'any',
            deliveryTime: 'any',
            rating: 'any',
            sortBy: 'relevance',
            page: 1
        }, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    // Format price with SDG currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ar-SD', {
            style: 'currency',
            currency: 'SDG',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Skeleton loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(12)].map((_, i) => (
                        <ServiceCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Search Services" />
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative bg-background pt-24 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-6"
                    >
                        Find the Perfect <span className="text-primary">Freelance Service</span>
                    </motion.h1>
                    
                    <SearchBar 
                        initialQuery={filters.query} 
                        onSearch={handleSearch} 
                    />
                </div>
            </section>

            {/* Results Section */}
            <section ref={resultsRef} className="py-12 bg-background">
                <div className="container mx-auto px-4">
                    {/* Filters and Results Count */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="flex items-center gap-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[90vw] sm:w-[400px]">
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                        <SheetDescription>
                                            Refine your search results
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        {/* Filter options would go here */}
                                    </div>
                                </SheetContent>
                            </Sheet>
                            
                            <p className="text-muted-foreground">
                                Showing {pagination.total} results
                                {filters.query && ` for "${filters.query}"`}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Select
                                value={filters.sortBy}
                                onValueChange={(value) => handleFilterChange('sortBy', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">Relevance</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="orders">Most Orders</SelectItem>
                                    <SelectItem value="delivery">Fastest Delivery</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <div className="flex border rounded-lg">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('grid')}
                                    className="rounded-r-none"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('list')}
                                    className="rounded-l-none"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Services Grid */}
                    <AnimatePresence mode="wait">
                        {viewMode === 'grid' ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {services.length > 0 ? (
                                    services.map((service) => (
                                        <ServiceCard 
                                            key={service.id} 
                                            service={service} 
                                            formatPrice={formatPrice}
                                        />
                                    ))
                                ) : (
                                    <EmptyState clearFilters={clearFilters} />
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {services.length > 0 ? (
                                    services.map((service) => (
                                        <ServiceListCard 
                                            key={service.id} 
                                            service={service} 
                                            formatPrice={formatPrice}
                                        />
                                    ))
                                ) : (
                                    <EmptyState clearFilters={clearFilters} />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Pagination */}
                    {pagination.lastPage > 1 && (
                        <div className="mt-10 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (pagination.currentPage > 1) {
                                                    handlePageChange(pagination.currentPage - 1);
                                                }
                                            }}
                                            className={pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                                        />
                                    </PaginationItem>
                                    
                                    {[...Array(pagination.lastPage)].map((_, i) => {
                                        const page = i + 1;
                                        // Show limited pages with ellipsis
                                        if (
                                            page === 1 || 
                                            page === pagination.lastPage ||
                                            Math.abs(page - pagination.currentPage) <= 2
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePageChange(page);
                                                        }}
                                                        isActive={page === pagination.currentPage}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}
                                    
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (pagination.currentPage < pagination.lastPage) {
                                                    handlePageChange(pagination.currentPage + 1);
                                                }
                                            }}
                                            className={pagination.currentPage === pagination.lastPage ? 'opacity-50 cursor-not-allowed' : ''}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </section>
            
            <Footer />
        </>
    );
}

// Skeleton Loading Component
function ServiceCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0 pb-4">
                <Skeleton className="h-48 w-full rounded-t-lg" />
            </CardHeader>
            <CardContent className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center space-x-4 pt-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-3 w-[80px]" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[80px]" />
            </CardFooter>
        </Card>
    );
}

// Empty State Component
function EmptyState({ clearFilters }) {
    return (
        <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
            </p>
            <Button onClick={clearFilters} variant="outline">
                Clear Filters
            </Button>
        </div>
    );
}