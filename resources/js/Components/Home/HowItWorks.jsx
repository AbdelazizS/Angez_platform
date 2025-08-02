import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/lib/useLanguageChange';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowRight,
    Sparkles,
    CheckCircle,
    Search,
    FileText,
    CreditCard,
    Users,
    Briefcase
} from 'lucide-react';

export default function HowItWorks() {
    const { t } = useTranslation();
    const { isRTL, currentLanguage } = useLanguageChange();

    const steps = [
        {
            key: 'step1',
            icon: <Search className="w-10 h-10" />,
            details: [
                t('howItWorks.steps.step1.details.0', 'Browse service categories'),
                t('howItWorks.steps.step1.details.1', 'Search for specific skills'),
                t('howItWorks.steps.step1.details.2', 'View freelancer profiles'),
                t('howItWorks.steps.step1.details.3', 'Compare ratings and reviews')
            ]
        },
        {
            key: 'step2',
            icon: <FileText className="w-10 h-10" />,
            details: [
                t('howItWorks.steps.step2.details.0', 'Describe your project needs'),
                t('howItWorks.steps.step2.details.1', 'Set budget and timeline'),
                t('howItWorks.steps.step2.details.2', 'Upload project files'),
                t('howItWorks.steps.step2.details.3', 'Review and submit')
            ]
        },
        {
            key: 'step3',
            icon: <CreditCard className="w-10 h-10" />,
            details: [
                t('howItWorks.steps.step3.details.0', 'Secure payment processing'),
                t('howItWorks.steps.step3.details.1', 'Milestone-based payments'),
                t('howItWorks.steps.step3.details.2', 'Quality guarantee'),
                t('howItWorks.steps.step3.details.3', 'Satisfaction guarantee')
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2
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
        <section className="relative py-32 overflow-hidden rtl  bg-gradient-to-br rtl:bg-gradient-to-bl from-background to-primary/5 rtl dark:bg-background">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.015)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.015)_1px,transparent_0)] bg-[length:35px_35px]" />
                <div className="absolute top-0 end-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute bottom-0 end-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
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
                            <Sparkles className="w-4 h-4 me-2 rtl:ms-2 rtl:me-0" />
                            {t('howItWorks.badge', 'Simple Process')}
                        </Badge>
                    </motion.div>
                    
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight tracking-tight">
                        {t('howItWorks.title', 'How It Works')}
                        <br />
                        <span className="text-primary">
                            {t('howItWorks.titleHighlight', 'In 3 Easy Steps')}
                        </span>
                    </h2>
                    
                    <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                        {t('howItWorks.subtitle', 'Get your project completed quickly and efficiently with our streamlined process. From finding services to payment, we\'ve made it simple for both clients and freelancers.')}
                    </p>
                </motion.div>

                {/* Steps - One time staggered animation */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-20"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={`${step.key}-${currentLanguage}`}
                            variants={itemVariants}
                            className="relative group"
                        >
                            {/* Step Number */}
                            <div className="absolute -top-4 -end-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-lg z-10">
                                {index + 1}
                            </div>

                            {/* Step Card */}
                            <div className="relative p-8 lg:p-10 bg-card rounded-3xl border border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col group-hover:-translate-y-2">
                                {/* Icon */}
                                <div className="mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                                        {t(`howItWorks.steps.${step.key}.title`, 'Step Title')}
                                    </h3>
                                    
                                    <ul className="space-y-3">
                                        {step.details.map((detail, detailIndex) => (
                                            <li key={detailIndex} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                                <span className="text-muted-foreground text-sm">
                                                    {detail}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 rounded-3xl bg-primary/0 group-hover:bg-primary/5 transition-all duration-500" />
                            </div>

                            {/* Connecting Arrow (except for last step) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -end-6 transform -translate-y-1/2 z-20">
                                    <ArrowRight className="w-8 h-8 text-primary rtl:rotate-180" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center bg-card rounded-3xl p-8 lg:p-12 border border-border"
                >
                    <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        {t('howItWorks.cta.title', 'Ready to Get Started?')}
                    </h3>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        {t('howItWorks.cta.subtitle', 'Join thousands of satisfied clients and freelancers on our platform')}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                    </div>
                </motion.div>
            </div>
        </section>
    );
}