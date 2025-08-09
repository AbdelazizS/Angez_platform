import { useState, useEffect, useMemo, useRef } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";
import { useLanguageChange } from "@/lib/useLanguageChange";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import debounce from 'lodash/debounce';

export default function ServicesIndex({ 
    services = [], 
    filters,
    meta,
    search,
    auth 
}) {
    const { t, i18n } = useTranslation();
    const { isRTL } = useLanguageChange();
    const currentLang = i18n.language;

    console.log(filters);
    
    
    // State from props
    const [searchQuery, setSearchQuery] = useState(search?.query || '');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSubcategory, setSelectedSubcategory] = useState('all');
    const [selectedPriceRange, setSelectedPriceRange] = useState('any');
    const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('any');
    const [selectedRating, setSelectedRating] = useState('any');
    const [sortBy, setSortBy] = useState('popular');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);
    
    // Track loading state
    const [isLoading, setIsLoading] = useState(false);
    const resultsRef = useRef(null);

    // Debounced search function
    const debouncedSearch = useMemo(() => debounce((query) => {
        router.get(route('services.index'), {
            query: query,
            lang: currentLang,
            page: 1, // Reset to first page on new search
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            subcategory: selectedSubcategory !== 'all' ? selectedSubcategory : undefined,
            priceRange: selectedPriceRange !== 'any' ? selectedPriceRange : undefined,
            deliveryTime: selectedDeliveryTime !== 'any' ? selectedDeliveryTime : undefined,
            rating: selectedRating !== 'any' ? selectedRating : undefined,
            sortBy,
        }, {
            preserveState: true,
            replace: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
        });
    }, 500), [currentLang, selectedCategory, selectedSubcategory, selectedPriceRange, selectedDeliveryTime, selectedRating, sortBy]);

    // Handle search input changes
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Handle filter changes
    const handleFilterChange = (filter, value) => {
        switch (filter) {
            case 'category':
                setSelectedCategory(value);
                break;
            case 'subcategory':
                setSelectedSubcategory(value);
                break;
            case 'priceRange':
                setSelectedPriceRange(value);
                break;
            case 'deliveryTime':
                setSelectedDeliveryTime(value);
                break;
            case 'rating':
                setSelectedRating(value);
                break;
            case 'sortBy':
                setSortBy(value);
                break;
            default:
                break;
        }

        // Trigger new search with updated filters
        router.get(route('services.index'), {
            query: searchQuery,
            lang: currentLang,
            page: 1, // Reset to first page on filter change
            category: filter === 'category' ? (value !== 'all' ? value : undefined) : (selectedCategory !== 'all' ? selectedCategory : undefined),
            subcategory: filter === 'subcategory' ? (value !== 'all' ? value : undefined) : (selectedSubcategory !== 'all' ? selectedSubcategory : undefined),
            priceRange: filter === 'priceRange' ? (value !== 'any' ? value : undefined) : (selectedPriceRange !== 'any' ? selectedPriceRange : undefined),
            deliveryTime: filter === 'deliveryTime' ? (value !== 'any' ? value : undefined) : (selectedDeliveryTime !== 'any' ? selectedDeliveryTime : undefined),
            rating: filter === 'rating' ? (value !== 'any' ? value : undefined) : (selectedRating !== 'any' ? selectedRating : undefined),
            sortBy: filter === 'sortBy' ? value : sortBy,
        }, {
            preserveState: true,
            replace: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
        });
    };

    // Handle page changes
    const handlePageChange = (page) => {
        if (page === currentPage) return;
        
        setIsLoading(true);
        router.get(route('services.index'), {
            query: searchQuery,
            lang: currentLang,
            page,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            subcategory: selectedSubcategory !== 'all' ? selectedSubcategory : undefined,
            priceRange: selectedPriceRange !== 'any' ? selectedPriceRange : undefined,
            deliveryTime: selectedDeliveryTime !== 'any' ? selectedDeliveryTime : undefined,
            rating: selectedRating !== 'any' ? selectedRating : undefined,
            sortBy,
        }, {
            preserveState: true,
            onFinish: () => {
                setIsLoading(false);
                if (resultsRef.current) {
                    resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            },
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedSubcategory('all');
        setSelectedPriceRange('any');
        setSelectedDeliveryTime('any');
        setSelectedRating('any');
        setSortBy('popular');
        
        router.get(route('services.index'), {
            query: '',
            lang: currentLang,
            page: 1,
        }, {
            preserveState: true,
            replace: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
        });
    };

    // Format price with currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat(currentLang === 'ar' ? 'ar-SD' : 'en-US', {
            style: 'currency',
            currency: 'SDG',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Get service content based on language
    const getServiceContent = (service, language = currentLang) => {
        if (language === 'ar') {
            return {
                title: service.title_ar || service.title,
                description: service.description_ar || service.description,
                detailed_description: service.detailed_description_ar || service.detailed_description,
                category: service.category_ar || service.category,
                subcategory: service.subcategory_ar || service.subcategory,
                delivery_time: service.delivery_time_ar || service.delivery_time,
                tags: service.tags_ar || service.tags || [],
                features: service.features_ar || service.features || [],
            };
        }
        
        return {
            title: service.title,
            description: service.description,
            detailed_description: service.detailed_description,
            category: service.category,
            subcategory: service.subcategory,
            delivery_time: service.delivery_time,
            tags: service.tags || [],
            features: service.features || [],
        };
    };

    return (
        <>
            <Head title={t('services.pageTitle', 'Services - Anjez Platform')} />
            <Navbar auth={auth} />

            {/* Hero Section */}
            <section className="relative bg-background pt-24 pb-16 rtl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
                        >
                            {t('services.heroTitle', 'Find the Perfect')}
                            <br />
                            <span className="text-primary">
                                {t('services.heroHighlight', 'Freelance Service')}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xl text-muted-foreground mb-8"
                        >
                            {t('services.heroSubtitle', 'Browse professional services from verified freelancers. Get your project done with quality and reliability.')}
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative max-w-2xl mx-auto"
                        >
                            <div className="relative group">
                                <div className="relative flex items-center bg-card rounded-full shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                                    <div className="absolute start-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                                        <Search className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 px-12 py-4 min-h-[60px] flex items-center">
                                        <Input
                                            type="text"
                                            dir={isRTL ? "rtl" : "ltr"}
                                            placeholder={t('services.searchPlaceholder', 'Search for services, freelancers, or skills...')}
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className={`bg-transparent text-lg placeholder-muted-foreground p-0 w-full h-full min-h-[40px] px-4 ${isRTL ? 'placeholder:text-right' : 'placeholder:text-left'} focus:outline-none focus:ring-0 focus:border-0 border-0 shadow-none`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Filters and Controls */}
            <section className="bg-card border-b border-border sticky top-0 z-10 shadow-sm rtl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left side - Filters */}
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Mobile Filter Button */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="lg:hidden gap-2"
                                    >
                                        <Filter className="h-4 w-4" />
                                        {t('services.filters', 'Filters')}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side={isRTL ? 'right' : 'left'}
                                    className="w-[90vw] sm:w-[400px]"
                                >
                                    <SheetHeader>
                                        <SheetTitle>
                                            {t('services.filters', 'Filters')}
                                        </SheetTitle>
                                        <SheetDescription>
                                            {t('services.filtersDescription', 'Refine your search results')}
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    {t('services.category', 'Category')}
                                                </label>
                                                <Select
                                                    value={selectedCategory}
                                                    onValueChange={(value) => handleFilterChange('category', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('services.allCategories', 'All Categories')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('services.allCategories', 'All Categories')}
                                                        </SelectItem>
                                                        {filters.categories.map((category) => (
                                                            <SelectItem key={category} value={category}>
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    {t('services.subcategory', 'Subcategory')}
                                                </label>
                                                <Select
                                                    value={selectedSubcategory}
                                                    onValueChange={(value) => handleFilterChange('subcategory', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('services.allSubcategories', 'All Subcategories')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('services.allSubcategories', 'All Subcategories')}
                                                        </SelectItem>
                                                        {filters.subcategories.map((subcategory) => (
                                                            <SelectItem key={subcategory} value={subcategory}>
                                                                {subcategory}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    {t('services.priceRange', 'Price Range')}
                                                </label>
                                                <Select
                                                    value={selectedPriceRange}
                                                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('services.anyPrice', 'Any Price')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {filters.priceRange.map((range) => (
                                                            <SelectItem key={range.value} value={range.value}>
                                                                {range.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    {t('services.deliveryTime', 'Delivery Time')}
                                                </label>
                                                <Select
                                                    value={selectedDeliveryTime}
                                                    onValueChange={(value) => handleFilterChange('deliveryTime', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('services.anyTime', 'Any Time')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {filters.deliveryTime.map((time) => (
                                                            <SelectItem key={time.value} value={time.value}>
                                                                {time.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    {t('services.rating', 'Rating')}
                                                </label>
                                                <Select
                                                    value={selectedRating}
                                                    onValueChange={(value) => handleFilterChange('rating', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('services.anyRating', 'Any Rating')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {filters.rating.map((rating) => (
                                                            <SelectItem key={rating.value} value={rating.value}>
                                                                {rating.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            {/* Desktop Filters */}
                            <div className="hidden lg:flex items-center gap-4">
                                <Select
                                    value={selectedCategory}
                                    onValueChange={(value) => handleFilterChange('category', value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={t('services.category', 'Category')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('services.allCategories', 'All Categories')}
                                        </SelectItem>
                                        {filters.categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedSubcategory}
                                    onValueChange={(value) => handleFilterChange('subcategory', value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={t('services.subcategory', 'Subcategory')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('services.allSubcategories', 'All Subcategories')}
                                        </SelectItem>
                                        {filters.subcategories.map((subcategory) => (
                                            <SelectItem key={subcategory} value={subcategory}>
                                                {subcategory}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedPriceRange}
                                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={t('services.priceRange', 'Price Range')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filters.priceRange.map((range) => (
                                            <SelectItem key={range.value} value={range.value}>
                                                {range.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedDeliveryTime}
                                    onValueChange={(value) => handleFilterChange('deliveryTime', value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={t('services.deliveryTime', 'Delivery Time')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filters.deliveryTime.map((time) => (
                                            <SelectItem key={time.value} value={time.value}>
                                                {time.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4 me-1" />
                                    {t('services.clearFilters', 'Clear')}
                                </Button>
                            </div>
                        </div>
                        {/* Right side - View controls and sort */}
                        <div className="flex items-center gap-4">
                            <Select
                                value={sortBy}
                                onValueChange={(value) => handleFilterChange('sortBy', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={t('services.sortBy', 'Sort by')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popular">{t('services.mostPopular', 'Most Popular')}</SelectItem>
                                    <SelectItem value="rating">{t('services.highestRated', 'Highest Rated')}</SelectItem>
                                    <SelectItem value="price-low">{t('services.priceLowToHigh', 'Price: Low to High')}</SelectItem>
                                    <SelectItem value="price-high">{t('services.priceHighToLow', 'Price: High to Low')}</SelectItem>
                                    <SelectItem value="delivery-fast">{t('services.fastestDelivery', 'Fastest Delivery')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center border border-border rounded-lg">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="rounded-e-none"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="rounded-s-none"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid/List */}
            <section ref={resultsRef} className="py-12 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Results count */}
                    <div className="mb-8">
                        <p className="text-muted-foreground">
                            {t('services.showing', 'Showing')} {meta.total} {t('services.results', 'results')}
                            {searchQuery && (
                                <span> {t('services.for', 'for')} "{searchQuery}"</span>
                            )}
                        </p>
                    </div>

                    {/* Services Grid/List */}
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <LoadingSkeleton viewMode={viewMode} />
                        ) : viewMode === "grid" ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rtl"
                            >
                                {services.length > 0 ? (
                                    services.map((service, index) => (
                                        <motion.div
                                            key={service.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.05,
                                            }}
                                        >
                                            <ServiceCard
                                                service={service}
                                                formatPrice={formatPrice}
                                                getServiceContent={getServiceContent}
                                                currentLang={currentLang}
                                                t={t}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <EmptyState
                                        clearFilters={clearFilters}
                                        t={t}
                                    />
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
                                    services.map((service, index) => (
                                        <motion.div
                                            key={service.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.05,
                                            }}
                                        >
                                            <ServiceListCard
                                                service={service}
                                                formatPrice={formatPrice}
                                                getServiceContent={getServiceContent}
                                                currentLang={currentLang}
                                                t={t}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <EmptyState
                                        clearFilters={clearFilters}
                                        t={t}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Pagination */}
                    {meta.last_page > 1 && (
                        <div className="flex justify-center mt-10">
                            <Pagination>
                                <PaginationContent>
                                    {/* Mobile: Only show prev/next */}
                                    <div className="flex sm:hidden w-full justify-between gap-2">
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                                }}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <span className="text-sm">
                                                {currentPage} / {meta.last_page}
                                            </span>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage < meta.last_page) handlePageChange(currentPage + 1);
                                                }}
                                                className={currentPage === meta.last_page ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                    </div>
                                    {/* Desktop: Full pagination */}
                                    <div className="hidden sm:flex items-center gap-1">
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                                }}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                        {Array.from({ length: meta.last_page }, (_, i) => {
                                            if (
                                                i === 0 ||
                                                i === meta.last_page - 1 ||
                                                (i >= currentPage - 2 && i <= currentPage + 2)
                                            ) {
                                                return (
                                                    <PaginationItem key={i + 1}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handlePageChange(i + 1);
                                                            }}
                                                            isActive={currentPage === i + 1}
                                                        >
                                                            {i + 1}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            }
                                            if (
                                                (i === 1 && currentPage > 4) ||
                                                (i === meta.last_page - 2 && currentPage < meta.last_page - 3)
                                            ) {
                                                return (
                                                    <PaginationItem key={`ellipsis-${i}`}>
                                                        <PaginationEllipsis />
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
                                                    if (currentPage < meta.last_page) handlePageChange(currentPage + 1);
                                                }}
                                                className={currentPage === meta.last_page ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                    </div>
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

function LoadingSkeleton({ viewMode }) {
    if (viewMode === 'grid') {
        return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="border-border">
                   
                        <CardContent className="p-4 space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="flex items-center gap-3 pt-4">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-[100px]" />
                                    <Skeleton className="h-3 w-[80px]" />
                                </div>
                            </div>
                            <div className="flex justify-between pt-4">
                                <Skeleton className="h-4 w-[80px]" />
                                <Skeleton className="h-4 w-[60px]" />
                            </div>
                        </CardContent>
                        <CardFooter className="p-4">
                            <Skeleton className="h-10 w-full rounded-md" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-border">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <div className="flex items-center gap-3 pt-2">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-[100px]" />
                                        <Skeleton className="h-3 w-[80px]" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <Skeleton key={i} className="h-6 w-[60px] rounded-full" />
                                    ))}
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Skeleton className="h-10 w-[120px] rounded-md" />
                                    <Skeleton className="h-10 w-[120px] rounded-md" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function EmptyState({ clearFilters, t }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 col-span-full"
        >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('services.noServicesFound', 'No services found')}
            </h3>
            <p className="text-muted-foreground mb-6">
                {t(
                    "services.tryAdjusting",
                    "Try adjusting your search criteria or filters"
                )}
            </p>
            <Button onClick={clearFilters} variant="outline">
                {t('common.clear', 'Clear Filters')}
            </Button>
        </motion.div>
    );
}

function ServiceCard({
    service,
    formatPrice,
    getServiceContent,
    currentLang,
    t,
}) {
    const serviceContent = getServiceContent(service, currentLang);
    
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border h-full flex flex-col rtl">
            <CardHeader className="p-0 relative">
                {/* Service Image */}
               

                {/* Badges */}
                <div className="pt-4 px-4 top-3 start-3 flex gap-2">
                    {service.is_popular && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20">
                            <TrendingUp className="w-3 h-3 me-1" />
                            {t('services.popular')}
                        </Badge>
                    )}
                    {service.is_featured && (
                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20">
                            <Award className="w-3 h-3 me-1" />
                            {t('services.featured')}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4 flex-1 flex flex-col">
                {/* Title and Description */}
                <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {serviceContent.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2 mb-4">
                    {serviceContent.description}
                </CardDescription>

                {/* Freelancer Info */}
                <div className="mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={service.freelancer?.avatar} />
                            <AvatarFallback>
                                {service.freelancer?.name
                                    ? service.freelancer.name
                                          .split(" ")
                                          .slice(0, 1)
                                          .map((n) => n[0])
                                          .join(" ")
                                    : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {service.freelancer?.name ||
                                    t("services.unknownFreelancer", "Unknown")}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Briefcase className="w-3 h-3" />
                                <span className="truncate">
                                    {service.freelancer?.title ||
                                        t(
                                            "services.titleUnknown",
                                            "Title unknown"
                                        )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{service.rating?.toFixed(1) || "0.0"}</span>
                            <span className="text-muted-foreground">
                                ({service.total_reviews || 0})
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>
                                {service.freelancer?.completedOrders || 0}{" "}
                                {t("services.orders", "orders")}
                            </span>
                        </div>
                    </div>

                    {/* Price and Delivery */}
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-primary">
                            {formatPrice(service.price)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{serviceContent.delivery_time}</span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 border-t border-border">
                <Button className="w-full" asChild>
                    <Link href={`/services/${service.id}`}>
                        {t("services.viewDetails", "View Details")}
                        <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

function ServiceListCard({
    service,
    formatPrice,
    getServiceContent,
    currentLang,
    t,
}) {
    const serviceContent = getServiceContent(service, currentLang);
    
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-border rtl">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                                {/* Title */}
                                <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                    {serviceContent.title}
                                </CardTitle>

                                {/* Description */}
                                <CardDescription className="line-clamp-2 mb-4">
                                    {serviceContent.description}
                                </CardDescription>

                                {/* Freelancer Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage
                                            src={service.freelancer?.avatar}
                                        />
                                        <AvatarFallback>
                                            {service.freelancer?.name
                                                ? service.freelancer.name
                                                      .split(" ")
                                                      .slice(0, 1)
                                                      .map((n) => n[0])
                                                      .join("")
                                                : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium truncate">
                                                {service.freelancer?.name ||
                                                    t(
                                                        "services.unknownFreelancer",
                                                        "Unknown"
                                                    )}
                                            </p>
                                            {service.freelancer?.verificationStatus === "verified" && (
                                                <Badge
                                                    variant="secondary"
                                                    className="px-1.5 py-0.5 text-xs"
                                                >
                                                    {t("services.verified", "Verified")}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate">
                                                {service.freelancer?.location ||
                                                    t(
                                                        "services.locationUnknown",
                                                        "Location unknown"
                                                    )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="sm:text-right">
                                <div className="text-2xl font-bold text-primary">
                                    {formatPrice(service.price)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {t("services.deliveryIn", "Delivery in")}{" "}
                                    {serviceContent.delivery_time}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>{service.rating?.toFixed(1) || "0.0"}</span>
                                <span className="text-muted-foreground">
                                    ({service.total_reviews || 0}{" "}
                                    {t("services.reviews", "reviews")})
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>
                                    {service.freelancer?.completedOrders || 0}{" "}
                                    {t(
                                        "services.ordersCompleted",
                                        "orders completed"
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {t("services.responseTime", "Response in")}{" "}
                                    {service.freelancer?.responseTime ||
                                        t("services.unknown", "Unknown")}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <span>
                                    {t("services.memberSince", "Member since")}{" "}
                                    {service.freelancer?.memberSince ||
                                        t("services.unknown", "Unknown")}
                                </span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {serviceContent.tags.slice(0, 6).map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {serviceContent.tags.length > 6 && (
                                <Badge variant="outline" className="text-xs">
                                    +{serviceContent.tags.length - 6}
                                </Badge>
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href={`/services/${service.id}`}>
                                    {t("services.viewDetails", "View Details")}
                                    <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link
                                    href={`/freelancers/${
                                        service.freelancer?.id || "unknown"
                                    }`}
                                >
                                    <Eye className="w-4 h-4 me-2" />
                                    {t("services.viewProfile", "View Profile")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}