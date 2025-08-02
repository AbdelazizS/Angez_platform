import { useState, useMemo, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    Clock,
    CheckCircle,
    Award,
    TrendingUp,
    MapPin,
    Users,
    Eye,
    MessageCircle,
    Heart,
    Share2,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Calendar,
    DollarSign,
    Shield,
    Zap,
    Globe,
    Mail,
    Phone,
    ExternalLink,
    User,
    BookOpen,
    Languages,
    GraduationCap,
    Clipboard,
    ClipboardCheck,
    Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useLanguageChange } from "@/lib/useLanguageChange";
import Navbar from "@/Components/Home/Navbar";
import Footer from "@/Components/Home/Footer";
import { Toaster, toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

function ShareButton({ url, label }) {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success(t("servicesShow.share.copied", "Link copied!"));
        setTimeout(() => setCopied(false), 1500);
        setMenuOpen(false);
    };

    return (
        <div className="relative inline-block">
            <Button
                variant="ghost"
                size="lg"
                aria-label={label}
                onClick={() => setMenuOpen((open) => !open)}
            >
                <Share2 className="w-4 h-4" />
            </Button>
            {menuOpen && (
                <div className="absolute z-50 mt-2 right-0 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[160px]">
                    <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded transition"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <ClipboardCheck className="w-4 h-4 text-success" />
                        ) : (
                            <Clipboard className="w-4 h-4" />
                        )}
                        {copied
                            ? t("servicesShow.share.copied", "Copied!")
                            : t("servicesShow.share.copyLink", "Copy Link")}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ServicesShow({
    service,
    isFreelancer,
    relatedServices = [],
    auth,
}) {
    console.log(relatedServices);

    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    // State management
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Helper function to get service content based on language
    const getServiceContent = (serviceData, language = currentLang) => {
        if (!serviceData) return {};
        if (language === "ar") {
            return {
                title: serviceData.title_ar || serviceData.title,
                description:
                    serviceData.description_ar || serviceData.description,
                detailedDescription:
                    serviceData.detailed_description_ar ||
                    serviceData.detailed_description,
                category: serviceData.category_ar || serviceData.category,
                subcategory:
                    serviceData.subcategory_ar || serviceData.subcategory,
                deliveryTime:
                    serviceData.delivery_time_ar || serviceData.delivery_time,
                tags: serviceData.tags_ar || serviceData.tags || [],
                features: serviceData.features_ar || serviceData.features || [],
                packages: serviceData.packages_ar || serviceData.packages || [],
                faq: serviceData.faq_ar || serviceData.faq || [],
                dynamicSections: serviceData.dynamic_sections || [],
            };
        }
        return {
            title: serviceData.title,
            description: serviceData.description,
            detailedDescription: serviceData.detailed_description,
            category: serviceData.category,
            subcategory: serviceData.subcategory,
            deliveryTime: serviceData.delivery_time,
            tags: serviceData.tags || [],
            features: serviceData.features || [],
            packages: serviceData.packages || [],
            faq: serviceData.faq || [],
            dynamicSections: serviceData.dynamic_sections || [],
        };
    };

    const serviceContent = getServiceContent(service, currentLang);
    // Helper to get best available packages array
    const getPackages = (serviceData, lang = currentLang) => {
        if (
            lang === "ar" &&
            Array.isArray(serviceData.packages_ar) &&
            serviceData.packages_ar.length > 0
        ) {
            return serviceData.packages_ar;
        }
        return serviceData.packages || [];
    };

    const packages = getPackages(service, currentLang);
    const hasPackages = Array.isArray(packages) && packages.length > 0;

    console.log(serviceContent.packages);

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat("ar-SD", {
            style: "currency",
            currency: "SDG",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get popular package and set initial selection
    const popularPackage = useMemo(() => {
        if (!hasPackages) return null;
        return (
            (packages || []).find((pkg) => pkg.isPopular) || (packages || [])[0]
        );
    }, [packages, hasPackages]);

    // Set initial selected package
    useEffect(() => {
        if (!hasPackages) return;
        if (!selectedPackage && popularPackage) {
            setSelectedPackage(popularPackage);
        }
    }, [popularPackage, selectedPackage, hasPackages]);

    // Handle package selection
    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg);
    };

    // Handle order
    const handleOrder = () => {
        if (hasPackages) {
            const packageToOrder = selectedPackage || popularPackage;
            if (packageToOrder) {
                const encodedPackageName = encodeURIComponent(
                    packageToOrder.name
                );
                router.visit(
                    `/services/${service.id}/order?package=${encodedPackageName}`
                );
            }
        } else {
            router.visit(`/services/${service.id}/order`);
        }
    };

    // Helper function to get package name, description, etc. with fallback
    const getPackageField = (pkg, field, lang = currentLang) => {
        if (lang === "ar") {
            return pkg[`${field}_ar`] || pkg[field] || "";
        }
        return pkg[field] || "";
    };

    // Helper to get best available array field (for features, faq, dynamicSections, etc.)
    const getArrayField = (serviceData, field, lang = currentLang) => {
        if (
            lang === "ar" &&
            Array.isArray(serviceData[`${field}_ar`]) &&
            serviceData[`${field}_ar`].length > 0
        ) {
            return serviceData[`${field}_ar`];
        }
        return serviceData[field] || [];
    };

    const features = getArrayField(service, "features", currentLang);
    const faq = getArrayField(service, "faq", currentLang);
    const dynamicSections = getArrayField(
        service,
        "dynamic_sections",
        currentLang
    );

    // For detailed description fallback
    const detailedDescription =
        serviceContent.detailedDescription ||
        serviceContent.description ||
        t("services.noDescription", "No description available");

    return (
        <>
            <Head title={`${serviceContent.title} - Anjez Platform`} />
            <Navbar auth={auth} />

            {/* Hero Section */}
            <section className="pt-16 pb-8 bg-background rtl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Breadcrumb */}
                        <nav className="mb-6">
                            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <li>
                                    <Link
                                        href="/"
                                        className="hover:text-primary"
                                    >
                                        {t("nav.home", "Home")}
                                    </Link>
                                </li>
                                <li>/</li>
                                <li>
                                    <Link
                                        href="/services"
                                        className="hover:text-primary"
                                    >
                                        {t("nav.services", "Services")}
                                    </Link>
                                </li>
                                <li>/</li>
                                <li className="text-foreground font-medium">
                                    {serviceContent.title}
                                </li>
                            </ol>
                        </nav>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {/* Service Header */}
                                    <div className="mb-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-3">
                                                    {serviceContent.category && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {
                                                                serviceContent.category
                                                            }
                                                        </Badge>
                                                    )}
                                                    {serviceContent.subcategory && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {serviceContent.subcategory !==
                                                                0 &&
                                                                serviceContent.subcategory}
                                                        </Badge>
                                                    )}
                                                    {service.is_popular && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20"
                                                        >
                                                            <TrendingUp className="w-3 h-3 me-1" />
                                                            {t(
                                                                "services.popular",
                                                                "Popular"
                                                            )}
                                                        </Badge>
                                                    )}
                                                    {service.is_featured && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20"
                                                        >
                                                            <Award className="w-3 h-3 me-1" />
                                                            {t(
                                                                "services.featured",
                                                                "Featured"
                                                            )}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                                                    {serviceContent.title}
                                                </h1>

                                                <p className="text-lg text-muted-foreground mb-6">
                                                    {serviceContent.description}
                                                </p>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-3 mb-6">
                                                    {!isFreelancer && (
                                                        <Button
                                                            size="lg"
                                                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                                            onClick={
                                                                handleOrder
                                                            }
                                                        >
                                                            {t(
                                                                "services.orderNow",
                                                                "Order Now"
                                                            )}
                                                            <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                                                        </Button>
                                                    )}

                                                    <ShareButton
                                                        url={
                                                            typeof window !==
                                                            "undefined"
                                                                ? window
                                                                      .location
                                                                      .href
                                                                : ""
                                                        }
                                                        label={t(
                                                            "servicesShow.share.share",
                                                            "Share this service"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Service Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <div className="text-center p-4 bg-card rounded-lg border border-border">
                                                <div className="text-2xl font-bold text-primary">
                                                    {formatPrice(service.price)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {t(
                                                        "services.startingPrice",
                                                        "Starting Price"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-card rounded-lg border border-border">
                                                <div className="text-2xl font-bold text-success">
                                                    {
                                                        serviceContent.deliveryTime
                                                    }
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {t(
                                                        "services.deliveryTime",
                                                        "Delivery Time"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-card rounded-lg border border-border">
                                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                    {service.revisions}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {t(
                                                        "services.revisions",
                                                        "Revisions"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-card rounded-lg border border-border">
                                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                    {service.orders || 0}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {t(
                                                        "services.orders",
                                                        "Orders"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Description */}
                                    <Card className="mb-8">
                                        <CardHeader>
                                            <h2 className="text-xl font-semibold text-foreground">
                                                {t(
                                                    "services.aboutThisService",
                                                    "About This Service"
                                                )}
                                            </h2>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="prose dark:prose-invert max-w-none">
                                                <div
                                                    className={`${
                                                        !showFullDescription &&
                                                        "line-clamp-3"
                                                    }`}
                                                >
                                                    {detailedDescription}
                                                </div>
                                                {(
                                                    serviceContent.detailedDescription ||
                                                    serviceContent.description
                                                )?.length > 500 && (
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() =>
                                                            setShowFullDescription(
                                                                !showFullDescription
                                                            )
                                                        }
                                                        className="mt-4 p-0 h-auto text-primary hover:text-primary/80"
                                                    >
                                                        {showFullDescription
                                                            ? t(
                                                                  "services.showLess",
                                                                  "Show Less"
                                                              )
                                                            : t(
                                                                  "services.readMore",
                                                                  "Read More"
                                                              )}
                                                        {showFullDescription ? (
                                                            <ChevronUp className="w-4 h-4 ml-1" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4 ml-1" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Features */}
                                    {features.length > 0 && (
                                        <Card className="mb-8">
                                            <CardHeader>
                                                <h2 className="text-xl font-semibold text-foreground">
                                                    {t(
                                                        "services.whatYoullGet",
                                                        "What You'll Get"
                                                    )}
                                                </h2>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {features.map(
                                                        (feature, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-start gap-3"
                                                            >
                                                                <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                                                                <span className="text-foreground">
                                                                    {feature}
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* FAQ */}
                                    {faq.length > 0 && (
                                        <Card className="mb-8">
                                            <CardHeader>
                                                <h2 className="text-xl font-semibold text-foreground">
                                                    {t(
                                                        "services.faq",
                                                        "Frequently Asked Questions"
                                                    )}
                                                </h2>
                                            </CardHeader>
                                            <CardContent>
                                                <Accordion
                                                    type="single"
                                                    collapsible
                                                    className="w-full"
                                                >
                                                    {faq.map((faq, index) => (
                                                        <AccordionItem
                                                            key={index}
                                                            value={`item-${index}`}
                                                        >
                                                            <AccordionTrigger className="text-left">
                                                                {faq.question}
                                                            </AccordionTrigger>
                                                            <AccordionContent>
                                                                {faq.answer}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    ))}
                                                </Accordion>
                                            </CardContent>
                                        </Card>
                                    )}
                                </motion.div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 space-y-6">
                                    {/* Freelancer Card */}
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-4">
                                                <div className=" border rounded-full w-20 h-20">
                                                    <Avatar className="w-full h-full">
                                                        <AvatarImage
                                                            className="object-cover w-full h-full"
                                                            src={
                                                                service
                                                                    .freelancer
                                                                    ?.avatar
                                                            }
                                                        />
                                                        <AvatarFallback>
                                                            {
                                                                service
                                                                    .freelancer
                                                                    ?.name[0]
                                                            }
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-foreground">
                                                            {service.freelancer
                                                                ?.name ||
                                                                t(
                                                                    "services.unknownFreelancer",
                                                                    "Unknown"
                                                                )}
                                                        </h3>
                                                        {service.freelancer
                                                            ?.verificationStatus ===
                                                            "verified" && (
                                                            <CheckCircle className="w-4 h-4 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                                        <Briefcase className="w-4 h-4" />
                                                        <span>
                                                            {
                                                                service
                                                                    .freelancer
                                                                    ?.title
                                                            }
                                                        </span>
                                                    </div>
                                                    {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                        <span>{service.freelancer?.rating || 0}</span>
                                                        <span className="text-muted-foreground">({service.freelancer?.totalReviews || 0} {t('services.reviews', 'reviews')})</span>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div>
                                                    <div className="text-lg font-semibold text-success">
                                                        {service.freelancer
                                                            ?.successRate ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {t(
                                                            "services.successRate",
                                                            "Success Rate"
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-semibold text-primary">
                                                        {service.freelancer
                                                            ?.onTimeDelivery ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {t(
                                                            "services.onTime",
                                                            "On Time"
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                                                        {service.freelancer
                                                            ?.repeatClients ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {t(
                                                            "services.repeatClients",
                                                            "Repeat Clients"
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="space-y-2">
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/freelancers/${
                                                            service.freelancer
                                                                ?.id ||
                                                            "unknown"
                                                        }`}
                                                    >
                                                        <User className="w-4 h-4 mr-2" />
                                                        {t(
                                                            "services.viewProfile",
                                                            "View Profile"
                                                        )}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Packages or Base Price */}
                                    {hasPackages &&
                                    packages &&
                                    packages.length > 0 ? (
                                        <Card>
                                            <CardHeader>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {t(
                                                        "services.choosePackage",
                                                        "Choose Your Package"
                                                    )}
                                                </h3>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {packages.map(
                                                        (pkg, index) => (
                                                            <div
                                                                key={index}
                                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                                    selectedPackage?.name ===
                                                                        pkg.name ||
                                                                    (!selectedPackage &&
                                                                        pkg.isPopular)
                                                                        ? "border-primary bg-primary/5"
                                                                        : "border-border hover:border-border"
                                                                }`}
                                                                onClick={() =>
                                                                    handlePackageSelect(
                                                                        pkg
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-start justify-between mb-3">
                                                                    <div>
                                                                        <h4 className="font-semibold text-foreground">
                                                                            {getPackageField(
                                                                                pkg,
                                                                                "name"
                                                                            )}
                                                                            {pkg.isPopular && (
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className="ml-2 bg-success/10 text-success"
                                                                                >
                                                                                    {t(
                                                                                        "services.popular",
                                                                                        "Popular"
                                                                                    )}
                                                                                </Badge>
                                                                            )}
                                                                        </h4>
                                                                        <div className="text-2xl font-bold text-primary mt-1">
                                                                            {formatPrice(
                                                                                pkg.price
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2 mb-4">
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <Clock className="w-4 h-4" />
                                                                        <span>
                                                                            {getPackageField(
                                                                                pkg,
                                                                                "delivery_time"
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        <span>
                                                                            {getPackageField(
                                                                                pkg,
                                                                                "revisions"
                                                                            )}{" "}
                                                                            {t(
                                                                                "services.revisions",
                                                                                "revisions"
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <ul className="space-y-1 mb-4">
                                                                    {(
                                                                        getPackageField(
                                                                            pkg,
                                                                            "features"
                                                                        ) || []
                                                                    )
                                                                        .slice(
                                                                            0,
                                                                            3
                                                                        )
                                                                        .map(
                                                                            (
                                                                                feature,
                                                                                featureIndex
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        featureIndex
                                                                                    }
                                                                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                                                                >
                                                                                    <CheckCircle className="w-3 h-3 text-success" />
                                                                                    <span>
                                                                                        {
                                                                                            feature
                                                                                        }
                                                                                    </span>
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    {(
                                                                        getPackageField(
                                                                            pkg,
                                                                            "features"
                                                                        ) || []
                                                                    ).length >
                                                                        3 && (
                                                                        <li className="text-sm text-muted-foreground">
                                                                            +
                                                                            {(
                                                                                getPackageField(
                                                                                    pkg,
                                                                                    "features"
                                                                                ) ||
                                                                                []
                                                                            )
                                                                                .length -
                                                                                3}{" "}
                                                                            {t(
                                                                                "services.moreFeatures",
                                                                                "more features"
                                                                            )}
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                {!isFreelancer && (
                                                    <Button
                                                        className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                                                        size="lg"
                                                        onClick={handleOrder}
                                                    >
                                                        {t(
                                                            "services.orderNow",
                                                            "Order Now"
                                                        )}
                                                        <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card>
                                            <CardHeader>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {t(
                                                        "services.servicePrice",
                                                        "Service Price"
                                                    )}
                                                </h3>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="p-4 border rounded-lg bg-primary/5 border-primary">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-lg">
                                                                Standard
                                                            </h4>
                                                            <div className="text-2xl font-bold text-primary mt-2">
                                                                {formatPrice(
                                                                    service.price
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground mt-1">
                                                                {t(
                                                                    "services.deliveryIn",
                                                                    "Delivery in"
                                                                )}{" "}
                                                                {
                                                                    service.delivery_time
                                                                }{" "}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {service.features &&
                                                        service.features
                                                            .length > 0 && (
                                                            <div className="mt-4">
                                                                <ul className="space-y-2">
                                                                    {service.features.map(
                                                                        (
                                                                            feature,
                                                                            featureIndex
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    featureIndex
                                                                                }
                                                                                className="flex items-center gap-2 text-sm"
                                                                            >
                                                                                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                                                                                {
                                                                                    feature
                                                                                }
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        )}
                                                </div>
                                                {!isFreelancer && (
                                                    <Button
                                                        className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                                                        size="lg"
                                                        onClick={handleOrder}
                                                    >
                                                        {t(
                                                            "services.orderNow",
                                                            "Order Now"
                                                        )}
                                                        <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Services Section */}
            {relatedServices && relatedServices.length > 0 && (
                <section className="py-16 bg-muted rtl">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-4">
                                    {t(
                                        "services.moreFromFreelancer",
                                        "More Services from"
                                    )}{" "}
                                    {service.freelancer?.name ||
                                        t(
                                            "services.thisFreelancer",
                                            "This Freelancer"
                                        )}
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    {t(
                                        "services.exploreOtherServices",
                                        "Explore other services offered by this freelancer"
                                    )}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedServices.map((relatedService) => {
                                    const relatedServiceContent =
                                        getServiceContent(
                                            relatedService,
                                            currentLang
                                        );
                                    return (
                                        <motion.div
                                            key={relatedService.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6 }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border h-full flex flex-col rtl">
                                                <CardHeader className="p-0 relative">
                                                    {/* Service Image Placeholder */}
                                                </CardHeader>

                                                <CardContent className="p-4 flex-1 flex flex-col">
                                                    {/* Title and Description */}
                                                    <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                        {
                                                            relatedServiceContent.title
                                                        }
                                                    </CardTitle>
                                                    <CardDescription className="text-sm line-clamp-2 mb-4">
                                                        {
                                                            relatedServiceContent.description
                                                        }
                                                    </CardDescription>
                                                    {/* Badges for featured/popular */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {relatedService.is_popular && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20"
                                                            >
                                                                <TrendingUp className="w-3 h-3 me-1" />
                                                                {t(
                                                                    "services.popular",
                                                                    "Popular"
                                                                )}
                                                            </Badge>
                                                        )}
                                                        {relatedService.is_featured && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20"
                                                            >
                                                                <Award className="w-3 h-3 me-1" />
                                                                {t(
                                                                    "services.featured",
                                                                    "Featured"
                                                                )}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Freelancer Info */}
                                                    <div className="mt-auto">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <Avatar className="h-9 w-9">
                                                                <AvatarImage
                                                                    src={
                                                                        relatedService
                                                                            .freelancer
                                                                            ?.avatar
                                                                    }
                                                                />
                                                                <AvatarFallback>
                                                                    {relatedService
                                                                        .freelancer
                                                                        ?.name
                                                                        ? relatedService.freelancer.name
                                                                              .split(
                                                                                  " "
                                                                              )
                                                                              .slice(
                                                                                  0,
                                                                                  1
                                                                              )
                                                                              .map(
                                                                                  (
                                                                                      n
                                                                                  ) =>
                                                                                      n[0]
                                                                              )
                                                                              .join(
                                                                                  " "
                                                                              )
                                                                        : "U"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">
                                                                    {relatedService
                                                                        .freelancer
                                                                        ?.name ||
                                                                        t(
                                                                            "services.unknownFreelancer",
                                                                            "Unknown"
                                                                        )}
                                                                </p>
                                                                {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <Briefcase className="w-3 h-3" />
                                                                    <span className="truncate">
                                                                        {relatedService
                                                                            .freelancer
                                                                            ?.title ||
                                                                            t(
                                                                                "services.titleUnknown",
                                                                                "Title unknown"
                                                                            )}
                                                                    </span>
                                                                </div> */}
                                                            </div>
                                                        </div>


                                                        {/* Price and Delivery */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-lg font-semibold text-primary">
                                                                {formatPrice(
                                                                    relatedService.price
                                                                )}
                                                            </div>
                                                         
                                                        </div>
                                                    </div>
                                                </CardContent>

                                                <CardFooter className="p-4 border-t border-border">
                                                    <Button
                                                        className="w-full"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/services/${relatedService.id}`}
                                                        >
                                                            {t(
                                                                "services.viewDetails",
                                                                "View Details"
                                                            )}
                                                            <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                                                        </Link>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Reviews Section - Show real reviews if available, otherwise show static reviews */}
            {service.reviews && service.reviews.length > 0 && (
                <section className="py-16 bg-background rtl">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-4">
                                    {t(
                                        "services.whatClientsSay",
                                        "What Our Clients Say"
                                    )}
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    {service.reviews &&
                                    service.reviews.length > 0
                                        ? t(
                                              "services.realFeedback",
                                              "Real feedback from satisfied customers"
                                          )
                                        : t(
                                              "services.testimonialFeedback",
                                              "Testimonials from our community"
                                          )}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Show real reviews if available */}
                                {service.reviews &&
                                    service.reviews.length > 0 &&
                                    service.reviews
                                        .slice(0, 3)
                                        .map((review, index) => (
                                            <motion.div
                                                key={review.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.6,
                                                    delay: 0.1 * (index + 1),
                                                }}
                                            >
                                                <Card className="h-full">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-1 mb-4">
                                                            {[...Array(5)].map(
                                                                (_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${
                                                                            i <
                                                                            review.rating
                                                                                ? "text-yellow-500 fill-current"
                                                                                : "text-muted-foreground"
                                                                        }`}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                        <p className="text-foreground mb-4 italic">
                                                            "{review.comment}"
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="w-10 h-10">
                                                                <AvatarImage
                                                                    src={
                                                                        review
                                                                            .client
                                                                            ?.avatar
                                                                    }
                                                                />
                                                                <AvatarFallback>
                                                                    {review
                                                                        .client
                                                                        ?.name
                                                                        ? review
                                                                              .client
                                                                              .name[0]
                                                                        : "U"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium text-foreground">
                                                                    {review
                                                                        .client
                                                                        ?.name ||
                                                                        t(
                                                                            "services.anonymous",
                                                                            "Anonymous"
                                                                        )}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {formatDate(
                                                                        review.created_at
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                            </div>

                            {/* Call to Action */}
                            <div className="text-center mt-12">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    asChild
                                >
                                    <Link href="/services">
                                        {t(
                                            "services.browseAll",
                                            "Browse All Services"
                                        )}
                                        <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <Footer />
        </>
    );
}
