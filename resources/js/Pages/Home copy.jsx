import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { 
    ArrowRight, 
    Star, 
    Users, 
    Shield, 
    Zap, 
    Globe,
    CheckCircle,
    Play,
    MessageCircle,
    Wallet,
    Search,
    FileText,
    Handshake
} from 'lucide-react';

export default function Home({ auth }) {
    const features = [
        {
            icon: <Handshake className="h-6 w-6" />,
            title: "Secure Payments",
            description: "Safe transaction verification with bank transfer and screenshot proof"
        },
        {
            icon: <MessageCircle className="h-6 w-6" />,
            title: "Real-time Chat",
            description: "Direct communication between clients and freelancers for each order"
        },
        {
            icon: <Wallet className="h-6 w-6" />,
            title: "Freelancer Wallet",
            description: "Automatic payment processing with 80% payout after completion"
        },
        {
            icon: <Search className="h-6 w-6" />,
            title: "Easy Discovery",
            description: "Browse and search freelancers by services, ratings, and age groups"
        }
    ];

    const testimonials = [
        {
            name: "أحمد محمد",
            role: "مصمم جرافيك",
            content: "منصة أنجز غيرت حياتي المهنية. الآن يمكنني العثور على عملاء بسهولة وأحصل على مدفوعات آمنة.",
            rating: 5
        },
        {
            name: "Fatima Hassan",
            role: "Web Developer",
            content: "The platform is perfect for Sudanese freelancers. Secure payments and great client communication.",
            rating: 5
        },
        {
            name: "عمر عبدالله",
            role: "مترجم",
            content: "أفضل منصة للعمل الحر في السودان. نظام الدفع آمن والخدمة ممتازة.",
            rating: 5
        }
    ];

    const howItWorks = [
        {
            step: "1",
            title: "Register & Create Profile",
            description: "Sign up as a client or freelancer. Freelancers can create detailed profiles with services and portfolio.",
            icon: <Users className="h-8 w-8" />
        },
        {
            step: "2",
            title: "Browse & Order Services",
            description: "Clients can search and browse freelancer profiles, then place orders for services they need.",
            icon: <Search className="h-8 w-8" />
        },
        {
            step: "3",
            title: "Secure Payment",
            description: "Upload payment proof with transaction reference. Admin verifies and confirms the order.",
            icon: <Shield className="h-8 w-8" />
        },
        {
            step: "4",
            title: "Collaborate & Complete",
            description: "Use real-time chat to communicate, share files, and mark orders as complete.",
            icon: <MessageCircle className="h-8 w-8" />
        }
    ];

    return (
        <>
            <Head title="Anjez Platform - Sudanese Freelance Marketplace" />
            
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="relative z-10 container mx-auto px-4 py-20 text-center">
                    <Badge variant="secondary" className="mb-6">
                        🚀 منصة سودانية للعمل الحر
                    </Badge>
                    
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        Anjez Platform
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                        منصة العمل الحر الأولى في السودان - ربط العملاء بالمحترفين
                        <br />
                        <span className="text-lg">Sudan's Premier Freelance Marketplace - Connecting Clients with Professionals</span>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <Button size="lg" className="text-lg px-8 py-3">
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={route('register')}>
                                    <Button size="lg" className="text-lg px-8 py-3">
                                        Join as Freelancer
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href={route('login')}>
                                    <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Free registration</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Secure payments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Real-time chat</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Simple steps to connect clients with talented freelancers in Sudan
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((step, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                                        {step.icon}
                                    </div>
                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                                        {step.step}
                                    </div>
                                    <CardTitle className="text-xl">{step.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {step.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Why Choose Anjez Platform?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Built specifically for the Sudanese market with local payment methods and cultural understanding
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            What Our Users Say
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Join thousands of satisfied freelancers and clients in Sudan
                        </p>
                    </div>
                    
                    <Carousel className="w-full max-w-4xl mx-auto">
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index}>
                                    <Card className="text-center p-8">
                                        <CardContent className="p-0">
                                            <div className="flex justify-center mb-4">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic">
                                                "{testimonial.content}"
                                            </p>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {testimonial.name}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </section>

            {/* Services Preview */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Popular Services
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Find talented freelancers for all your needs
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-xl">Content Writing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    Professional content creation, translation, and copywriting services
                                </CardDescription>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                                    <Zap className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-xl">Web Development</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    Custom websites, web applications, and digital solutions
                                </CardDescription>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                                    <Users className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-xl">Graphic Design</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    Logo design, branding, and visual content creation
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to Start Your Freelance Journey?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join Sudan's fastest-growing freelance platform. Connect with clients or find talented professionals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={route('register')}>
                                    <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                                        Join as Freelancer
                                    </Button>
                                </Link>
                                <Link href={route('login')}>
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Anjez Platform</h3>
                            <p className="text-gray-400">
                                Sudan's premier freelance marketplace connecting talented professionals with clients.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">For Freelancers</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Create Profile</a></li>
                                <li><a href="#" className="hover:text-white">List Services</a></li>
                                <li><a href="#" className="hover:text-white">Wallet & Payments</a></li>
                                <li><a href="#" className="hover:text-white">Success Tips</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">For Clients</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Browse Services</a></li>
                                <li><a href="#" className="hover:text-white">How to Order</a></li>
                                <li><a href="#" className="hover:text-white">Payment Guide</a></li>
                                <li><a href="#" className="hover:text-white">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Help Center</a></li>
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white">FAQ</a></li>
                                <li><a href="#" className="hover:text-white">Terms & Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                    <Separator className="my-8 bg-gray-800" />
                    <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
                        <p>&copy; 2024 Anjez Platform. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white">Privacy Policy</a>
                            <a href="#" className="hover:text-white">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
} 