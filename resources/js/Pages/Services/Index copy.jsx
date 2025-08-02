import { useState, useMemo, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
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
import { useServiceLanguageFallback } from "@/lib/useLanguageFallback";
import Navbar from "@/Components/Home/Navbar";
import Footer from "@/Components/Home/Footer";

export default function ServicesIndex({
    services = [],
    categories = [],
    subcategories = [],
    filters = {
    priceRange: [],
    deliveryTime: [],
        rating: [],
    },
    auth,
}) {
    const { t, i18n } = useTranslation();
    const { isRTL } = useLanguageChange();
    const currentLang = i18n.language;

    // State management
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [selectedPriceRange, setSelectedPriceRange] = useState("any");
    const [selectedDeliveryTime, setSelectedDeliveryTime] = useState("any");
    const [selectedRating, setSelectedRating] = useState("any");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("popular");
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 12;
    const [isLoading, setIsLoading] = useState(false);
    const listRef = useRef(null);
    const resultsRef = useRef(null); // New ref for results section

    // Scroll to top of results section on page change
    useEffect(() => {
        if (isLoading && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [isLoading]);

    // Helper function to get service content based on language
    const getServiceContent = (service, language = currentLang) => {
        if (language === "ar") {
            return {
                title: service.title_ar || service.title,
                description: service.description_ar || service.description,
                category: service.category_ar || service.category,
                subcategory: service.subcategory_ar || service.subcategory,
                deliveryTime: service.delivery_time_ar || service.delivery_time,
                tags: service.tags_ar || service.tags || [],
                features: service.features_ar || service.features || [],
            };
        }
        
        return {
            title: service.title,
            description: service.description,
            category: service.category,
            subcategory: service.subcategory,
            deliveryTime: service.delivery_time,
            tags: service.tags || [],
            features: service.features || [],
        };
    };

    // Filter and search logic
    const filteredServices = useMemo(() => {
        let filtered = [...services];

        if (searchQuery) {
            filtered = filtered.filter((service) => {
                const serviceContent = getServiceContent(service, currentLang);
                return (
                    serviceContent.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    serviceContent.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    (service.freelancer?.name || "")
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    serviceContent.tags.some((tag) =>
                        tag.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                );
            });
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter((service) => {
                const serviceContent = getServiceContent(service, currentLang);
                return serviceContent.category === selectedCategory;
            });
        }

        if (selectedSubcategory !== "all") {
            filtered = filtered.filter((service) => {
                const serviceContent = getServiceContent(service, currentLang);
                return serviceContent.subcategory === selectedSubcategory;
            });
        }

        if (selectedPriceRange !== "any") {
            const [min, max] = selectedPriceRange.split("-").map(Number);
            filtered = filtered.filter((service) => {
                if (max) {
                    return service.price >= min && service.price <= max;
                } else {
                    return service.price >= min;
                }
            });
        }

        if (selectedDeliveryTime !== "any") {
            const [min, max] = selectedDeliveryTime.split("-").map(Number);
            filtered = filtered.filter((service) => {
                const serviceContent = getServiceContent(service, currentLang);
                const serviceDays = parseInt(
                    serviceContent.deliveryTime.split(" ")[0]
                );
                if (max) {
                    return serviceDays >= min && serviceDays <= max;
                } else {
                    return serviceDays >= min;
                }
            });
        }

        if (selectedRating !== "any") {
            filtered = filtered.filter(
                (service) =>
                    (service.freelancer?.rating || 0) >=
                    parseFloat(selectedRating)
            );
        }

        switch (sortBy) {
            case "rating":
                filtered.sort(
                    (a, b) =>
                        (b.freelancer?.rating || 0) -
                        (a.freelancer?.rating || 0)
                );
                break;
            case "price-low":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "delivery-fast":
                filtered.sort((a, b) => {
                    const aContent = getServiceContent(a, currentLang);
                    const bContent = getServiceContent(b, currentLang);
                    return (
                        parseInt(aContent.deliveryTime.split(" ")[0]) -
                        parseInt(bContent.deliveryTime.split(" ")[0])
                    );
                });
                break;
            case "popular":
            default:
                filtered.sort(
                    (a, b) =>
                        (b.freelancer?.completedOrders || 0) -
                        (a.freelancer?.completedOrders || 0)
                );
                break;
        }

        return filtered;
    }, [
        services,
        searchQuery,
        selectedCategory,
        selectedSubcategory,
        selectedPriceRange,
        selectedDeliveryTime,
        selectedRating,
        sortBy,
        currentLang,
    ]);

    // Pagination logic
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(
        indexOfFirstService,
        indexOfLastService
    );

    console.log(currentServices);
    
    const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber === currentPage) return;
        setIsLoading(true);
        setTimeout(() => {
            setCurrentPage(pageNumber);
            setIsLoading(false);
            // Always scroll to top of results section
            if (resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 500); // Simulate loading, replace with real async if needed
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedSubcategory("all");
        setSelectedPriceRange("any");
        setSelectedDeliveryTime("any");
        setSelectedRating("any");
        setSortBy("popular");
        setCurrentPage(1);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("ar-SD", {
            style: "currency",
            currency: "SDG",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
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
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`bg-transparent text-lg placeholder-muted-foreground p-0 w-full h-full min-h-[40px] px-4 ${isRTL ? 'placeholder:text-right' : 'placeholder:text-left'} focus:outline-none focus:ring-0 focus:border-0 border-0 shadow-none`}
                                />
                                    </div>
                                    {/* <Button
                                        type="submit"
                                        className="bg-primary/80 hover:bg-primary text-white rounded-full px-6 py-2 transition-all duration-300 font-medium text-sm m-4"
                                    >
                                        {t('services.search', 'Search')}
                                    </Button> */}
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
                                                    onValueChange={(value) => {
                                                        setSelectedCategory(value);
                                                        setCurrentPage(1);
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('services.allCategories', 'All Categories')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('services.allCategories', 'All Categories')}
                                                        </SelectItem>
                                                        {categories.map((category) => (
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
                                                    onValueChange={(value) => {
                                                        setSelectedSubcategory(value);
                                                        setCurrentPage(1);
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('services.allSubcategories', 'All Subcategories')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            {t('services.allSubcategories', 'All Subcategories')}
                                                        </SelectItem>
                                                        {subcategories.map((subcategory) => (
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
                                                    onValueChange={(value) => {
                                                        setSelectedPriceRange(value);
                                                        setCurrentPage(1);
                                                    }}
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
                                                    onValueChange={(value) => {
                                                        setSelectedDeliveryTime(value);
                                                        setCurrentPage(1);
                                                    }}
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
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            {/* Desktop Filters */}
                            <div className="hidden lg:flex items-center gap-4">
                                <Select
                                    value={selectedCategory}
                                    onValueChange={(value) => {
                                        setSelectedCategory(value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={t('services.category', 'Category')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('services.allCategories', 'All Categories')}
                                        </SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedSubcategory}
                                    onValueChange={(value) => {
                                        setSelectedSubcategory(value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={t('services.subcategory', 'Subcategory')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('services.allSubcategories', 'All Subcategories')}
                                        </SelectItem>
                                        {subcategories.map((subcategory) => (
                                            <SelectItem key={subcategory} value={subcategory}>
                                                {subcategory}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedPriceRange}
                                    onValueChange={(value) => {
                                        setSelectedPriceRange(value);
                                        setCurrentPage(1);
                                    }}
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
                                    onValueChange={(value) => {
                                        setSelectedDeliveryTime(value);
                                        setCurrentPage(1);
                                    }}
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
                                onValueChange={(value) => {
                                    setSortBy(value);
                                    setCurrentPage(1);
                                }}
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
            <section ref={resultsRef} className="py-12 bg-background ">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Results count */}
                    <div className="mb-8">
                        <p className="text-muted-foreground">
                            {t('services.showing', 'Showing')} {filteredServices.length} {t('services.results', 'results')}
                        </p>
                    </div>

                    {/* Services Grid/List */}
                    <AnimatePresence mode="wait">
                        {viewMode === "grid" ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rtl"
                            >
                                {currentServices.length > 0 ? (
                                    currentServices.map((service, index) => (
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
                                                getServiceContent={
                                                    getServiceContent
                                                }
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
                                {currentServices.length > 0 ? (
                                    currentServices.map((service, index) => (
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
                                                getServiceContent={
                                                    getServiceContent
                                                }
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
                    {totalPages > 1 && (
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
                                                    if (currentPage > 1) paginate(currentPage - 1);
                                                }}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage < totalPages) paginate(currentPage + 1);
                                                }}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
                                                    if (currentPage > 1) paginate(currentPage - 1);
                                                }}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                        {Array.from({ length: totalPages }, (_, i) => {
                                            if (
                                                i === 0 ||
                                                i === totalPages - 1 ||
                                                (i >= currentPage - 2 && i <= currentPage + 2)
                                            ) {
                                                return (
                                                    <PaginationItem key={i + 1}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                paginate(i + 1);
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
                                                (i === totalPages - 2 && currentPage < totalPages - 3)
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
                                                    if (currentPage < totalPages) paginate(currentPage + 1);
                                                }}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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

    
    console.log(serviceContent);
    
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border h-full flex flex-col rtl">
            <CardHeader className="p-0 relative">
                {/* Service Image */}

                {/* Badges */}
                <div className="p-2 top-3 left-3 flex gap-2">
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
                        {/* <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>
                                {service.freelancer?.rating?.toFixed(1) ||
                                    "0.0"}
                            </span>
                            <span className="text-muted-foreground">
                                ({service.freelancer?.totalReviews || 0})
                            </span>
                        </div> */}
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
                            <span>{serviceContent.deliveryTime}</span>
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
                    {/* Service Image */}

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
                                            {service.freelancer
                                                ?.verificationStatus ===
                                                "verified" && (
                                                <Badge
                                                    variant="secondary"
                                                    className="px-1.5 py-0.5 text-xs"
                                                >
                                                    {t(
                                                        "services.verified",
                                                        "Verified"
                                                    )}
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
                                    {serviceContent.deliveryTime}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                            {/* <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>
                                    {service.freelancer?.rating?.toFixed(1) ||
                                        "0.0"}
                                </span>
                                <span className="text-muted-foreground">
                                    ({service.freelancer?.totalReviews || 0}{" "}
                                    {t("services.reviews", "reviews")})
                                </span>
                            </div> */}

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
