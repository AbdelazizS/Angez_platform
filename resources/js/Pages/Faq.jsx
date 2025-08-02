import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Home/Navbar";
import Footer from "@/Components/Home/Footer";
import { useTranslation } from "react-i18next";
import { MessageSquare, User, CreditCard, Shield, HelpCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/Components/ui/button";

export default function FAQ({ auth }) {
    const { t } = useTranslation();
    const [activeQuestion, setActiveQuestion] = useState(null);

    const questions = [
        {
            id: 'experience_needed',
            category: 'providers',
            icon: <User className="w-5 h-5 text-primary" />
        },
        {
            id: 'service_security',
            category: 'general',
            icon: <Shield className="w-5 h-5 text-primary" />
        },
        {
            id: 'dispute_resolution',
            category: 'disputes',
            icon: <Shield className="w-5 h-5 text-primary" />
        },
        {
            id: 'payment_methods',
            category: 'payments',
            icon: <CreditCard className="w-5 h-5 text-primary" />
        },
        {
            id: 'platform_commission',
            category: 'general',
            icon: <HelpCircle className="w-5 h-5 text-primary" />
        },
        {
            id: 'work_not_delivered',
            category: 'clients',
            icon: <User className="w-5 h-5 text-primary" />
        },
        {
            id: 'revisions_policy',
            category: 'clients',
            icon: <User className="w-5 h-5 text-primary" />
        },
        {
            id: 'external_communication',
            category: 'general',
            icon: <HelpCircle className="w-5 h-5 text-primary" />
        },
        {
            id: 'order_process',
            category: 'clients',
            icon: <User className="w-5 h-5 text-primary" />
        }
    ];

    const toggleQuestion = (id) => {
        setActiveQuestion(activeQuestion === id ? null : id);
    };

    return (
        <>
            <Head title={t('faq.title')} />

            <Navbar auth={auth} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/5 to-background py-20 rtl">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                        {t('faq.title')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('faq.description')}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 max-w-4xl rtl">
                {/* Questions List */}
                <div className="space-y-4">
                    {questions.map(({ id, icon }) => {
                        const question = t(`faq.questions.${id}`, { returnObjects: true });
                        return (
                            <div 
                                key={id} 
                                className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <button
                                    className="flex items-center justify-between w-full px-6 py-5 text-left bg-card"
                                    onClick={() => toggleQuestion(id)}
                                >
                                    <div className="flex items-start">
                                        <span className="me-4 mt-0.5">{icon}</span>
                                        <h3 className="text-lg font-medium text-foreground">
                                            {question.question}
                                        </h3>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-muted-foreground transform transition-transform ${activeQuestion === id ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {activeQuestion === id && (
                                    <div className="px-6 pb-5 pt-0 bg-card">
                                        <p className="text-muted-foreground pl-9">{question.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Contact CTA */}
                <div className="mt-20 bg-primary/5 rounded-2xl p-8 md:p-12 text-center border border-border">
                    <h3 className="text-2xl font-bold mb-3 text-foreground">
                        {t('faq.contact_cta.heading')}
                    </h3>
                    <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                        {t('faq.contact_cta.description')}
                    </p>
                    <Link 
                        href={route('contact')}
                    >

                        <Button>

                        {t('faq.contact_cta.button')}
                        <ArrowRight className="ms-2 rtl:rotate-180 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>

            <Footer />
        </>
    );
}