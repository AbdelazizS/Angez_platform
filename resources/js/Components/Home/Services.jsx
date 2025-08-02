import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/lib/useLanguageChange';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowRight,
    Sparkles,
    TrendingUp,
    Users,
    Code,
    PenTool,
    Type,
    BarChart2,
    Languages,
    Film,
    Smartphone,
    Database
} from 'lucide-react';

export default function Services() {
    const { t } = useTranslation();
    const { isRTL, currentLanguage } = useLanguageChange();

    const services = [
        {
            key: 'webDevelopment',
            icon: <Code className="w-8 h-8" />,
            color: 'text-primary'
        },
        {
            key: 'graphicDesign',
            icon: <PenTool className="w-8 h-8" />,
            color: 'text-primary'
        },
        {
            key: 'contentWriting',
            icon: <Type className="w-8 h-8" />,
            color: 'text-primary'
        },
        {
            key: 'digitalMarketing',
            icon: <BarChart2 className="w-8 h-8" />,
            color: 'text-primary'
        },
        {
            key: 'translation',
            icon: <Languages className="w-8 h-8" />,
            color: 'text-primary'
        },
        {
            key: 'videoEditing',
            icon: <Film className="w-8 h-8" />,
            color: 'text-primary'
        },
        {
            key: 'mobileDevelopment',
            icon: <Smartphone className="w-8 h-8" />,
            color: 'text-primary'
        },
        {
            key: 'dataEntry',
            icon: <Database className="w-8 h-8" />,
            color: 'text-primary'
        }
    ];

    // Single animation variants for one-time use
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="relative py-32 overflow-hidden rtl">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[length:30px_30px]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - One time animation */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <Badge 
                            variant="secondary" 
                            className="text-sm font-semibold bg-primary text-primary-foreground border-0 px-4 py-2 rounded-full shadow-lg"
                        >
                            <Sparkles className="w-4 h-4 me-2" />
                            {t('services.badge', 'Our Services')}
                        </Badge>
                    </motion.div>
                    
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight">
                        {t('services.title', 'Explore Popular')}
                        <br />
                        <span className="text-primary">
                            {t('services.titleHighlight', 'Freelance Categories')}
                        </span>
                    </h2>
                    
                    <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                        {t('services.subtitle', 'Discover talented Sudanese professionals across diverse categories. From creative design to technical development, find the perfect match for your project.')}
                    </p>
                </motion.div>

                {/* Services Grid - One time staggered animation */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16"
                >
                    {services.map((service) => (
                        <motion.div
                            key={`${service.key}-${currentLanguage}`}
                            variants={itemVariants}
                            className="group relative"
                        >
                            <div className="relative p-6 lg:p-8 bg-card rounded-2xl border border-border hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col group-hover:-translate-y-2">
                                {services.indexOf(service) < 3 && (
                                    <Badge 
                                        variant="outline" 
                                        className="mb-4 text-xs font-semibold border-success/30 text-success dark:border-success/40 dark:text-success/80 self-start px-3 py-1 rounded-full bg-success/10 absolute top-4 end-4"
                                    >
                                        <TrendingUp className="w-3 h-3 me-2" />
                                        {t('services.popular', 'Popular')}
                                    </Badge>
                                )}

                                <div className={`mb-4 group-hover:scale-110 transition-transform duration-300 ${service.color}`}>
                                    {service.icon}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                                        {t(`services.categories.${service.key}.title`, service.key)}
                                    </h3>
                                    
                                    <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                                        {t(`services.categories.${service.key}.description`, 'Professional service description')}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        <span>{t('services.freelancerCount', '50+ Freelancers')}</span>
                                    </div>
                                </div>

                                <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/5 transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                >
                    <Link href={route('services.index')}>
                        <Button 
                            size="lg" 
                            className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                        >
                            {t('services.viewAll', 'View All Services')}
                            <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}