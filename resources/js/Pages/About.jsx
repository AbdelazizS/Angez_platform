import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Home/Navbar";
import Footer from "@/Components/Home/Footer";
import { useTranslation } from "react-i18next";
import { 
    Globe, 
    Shield, 
    Zap, 
    Award,
    Users,
    Briefcase,
    Search,
    MessageSquare,
    CheckCircle,
    ArrowRight,
    Sparkles,
    BarChart2,
    Clock,
    HeartHandshake
} from 'lucide-react';
import { motion } from "framer-motion";
import { Badge } from "@/Components/ui/badge";

export default function About({ auth }) {
    const { t } = useTranslation();
    
    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <>
            <Head title={t('about.title')} />

            <Navbar auth={auth} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-background via-primary/5 to-primary/10 py-28 rtl">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.03)_1px,_transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)]" />
                </div>
                
                <div className="container mx-auto px-4 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                            <Sparkles className="w-4 h-4 me-2" />
                            {t('about.hero.badge')}
                        </Badge>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold mb-4 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                    >
                        {t('about.hero.heading')}
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                    >
                        {t('about.hero.subheading')}
                    </motion.p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Our Story */}
                <motion.section 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={container}
                    className="mb-28 grid md:grid-cols-2 gap-16 items-center"
                >
                    <motion.div variants={item} className="space-y-6">
                        <div className="inline-flex items-center gap-3 text-primary font-medium">
                            <div className="w-8 h-px bg-primary" />
                            {t('about.sections.our_story.subtitle')}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            {t('about.sections.our_story.title')}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {t('about.sections.our_story.content')}
                        </p>
                        
                    </motion.div>
                    
                    <motion.div variants={item} className="relative">
                        <div className="bg-primary/5 rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
                            <Globe className="w-12 h-12 mb-6 text-primary" />
                            <h3 className="text-2xl font-semibold mb-4">
                                {t('about.sections.mission.title')}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('about.sections.mission.content')}
                            </p>
                        </div>
                        <div className="absolute -z-10 inset-0 bg-primary/5 rounded-2xl translate-x-6 translate-y-6"></div>
                    </motion.div>
                </motion.section>

                {/* Values */}
                <motion.section 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={container}
                    className="mb-28"
                >
                    <motion.div variants={item} className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 text-primary font-medium mb-4">
                            <div className="w-8 h-px bg-primary" />
                            {t('about.sections.values.subtitle')}
                            <div className="w-8 h-px bg-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {t('about.sections.values.title')}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('about.sections.values.description')}
                        </p>
                    </motion.div>
                    
                    <motion.div variants={container} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {t('about.sections.values.items', { returnObjects: true }).map((value, index) => (
                            <motion.div 
                                key={index} 
                                variants={item}
                                className="bg-card p-8 rounded-xl border border-border/50 hover:border-primary/30 transition-all group hover:-translate-y-2"
                            >
                                <div className="flex items-center mb-6 gap-4">
                                    <div className={`p-3 rounded-lg ${index === 0 ? 'bg-blue-100/50 text-blue-600' : 
                                                      index === 1 ? 'bg-purple-100/50 text-purple-600' : 
                                                      index === 2 ? 'bg-green-100/50 text-green-600' : 
                                                      'bg-amber-100/50 text-amber-600'}`}>
                                        {index === 0 && <Shield className="w-6 h-6" />}
                                        {index === 1 && <Zap className="w-6 h-6" />}
                                        {index === 2 && <Users className="w-6 h-6" />}
                                        {index === 3 && <Award className="w-6 h-6" />}
                                    </div>
                                    <h3 className="text-xl font-semibold">{value.title}</h3>
                                </div>
                                <p className="text-muted-foreground">{value.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                {/* How It Works */}
                <motion.section 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={container}
                    className="mb-28"
                >
                    <motion.div variants={item} className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 text-primary font-medium mb-4">
                            <div className="w-8 h-px bg-primary" />
                            {t('about.sections.how_it_works.subtitle')}
                            <div className="w-8 h-px bg-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {t('about.sections.how_it_works.title')}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('about.sections.how_it_works.description')}
                        </p>
                    </motion.div>
                    
                    <motion.div variants={container} className="grid md:grid-cols-4 gap-8">
                        {t('about.sections.how_it_works.steps', { returnObjects: true }).map((step, index) => (
                            <motion.div 
                                key={index} 
                                variants={item}
                                className="text-center"
                            >
                                <div className="relative mb-6">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold text-xl">{index + 1}</span>
                                    </div>
                                    {index < 3 && (
                                        <div className="hidden md:block absolute top-1/2 right-0 left-full w-16 h-px bg-border"></div>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                {/* Stats */}
                <motion.section 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={container}
                    className="mb-28 bg-gradient-to-br from-primary/5 to-background rounded-3xl p-12 border border-border/50"
                >
                    <motion.div variants={item} className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {t('about.sections.stats.title')}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('about.sections.stats.description')}
                        </p>
                    </motion.div>
                    
                    <motion.div variants={container} className="grid md:grid-cols-4 gap-8">
                        {t('about.sections.stats.items', { returnObjects: true }).map((stat, index) => (
                            <motion.div 
                                key={index} 
                                variants={item}
                                className="text-center"
                            >
                                <p className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                    {stat.value}
                                </p>
                                <p className="text-lg text-muted-foreground">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                {/* CTA */}
                <motion.section 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-28"
                >
                    <div className="bg-gradient-to-br from-primary/5 to-background rounded-3xl p-12 border border-border/50">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {t('about.cta.heading')}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                            {t('about.cta.description')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link 
                                href={route('register')} 
                                className="bg-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                            >
                                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                {t('about.cta.buttons.join')}
                            </Link>
                            <Link 
                                href={route('contact')} 
                                className="border border-primary text-primary px-8 py-4 rounded-lg font-medium hover:bg-primary/5 transition-colors inline-flex items-center justify-center gap-2"
                            >
                                {t('about.cta.buttons.contact')}
                                <MessageSquare className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </motion.section>

                {/* Policy Links */}
                <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="border-t border-border/50 pt-12"
                >
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href={route('faq')} className="flex items-center text-muted-foreground hover:text-primary transition-colors gap-2">
                            <MessageSquare className="w-4 h-4" />
                            {t('about.links.faq')}
                        </Link>
                        <Link href={route('privacy')} className="flex items-center text-muted-foreground hover:text-primary transition-colors gap-2">
                            <Shield className="w-4 h-4" />
                            {t('about.links.privacy')}
                        </Link>
                        <Link href={route('terms')} className="flex items-center text-muted-foreground hover:text-primary transition-colors gap-2">
                            <Briefcase className="w-4 h-4" />
                            {t('about.links.terms')}
                        </Link>
                        <Link href={route('rights')} className="flex items-center text-muted-foreground hover:text-primary transition-colors gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {t('about.links.rights')}
                        </Link>
                    </div>
                </motion.section>
            </div>

            <Footer />
        </>
    );
}