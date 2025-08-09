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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";

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
                return "text-green-600 bg-green-100";
            case "busy":
                return "text-yellow-600 bg-yellow-100";
            case "unavailable":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
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
            <Head title={`${freelancer.name} - Freelancer Profile`} />
            {/* <Navbar auth={auth} /> */}

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex items-start gap-6">
                                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                                    <AvatarImage
                                        src={
                                            freelancer.avatar
                                                ? `/storage/${freelancer.avatar}`
                                                : undefined
                                        }
                                    />
                                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-3xl font-bold">
                                        {freelancer.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                            {freelancer.name}
                                        </h1>
                                        {freelancer.verificationStatus ===
                                            "verified" && (
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Verified
                                            </Badge>
                                        )}
                                        <Badge
                                            className={`${getAvailabilityColor(
                                                freelancer.availabilityStatus
                                            )}`}
                                        >
                                            {getAvailabilityIcon(
                                                freelancer.availabilityStatus
                                            )}
                                            <span className="ml-1 capitalize">
                                                {freelancer.availabilityStatus}
                                            </span>
                                        </Badge>
                                    </div>

                                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                                        {freelancer.title ||
                                            "Professional Freelancer"}
                                    </p>

                                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{freelancer.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            <span>
                                                {averageRating} (
                                                {reviews.length} reviews)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>
                                                {freelancer.completedOrders}{" "}
                                                orders completed
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                Response in{" "}
                                                {freelancer.responseTime}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            <span>
                                                {formatPrice(
                                                    freelancer.hourlyRate
                                                )}
                                                /hr
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {averageRating}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Rating
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {freelancer.completedOrders}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Orders
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {services.length}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Services
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                {stats.uniqueClients}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Clients
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Earnings Card */}
                        <div className="lg:w-80">
                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                                        <TrendingUp className="w-5 h-5" />
                                        Earnings Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {formatPrice(earnings.total)}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {formatPrice(earnings.thisMonth)}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">This Month</div>
                                        </div>
                                    </div> */}

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Success Rate
                                            </span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                {stats.successRate}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={stats.successRate}
                                            className="h-2"
                                        />

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                On-Time Delivery
                                            </span>
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {stats.onTimeDelivery}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={stats.onTimeDelivery}
                                            className="h-2"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2">
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="space-y-6"
                            >
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview">
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="services">
                                        Services
                                    </TabsTrigger>
                                    <TabsTrigger value="portfolio">
                                        Portfolio
                                    </TabsTrigger>
                                    <TabsTrigger value="reviews">
                                        Reviews
                                    </TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent
                                    value="overview"
                                    className="space-y-6"
                                >
                                    {/* About */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                                                <UserCheck className="w-5 h-5" />
                                                About {freelancer.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {freelancer.bio ||
                                                    "No bio available."}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Skills */}
                                    {freelancer.skills &&
                                        freelancer.skills.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                                                        <Code className="w-5 h-5" />
                                                        Skills & Expertise
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-wrap gap-2">
                                                        {freelancer.skills.map(
                                                            (skill, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="secondary"
                                                                    className="px-3 py-1"
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                    {/* Languages */}
                                    {freelancer.languages &&
                                        freelancer.languages.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                                                        <Languages className="w-5 h-5" />
                                                        Languages
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-wrap gap-2">
                                                        {freelancer.languages.map(
                                                            (
                                                                language,
                                                                index
                                                            ) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="outline"
                                                                    className="px-3 py-1"
                                                                >
                                                                    {language}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                    {/* Education */}
                                    {freelancer.education && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                                                    <BookOpen className="w-5 h-5" />
                                                    Education
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {freelancer.education}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Recent Work */}
                                    {recentOrders.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                                                    <Briefcase className="w-5 h-5" />
                                                    Recent Work
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {recentOrders.map(
                                                        (order) => (
                                                            <div
                                                                key={order.id}
                                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                                            >
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                        {order
                                                                            .service
                                                                            ?.title ||
                                                                            "Service"}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        Completed
                                                                        for{" "}
                                                                        {
                                                                            order
                                                                                .client
                                                                                ?.name
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-semibold text-green-600 dark:text-green-400">
                                                                        {formatPrice(
                                                                            order.total_amount
                                                                        )}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {formatDate(
                                                                            order.completed_at
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                {/* Services Tab */}
                                <TabsContent
                                    value="services"
                                    className="space-y-6"
                                >
                                    {/* Filters */}
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                        <Input
                                                            placeholder="Search services..."
                                                            value={searchTerm}
                                                            onChange={(e) =>
                                                                setSearchTerm(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                                <Select
                                                    value={categoryFilter}
                                                    onValueChange={
                                                        setCategoryFilter
                                                    }
                                                >
                                                    <SelectTrigger className="w-full sm:w-48">
                                                        <SelectValue placeholder="Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            All Categories
                                                        </SelectItem>
                                                        <SelectItem value="Web Development">
                                                            Web Development
                                                        </SelectItem>
                                                        <SelectItem value="Graphic Design">
                                                            Graphic Design
                                                        </SelectItem>
                                                        <SelectItem value="Content Writing">
                                                            Content Writing
                                                        </SelectItem>
                                                        <SelectItem value="Digital Marketing">
                                                            Digital Marketing
                                                        </SelectItem>
                                                        <SelectItem value="Translation">
                                                            Translation
                                                        </SelectItem>
                                                        <SelectItem value="Video Editing">
                                                            Video Editing
                                                        </SelectItem>
                                                        <SelectItem value="Mobile Development">
                                                            Mobile Development
                                                        </SelectItem>
                                                        <SelectItem value="Data Entry">
                                                            Data Entry
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Select
                                                    value={priceFilter}
                                                    onValueChange={
                                                        setPriceFilter
                                                    }
                                                >
                                                    <SelectTrigger className="w-full sm:w-48">
                                                        <SelectValue placeholder="Price Range" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            All Prices
                                                        </SelectItem>
                                                        <SelectItem value="low">
                                                            Under 50,000 SDG
                                                        </SelectItem>
                                                        <SelectItem value="medium">
                                                            50,000 - 150,000 SDG
                                                        </SelectItem>
                                                        <SelectItem value="high">
                                                            Over 150,000 SDG
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Services Grid */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {filteredServices.map((service) => (
                                            <Card
                                                key={service.id}
                                                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800"
                                            >
                                                <CardContent className="p-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                                                {service.title}
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                                                {
                                                                    service.description
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                                {formatPrice(
                                                                    service.price
                                                                )}
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={`/services/${service.id}`}
                                                                >
                                                                    View Details
                                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                                </Link>
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                <span>
                                                                    {
                                                                        service.delivery_time
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span>
                                                                    {
                                                                        service.revisions
                                                                    }{" "}
                                                                    revisions
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {service.total_orders >
                                                            0 && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    service.total_orders
                                                                }{" "}
                                                                orders
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {filteredServices.length === 0 && (
                                        <Card>
                                            <CardContent className="p-8 text-center">
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    No services found matching
                                                    your criteria.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                {/* Portfolio Tab */}
                                <TabsContent
                                    value="portfolio"
                                    className="space-y-6"
                                >
                                    {portfolio.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {portfolio.map((item) => (
                                                <Card
                                                    key={item.id}
                                                    className="group hover:shadow-lg transition-all duration-300"
                                                >
                                                    <CardContent className="p-0 overflow-hidden">
                                                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative group-hover:scale-105 transition-transform duration-300">
                                                            {item.image ? (
                                                                <img
                                                                    src={`/storage/${item.image}`}
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <ImageIcon className="w-12 h-12 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                                {item.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                                {
                                                                    item.description
                                                                }
                                                            </p>
                                                            {item.link && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    asChild
                                                                >
                                                                    <a
                                                                        href={
                                                                            item.link
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                                        View
                                                                        Project
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <Card>
                                            <CardContent className="p-8 text-center">
                                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    No portfolio items available
                                                    yet.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                {/* Reviews Tab */}
                                <TabsContent
                                    value="reviews"
                                    className="space-y-6"
                                >
                                    {reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {reviews.map((review) => (
                                                <Card key={review.id}>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start gap-4">
                                                            <Avatar className="w-12 h-12">
                                                                <AvatarImage
                                                                    src={
                                                                        review
                                                                            .client
                                                                            ?.avatar
                                                                    }
                                                                />
                                                                <AvatarFallback className="bg-gradient-to-r from-gray-400 to-gray-600 text-white">
                                                                    {review.client?.name
                                                                        ?.split(
                                                                            " "
                                                                        )
                                                                        .map(
                                                                            (
                                                                                n
                                                                            ) =>
                                                                                n[0]
                                                                        )
                                                                        .join(
                                                                            ""
                                                                        ) ||
                                                                        "C"}
                                                                </AvatarFallback>
                                                            </Avatar>

                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div>
                                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                            {review
                                                                                .client
                                                                                ?.name ||
                                                                                "Anonymous"}
                                                                        </h4>
                                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                            {formatDate(
                                                                                review.created_at
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        {[
                                                                            ...Array(
                                                                                5
                                                                            ),
                                                                        ].map(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) => (
                                                                                <Star
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className={`w-4 h-4 ${
                                                                                        i <
                                                                                        review.rating
                                                                                            ? "text-yellow-500 fill-current"
                                                                                            : "text-gray-300"
                                                                                    }`}
                                                                                />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                                    {
                                                                        review.comment
                                                                    }
                                                                </p>

                                                                {review.project_type && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {
                                                                            review.project_type
                                                                        }
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <Card>
                                            <CardContent className="p-8 text-center">
                                                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    No reviews available yet.
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
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                            Performance Stats
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Success Rate
                                                </span>
                                                <span className="font-semibold text-green-600 dark:text-green-400">
                                                    {stats.successRate}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={stats.successRate}
                                                className="h-2"
                                            />

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    On-Time Delivery
                                                </span>
                                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                    {stats.onTimeDelivery}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={stats.onTimeDelivery}
                                                className="h-2"
                                            />

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Repeat Clients
                                                </span>
                                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                    {stats.repeatClients}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={stats.repeatClients}
                                                className="h-2"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Member Since */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                Member since{" "}
                                                {freelancer.memberSince}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
