import { useState, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Grid, List, ArrowRight, X, Clock, CheckCircle, 
  TrendingUp, Award, Eye, Briefcase, MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger 
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Pagination, PaginationContent, PaginationItem, PaginationLink, 
  PaginationNext, PaginationPrevious, PaginationEllipsis 
} from "@/components/ui/pagination";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import Navbar from "@/Components/Home/Navbar";
import Footer from "@/Components/Home/Footer";

export default function ServicesIndex({
  services,
  categories = [],
  subcategories = [],
  filters,
  auth,
  searchQuery: initialSearchQuery = "",
  selectedCategory: initialCategory = "all",
  selectedSubcategory: initialSubcategory = "all",
  selectedPriceRange: initialPriceRange = "any",
  selectedDeliveryTime: initialDeliveryTime = "any",
  selectedRating: initialRating = "any",
  sortBy: initialSortBy = "popular",
  viewMode: initialViewMode = "grid",
  currentPage: initialPage = 1,
}) {

    console.log(services.data.map((a)=>a));
    
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState(initialPriceRange);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(initialDeliveryTime);
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef(null);

  const performSearch = (page = 1) => {
    setIsLoading(true);
    router.get(route('services.index'), {
      search: searchQuery,
      page,
    //   category: selectedCategory,
    //   subcategory: selectedSubcategory,
    //   priceRange: selectedPriceRange,
    //   deliveryTime: selectedDeliveryTime,
    //   rating: selectedRating,
    //   sortBy,
    //   viewMode,
    }, {
      preserveState: true,
      onFinish: () => {
        setIsLoading(false);
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const handleSearchClick = () => {
    performSearch(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleFilterChange = () => {
    performSearch(1);
  };

 const clearFilters = () => {
    setSearchQuery("");
    performSearch(1);
};
 

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-SD", {
      style: "currency",
      currency: "SDG",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getServiceContent = (service) => {
    const lang = i18n.language;
    return {
      title: lang === 'ar' && service.title_ar ? service.title_ar : service.title,
      description: lang === 'ar' && service.description_ar ? service.description_ar : service.description,
      category: lang === 'ar' && service.category_ar ? service.category_ar : service.category,
      subcategory: lang === 'ar' && service.subcategory_ar ? service.subcategory_ar : service.subcategory,
      deliveryTime: lang === 'ar' && service.delivery_time_ar ? service.delivery_time_ar : service.delivery_time,
      tags: lang === 'ar' && service.tags_ar ? service.tags_ar : service.tags || [],
    };
  };

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
      <Head title={t('services.pageTitle')} />
      <Navbar auth={auth} />

      <section className="bg-muted/50 pt-24 pb-16 rtl">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              {t('services.heroTitle')}
              <span className="text-primary"> {t('services.heroHighlight')}</span>
            </h1>
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-card rounded-full shadow-lg border border-border">
                <Search className="absolute start-4 h-5 w-5 text-muted-foreground " />
                <Input
                  type="text"
                  placeholder={t('services.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-0 focus-visible:ring-0 p-12 pe-24 py-6 text-lg"
                />
                <Button 
                  onClick={handleSearchClick}
                  className="absolute end-2 bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2"
                >
                  {t('services.search')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={resultsRef} className="py-12 bg-background rtl">
        <div className="container mx-auto px-4">
       <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
            {/* <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {t('services.filters')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[90vw] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>{t('services.filters')}</SheetTitle>
                    <SheetDescription>
                      {t('services.filtersDescription')}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('services.category')}
                      </label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => {
                          setSelectedCategory(value);
                          handleFilterChange();
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('services.allCategories')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('services.allCategories')}</SelectItem>
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
                        {t('services.subcategory')}
                      </label>
                      <Select
                        value={selectedSubcategory}
                        onValueChange={(value) => {
                          setSelectedSubcategory(value);
                          handleFilterChange();
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('services.allSubcategories')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('services.allSubcategories')}</SelectItem>
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
                        {t('services.priceRange')}
                      </label>
                      <Select
                        value={selectedPriceRange}
                        onValueChange={(value) => {
                          setSelectedPriceRange(value);
                          handleFilterChange();
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('services.anyPrice')} />
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
                    <Button onClick={clearFilters} variant="outline" className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      {t('services.clearFilters')}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div> */}
            <div className="flex items-center gap-4">
              {/* <Select 
                value={sortBy} 
                onValueChange={(value) => {
                  setSortBy(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('services.sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">{t('services.mostPopular')}</SelectItem>
                  <SelectItem value="rating">{t('services.highestRated')}</SelectItem>
                  <SelectItem value="price-low">{t('services.priceLowToHigh')}</SelectItem>
                  <SelectItem value="price-high">{t('services.priceHighToLow')}</SelectItem>
                </SelectContent>
              </Select> */}
              <div className="flex border border-border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-e-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-s-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div> 

          <div className="mb-6">
            <p className="text-muted-foreground">
              {t('services.showing')} {services?.data?.length} {t('services.results')}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {services.data.length > 0 ? (
                  services.data.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      formatPrice={formatPrice}
                      getServiceContent={getServiceContent}
                      t={t}
                    />
                  ))
                ) : (
                  <EmptyState clearFilters={clearFilters} t={t} />
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
                {services.data.length > 0 ? (
                  services.data.map((service) => (
                    <ServiceListCard
                      key={service.id}
                      service={service}
                      formatPrice={formatPrice}
                      getServiceContent={getServiceContent}
                      t={t}
                    />
                  ))
                ) : (
                  <EmptyState clearFilters={clearFilters} t={t} />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {services.last_page > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (services.current_page > 1) {
                          performSearch(services.current_page - 1);
                        }
                      }}
                      className={services.current_page === 1 ? "opacity-50 pointer-events-none" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: services.last_page }, (_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === services.last_page ||
                      (page >= services.current_page - 2 && page <= services.current_page + 2)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              performSearch(page);
                            }}
                            isActive={page === services.current_page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    if (
                      (i === 1 && services.current_page > 4) ||
                      (i === services.last_page - 2 && services.current_page < services.last_page - 3)
                    ) {
                      return <PaginationEllipsis key={`ellipsis-${i}`} />;
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (services.current_page < services.last_page) {
                          performSearch(services.current_page + 1);
                        }
                      }}
                      className={services.current_page === services.last_page ? "opacity-50 pointer-events-none" : ""}
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

function ServiceCard({ service, formatPrice, getServiceContent, t }) {
  const content = getServiceContent(service);
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border h-full flex flex-col">
      <CardHeader className="p-0 relative">
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
        <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {content.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2 mb-4">
          {content.description}
        </CardDescription>

        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={service.user?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-background via-primary/5 to-primary/10">
                {service.user?.name ? service.user.name[0] : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {service.user?.name || t("services.unknownFreelancer")}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Briefcase className="w-3 h-3" />
                <span className="truncate">
                  {service.user?.freelancer_profile?.title || t("services.titleUnknown")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>
                {service.user?.freelancer_profile?.completed_orders || 0} {t("services.orders")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-primary">
              {formatPrice(service.price)}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{content.deliveryTime}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t border-border">
        <Button className="w-full" asChild>
          <Link href={`/services/${service.id}`}>
            {t("services.viewDetails")}
            <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ServiceListCard({ service, formatPrice, getServiceContent, t }) {
  const content = getServiceContent(service);
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  {content.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mb-4">
                  {content.description}
                </CardDescription>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={service.user?.avatar} />
                    <AvatarFallback>
                      {service.user?.name ? service.user.name[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">
                        {service.user?.name || t("services.unknownFreelancer")}
                      </p>
                      {service.user?.freelancer_profile?.is_verified && (
                        <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                          {t("services.verified")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">
                        {service.user?.freelancer_profile?.location || t("services.locationUnknown")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(service.price)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("services.deliveryIn")} {content.deliveryTime}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>
                  {service.user?.freelancer_profile?.completed_orders || 0} {t("services.ordersCompleted")}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {t("freelancerProfile.hero.responseTime")} {service.user?.freelancer_profile?.response_time || t("services.unknown")}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/services/${service.id}`}>
                  {t("services.viewDetails")}
                  <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/freelancers/${service.user?.id || "unknown"}`}>
                  <Eye className="w-4 h-4 me-2" />
                  {t("services.viewProfile")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceCardSkeleton() {
  return (
    <Card className="border-border h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="mt-auto space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-border">
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
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
        {t('services.noServicesFound')}
      </h3>
      <p className="text-muted-foreground mb-6">
        {t("services.tryAdjusting")}
      </p>
      {/* <Button onClick={clearFilters} variant="outline">
        {t('common.clear')}
      </Button> */}
    </motion.div>
  );
}