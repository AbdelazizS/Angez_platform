import { useState, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    ArrowRight, 
    Shield,
    Zap,
    Code,
    Paintbrush,
    Film,
    GraduationCap,
    Smartphone
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/lib/useLanguageChange';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero({ auth }) {
    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef(null);
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/services', {
                search: searchQuery,
                page: 1
            });
        }
    };

    const popularServices = [
        { key: 'webDevelopment', icon: <Code className="h-4 w-4" /> },
        { key: 'graphicDesign', icon: <Paintbrush className="h-4 w-4" /> },
        { key: 'videoEditing', icon: <Film className="h-4 w-4" /> },
    ];

    return (
        <section 
            ref={containerRef}
            className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br rtl:bg-gradient-to-bl from-background via-primary/10 to-primary/40 rtl dark:bg-background"
        >
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5 dark:from-primary/10" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />
                
                {/* Animated Background Shapes */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.03, scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-primary/40 to-primary/60 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.03, scale: 1 }}
                    transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
                    className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8  py-24 md:py-32 lg:py-40 xl:py-48">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                    >
                        <span className="text-foreground">
                            {t('hero.headline', 'Find Trusted Sudanese')}
                        </span>
                        <br />
                        <span className="text-primary/70 dark:text-blue-600 font-bold">
                            {t('hero.headline2', 'Freelancers in Seconds')}
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl"
                    >
                        {t('hero.subheading', 'From graphic design to tutoring, get your job done by verified professionals. Join Sudan\'s premier freelance marketplace connecting talent with opportunity.')}
                    </motion.p>

                    {/* Modern Search Bar */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        onSubmit={handleSearch}
                        className="relative mb-8 w-full max-w-2xl"
                    >
                        <div className="relative group">
                            <div className="relative flex items-center bg-background rounded-full shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                                <div className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                
                                <div className="flex-1 ps-12 py-4 min-h-[60px] flex items-center">
                                    <Input
                                        type="text"
                                        placeholder={t('hero.searchPlaceholder', 'Search for freelancers, skills, or services...')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="border-0 bg-transparent text-lg placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none p-0 w-full h-full min-h-[40px]"
                                        style={{ boxShadow: 'none' }}
                                    />
                                </div>
                                
                                <div className="px-4 py-2">
                                    <Button
                                        type="submit"
                                        className="bg-primary/80 hover:bg-primary text-white rounded-full px-6 py-2 transition-all duration-300 font-medium text-sm"
                                    >
                                        {t('hero.search', 'Search')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Quick Search Suggestions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                            className="flex  items-center gap-3 mt-6 justify-center"
                        >
                            {/* <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    {t('hero.popular', 'Popular')}:
                                </span>
                            </div> */}
                            
                            <div className="flex flex-wrap gap-2">
                                {popularServices.map((service, index) => (
                                    <motion.button
                                        key={service.key}
                                        type="button"
                                        onClick={() => {
                                            // setSearchQuery(t(`hero.popularServices.${service.key}`, service.key));
                                            // router.get('/services', {
                                            //     search: t(`hero.popularServices.${service.key}`, service.key),
                                            //     page: 1
                                            // });
                                        }}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                                        className="group flex items-center gap-2 text-sm bg-card px-4 py-2 rounded-full transition-all duration-300 border shadow-sm hover:shadow-md"
                                    >
                                        <span className="text-primary">
                                            {service.icon}
                                        </span>
                                        <span className="font-medium">
                                            {t(`hero.popularServices.${service.key}`, service.key)}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.form>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                    >
                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <Button 
                                    size="lg" 
                                    className="w-full sm:w-auto text-lg px-8 py-4 bg-primary/60 hover:bg-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                                >
                                    {t('hero.goToDashboard', 'Go to Dashboard')}
                                    <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={route('services.index')}>
                                    <Button 
                                        size="lg" 
                                        className="w-full sm:w-auto text-lg px-8 py-4 bg-primary shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                                    >
                                        {t('hero.startExploring', 'Start Exploring')}
                                        <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
                                    </Button>
                                </Link>
                                <Link href={route('register')}>
                                    <Button 
                                        variant="outline" 
                                        size="lg" 
                                        className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-border font-semibold"
                                    >
                                        {t('nav.joinAsFreelancer')}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                        className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
                    >
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-500" />
                            <span>{t('hero.trustIndicator2', 'Secure Payments')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span>{t('hero.trustIndicator3', '24/7 Support')}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}