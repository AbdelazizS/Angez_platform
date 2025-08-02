import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/lib/useLanguageChange';
import { 
    Shield, 
    Users, 
    Globe, 
    DollarSign,
    Award,
    Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Features() {
    const { t } = useTranslation();
    const { isRTL, currentLanguage } = useLanguageChange();

    const features = [
        {
            icon: Shield,
            title: t('features.verified.title', 'Verified Professionals'),
            description: t('features.verified.description', 'Every freelancer is thoroughly vetted with identity verification and skill assessments.'),
            highlight: t('features.verified.highlight', '100% Verified')
        },
        {
            icon: Users,
            title: t('features.community.title', 'Local Community'),
            description: t('features.community.description', 'Connect with Sudanese talent who understand your culture, language, and business needs.'),
            highlight: t('features.community.highlight', 'Sudanese Focus')
        },
        {
            icon: Globe,
            title: t('features.global.title', 'Global Standards'),
            description: t('features.global.description', 'Access world-class quality while supporting local talent with international payment methods.'),
            highlight: t('features.global.highlight', 'Global Quality')
        }
    ];

    const benefits = [
        {
            icon: DollarSign,
            title: t('benefits.cost.title', 'Competitive Pricing'),
            description: t('benefits.cost.description', 'Get quality work at local market rates without compromising on standards.')
        },
        {
            icon: Award,
            title: t('benefits.quality.title', 'Quality Guarantee'),
            description: t('benefits.quality.description', 'All work comes with a satisfaction guarantee and revision policy.')
        },
        {
            icon: Shield,
            title: t('benefits.security.title', 'Secure Payments'),
            description: t('benefits.security.description', 'Your payments are protected with escrow and only released when you\'re satisfied.')
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="relative py-32 bg-background overflow-hidden rtl">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[length:24px_24px]" />
            
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
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
                            {t('features.badge', 'Why Choose Us')}
                        </Badge>
                    </motion.div>
                    
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight tracking-tight">
                        {t('features.title', 'Built for Sudanese')}
                        <br />
                        <span className="text-primary">
                            {t('features.titleHighlight', 'Freelancers & Clients')}
                        </span>
                    </h2>
                    
                    <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                        {t('features.subtitle', 'A platform designed specifically for the Sudanese market, combining local expertise with global standards.')}
                    </p>
                </motion.div>

                {/* Main Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-32"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={`${feature.title}-${currentLanguage}`}
                            variants={itemVariants}
                            className="group relative"
                        >
                            <div className="relative p-8 lg:p-10 bg-card rounded-3xl border border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col group-hover:-translate-y-2">
                                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                                    <feature.icon className="w-8 h-8" />
                                </div>

                                <Badge 
                                    variant="outline" 
                                    className="mb-6 text-xs font-semibold border-primary/20 text-primary self-start px-3 py-1 rounded-full bg-primary/5"
                                >
                                    {feature.highlight}
                                </Badge>

                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="absolute inset-0 rounded-3xl bg-primary/0 group-hover:bg-primary/5 transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Benefits Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="grid md:grid-cols-3 gap-8 lg:gap-12"
                >
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={`${benefit.title}-${currentLanguage}`}
                            variants={itemVariants}
                            className="text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                                <benefit.icon className="w-10 h-10" />
                            </div>
                            
                            <h4 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                                {benefit.title}
                            </h4>
                            
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}