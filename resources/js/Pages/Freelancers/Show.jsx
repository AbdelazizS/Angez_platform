import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Star,
    MapPin,
    Clock,
    Calendar,
    CheckCircle,
    MessageSquare,
    Eye,
    Award,
    Users,
    TrendingUp,
    ArrowRight,
    Mail,
    Phone,
    Globe,
    Linkedin,
    Twitter,
    Instagram,
    Facebook,
    Download,
    Filter,
    Search,
    DollarSign,
    Briefcase,
    BookOpen,
    Languages,
    Code,
    Zap,
    Target,
    BarChart3,
    Heart,
    ThumbsUp,
    Clock3,
    UserCheck,
    FileText,
    ImageIcon,
    ExternalLink,
    Play,
    Pause,
    AlertCircle,
    Shield,
    Trophy,
    Sparkles,
    Activity,
    TrendingDown,
    TrendingUp as TrendingUpIcon,
    BarChart,
    PieChart,
    LineChart,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Progress } from "@/Components/ui/progress";
import { Separator } from "@/Components/ui/separator";
import { useTranslation } from "react-i18next";
import { useLanguageChange } from "@/lib/useLanguageChange";
import Navbar from "@/Components/Home/Navbar";
import Footer from "@/Components/Home/Footer";

export default function FreelancerShow({
    freelancer,
    services,
    reviews,
    portfolio,
    earnings,
    recentOrders,
    stats,
    auth,
}) {
    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();
    const [activeTab, setActiveTab] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");

    const formatPrice = (price) => {
        return new Intl.NumberFormat("ar-SD", {
            style: "currency",
            currency: "SDG",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ar-SD", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getAvailabilityColor = (status) => {
        switch (status) {
            case "available":
                return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/20";
            case "busy":
                return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800/20";
            case "unavailable":
                return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/20 ";
            default:
                return "text-muted-foreground bg-muted";
        }
    };

    const getAvailabilityIcon = (status) => {
        switch (status) {
            case "available":
                return <CheckCircle className="w-4 h-4" />;
            case "busy":
                return <Clock3 className="w-4 h-4" />;
            case "unavailable":
                return <Pause className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === "all" || service.category === categoryFilter;
        const matchesPrice =
            priceFilter === "all" ||
            (priceFilter === "low" && service.price <= 50000) ||
            (priceFilter === "medium" &&
                service.price > 50000 &&
                service.price <= 150000) ||
            (priceFilter === "high" && service.price > 150000);

        return matchesSearch && matchesCategory && matchesPrice;
    });

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
              ).toFixed(1)
            : 0;

    return (
        <>
            <Head title={`${freelancer.name} - ${t('freelancerProfile.title', 'Freelancer Profile')}`} />
            <Navbar auth={auth} />

            {/* Modern Hero Section */}
            <section className="relative bg-gradient-to-br from-background via-primary/5 to-primary/10 py-20 overflow-hidden rtl">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-border/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-8 items-start">
                            {/* Profile Info */}
                            <div className="lg:col-span-2">
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <Avatar className="w-32 h-32 border-4 border-background shadow-2xl ring-4 ring-primary/20">
                                    <AvatarImage
                                                src={freelancer.avatar}
                                                alt={freelancer.name}
                                            />
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-3xl font-bold">
                                                {freelancer.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                        {/* Verification Badge */}
                                        {freelancer.verificationStatus === "verified" && (
                                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Profile Details */}
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <h1 className="text-4xl font-bold text-foreground">
                                                    {freelancer.name}
                                                </h1>
                                        <Badge
                                            className={`${getAvailabilityColor(
                                                freelancer.availabilityStatus
                                            )}`}
                                        >
                                                    {getAvailabilityIcon(freelancer.availabilityStatus)}
                                                    <span className="ms-1 capitalize">
                                                        {t(`freelancerProfile.contact.${freelancer.availabilityStatus}`, freelancer.availabilityStatus)}
                                            </span>
                                        </Badge>
                                    </div>

                                            <p className="text-xl text-muted-foreground mb-4">
                                                {freelancer.title || t('freelancerProfile.about.title', 'Professional Freelancer')}
                                    </p>

                                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{freelancer.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            <span>
                                                        {averageRating} ({reviews.length} {t('freelancerProfile.hero.reviews', 'reviews')})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>
                                                        {freelancer.completedOrders} {t('freelancerProfile.hero.ordersCompleted', 'orders completed')}
                                            </span>
                                    </div>

                                            </div>
                                        </div>

                                        {/* Quick Stats Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                                                <CardContent className="p-4 text-center">
                                                    <div className="text-2xl font-bold text-primary">
                                                        {averageRating}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {t('freelancerProfile.hero.rating', 'Rating')}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                                                <CardContent className="p-4 text-center">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {freelancer.completedOrders}
                                            </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {t('freelancerProfile.hero.orders', 'Orders')}
                                            </div>
                                                </CardContent>
                                            </Card>
                                            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                                                <CardContent className="p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {services.length}
                                            </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {t('freelancerProfile.hero.services', 'Services')}
                                            </div>
                                                </CardContent>
                                            </Card>
                                            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                                                <CardContent className="p-4 text-center">
                                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                {stats.uniqueClients}
                                            </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {t('freelancerProfile.hero.clients', 'Clients')}
                                            </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 bg-background rtl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-4 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 rtl">
                                    <TabsList className="grid w-full grid-cols-5 bg-muted">
                                        <TabsTrigger value="overview" className="data-[state=active]:bg-background">
                                            {t('freelancerProfile.tabs.overview', 'Overview')}
                                    </TabsTrigger>
                                        <TabsTrigger value="services" className="data-[state=active]:bg-background">
                                            {t('freelancerProfile.tabs.services', 'Services')}
                                    </TabsTrigger>
                                        <TabsTrigger value="reviews" className="data-[state=active]:bg-background">
                                            {t('freelancerProfile.tabs.reviews', 'Reviews')}
                                    </TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                    <TabsContent value="overview" className="space-y-8">
                                        {/* About Section */}
                                        <Card className="shadow-lg border-0  bg-card">
                                        <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                                                <UserCheck className="w-5 h-5" />
                                                    {t('freelancerProfile.about.title', 'About')} {freelancer.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                                <p className="text-muted-foreground leading-relaxed text-left">
                                                    {freelancer.bio || t('freelancerProfile.about.noBio', 'No bio available.')}
                                            </p>
                                        </CardContent>
                                    </Card>

                                        {/* Skills Section */}
                                        {freelancer.skills && freelancer.skills.length > 0 && (
                                            <Card className="shadow-lg border-0">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                                                        <Code className="w-5 h-5" />
                                                        {t('freelancerProfile.about.skills', 'Skills & Expertise')}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-wrap gap-2">
                                                        {freelancer.skills.map((skill, index) => (
                                                            <Badge key={index} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary">
                                                                    {skill}
                                                                </Badge>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Languages Section */}
                                        {freelancer.languages && freelancer.languages.length > 0 && (
                                            <Card className="shadow-lg border-0">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                                                        <Languages className="w-5 h-5" />
                                                        {t('freelancerProfile.about.languages', 'Languages')}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-wrap gap-2">
                                                        {freelancer.languages.map((language, index) => (
                                                            <Badge key={index} variant="outline" className="px-3 py-1">
                                                                    {language}
                                                                </Badge>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Education Section */}
                                    {freelancer.education && (
                                            <Card className="shadow-lg border-0">
                                            <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                                                    <BookOpen className="w-5 h-5" />
                                                        {t('freelancerProfile.about.education', 'Education')}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                    <p className="text-muted-foreground">
                                                    {freelancer.education}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}

                                        {/* Recent Work Section */}
                                    {recentOrders.length > 0 && (
                                            <Card className="shadow-lg border-0">
                                            <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                                                    <Briefcase className="w-5 h-5" />
                                                        {t('freelancerProfile.about.recentWork', 'Recent Work')}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                        {recentOrders.map((order) => (
                                                            <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                                                <div>
                                                                    <h4 className="font-semibold text-foreground">
                                                                        {order.service?.title || "Service"}
                                                                    </h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {t('freelancerProfile.about.completedFor', 'Completed for')} {order.client?.name}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                                        {formatPrice(order.total_amount)}
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {formatDate(order.completed_at)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                {/* Services Tab */}
                                    <TabsContent value="services" className="space-y-8">
                                      

                                    {/* Services Grid */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                            {filteredServices.slice(0, 6).map((service) => (
                                                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 shadow-lg">
                                                <CardContent className="p-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                                                                {service.title}
                                                            </h3>
                                                                <p className="text-muted-foreground text-sm line-clamp-2">
                                                                    {service.description}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                                <div className="text-lg font-bold text-primary">
                                                                    {formatPrice(service.price)}
                                                            </div>
                                                                <Button variant="outline" size="sm" asChild>
                                                                    <Link href={`/services/${service.id}`}>
                                                                        {t('freelancerProfile.services.viewDetails', 'View Details')}
                                                                        <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                                                                </Link>
                                                            </Button>
                                                        </div>

                                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                    <span>{service.delivery_time}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                    <span>{service.revisions} {t('freelancerProfile.services.revisions', 'revisions')}</span>
                                                            </div>
                                                        </div>

                                                            {service.total_orders > 0 && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {service.total_orders} {t('nav.orders', 'orders')}
                                                            </Badge>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>

                                        {filteredServices.length === 0 && (
                                            <Card className="shadow-lg border-0">
                                            <CardContent className="p-8 text-center">
                                                    <p className="text-muted-foreground">
                                                        {t('freelancerProfile.services.noServicesFound', 'No services found matching your criteria.')}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>


                                {/* Reviews Tab */}
                                    <TabsContent value="reviews" className="space-y-8">
                                    {reviews.length > 0 ? (
                                        <div className="space-y-6">
                                                {reviews?.slice(0, 3).map((review) => (
                                                    <Card key={review.id} className="shadow-lg border-0">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start gap-4">
                                                            <Avatar className="w-12 h-12">
                                                                    <AvatarImage src={review.client?.avatar} />
                                                                    <AvatarFallback className="bg-gradient-to-r from-muted-foreground to-muted-foreground/80 text-background">
                                                                        {review.client?.name[0] || "C"}
                                                                </AvatarFallback>
                                                            </Avatar>

                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div>
                                                                            <h4 className="font-semibold text-foreground">
                                                                                {review.client?.name || t('freelancerProfile.reviews.anonymous', 'Anonymous')}
                                                                        </h4>
                                                                            <p className="text-sm text-muted-foreground">
                                                                                {formatDate(review.created_at)}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <Star
                                                                                    key={i}
                                                                                    className={`w-4 h-4 ${
                                                                                        i < review.rating
                                                                                            ? "text-yellow-500 fill-current"
                                                                                            : "text-muted-foreground"
                                                                                    }`}
                                                                                />
                                                                            ))}
                                                                    </div>
                                                                </div>

                                                                    <p className="text-muted-foreground mb-3">
                                                                        {review.comment}
                                                                </p>

                                                                {review.project_type && (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {review.project_type}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                            <Card className="shadow-lg border-0">
                                            <CardContent className="p-8 text-center">
                                                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                    <p className="text-muted-foreground">
                                                        {t('freelancerProfile.reviews.noReviews', 'No reviews available yet.')}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                            </Tabs>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Performance Stats */}
                                    <Card className="shadow-lg border-0">
                                    <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5" />
                                                {t('freelancerProfile.performance.title', 'Performance Stats')}
                                        </CardTitle>
                                    </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-muted-foreground">
                                                            {t('freelancerProfile.performance.successRate', 'Success Rate')}
                                                </span>
                                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {stats.successRate}%
                                                </span>
                                            </div>
                                                    <Progress value={stats.successRate} className="h-2" />
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-muted-foreground">
                                                            {t('freelancerProfile.performance.onTimeDelivery', 'On-Time Delivery')}
                                                </span>
                                                        <span className="font-semibold text-primary">
                                                    {stats.onTimeDelivery}%
                                                </span>
                                            </div>
                                                    <Progress value={stats.onTimeDelivery} className="h-2" />
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-muted-foreground">
                                                            {t('freelancerProfile.performance.repeatClients', 'Repeat Clients')}
                                                </span>
                                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                    {stats.repeatClients}%
                                                </span>
                                            </div>
                                                    <Progress value={stats.repeatClients} className="h-2" />
                                                </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Member Since */}
                                    <Card className="shadow-lg border-0">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Calendar className="w-5 h-5" />
                                                {t('freelancerProfile.hero.memberSince', 'Member Since')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                                                <div className="text-2xl font-bold text-primary">
                                                {freelancer.memberSince}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    {t('freelancerProfile.hero.memberSince', 'Member since')} {freelancer.memberSince}
                                                </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
