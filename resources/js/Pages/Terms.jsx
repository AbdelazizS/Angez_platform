import { Head, Link } from "@inertiajs/react";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import { useTranslation } from "react-i18next";
import { FileText, Mail, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Terms({ auth }) {
    const { t } = useTranslation();
    const lastUpdated = new Date().getFullYear();

    return (
        <>
            <Head title={t('terms.title')} />

            <Navbar auth={auth} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/5 to-background py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <FileText className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            {t('terms.title')}
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('terms.description')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                        {t('terms.last_updated', { date: lastUpdated })}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="space-y-8">
                    {/* Introduction */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('terms.sections.introduction.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('terms.sections.introduction.content')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Definitions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('terms.sections.definitions.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3    ">
                                {t('terms.sections.definitions.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Registration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('terms.sections.registration.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3    ">
                                {t('terms.sections.registration.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Usage */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('terms.sections.usage.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3    ">
                                {t('terms.sections.usage.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Payments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('terms.sections.payments.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3    ">
                                {t('terms.sections.payments.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Intellectual Property */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('terms.sections.intellectual_property.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3    ">
                                {t('terms.sections.intellectual_property.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Liability */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('terms.sections.liability.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3    ">
                                {t('terms.sections.liability.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Changes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('terms.sections.changes.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('terms.sections.changes.content')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Refunds */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('terms.sections.refunds.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 ">
                                {t('terms.sections.refunds.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                  
                    {/* CTA */}
                    <div className="bg-primary/5 rounded-xl p-8 text-center border border-border">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <HelpCircle className="h-8 w-8 text-primary" />
                            <h3 className="text-2xl font-bold text-foreground">
                                {t('terms.cta.heading')}
                            </h3>
                        </div>
                        <p className="text-lg text-muted-foreground mb-6">
                            {t('terms.cta.description')}
                        </p>
                        <Button asChild>
                            <Link href="/contact">
                                {t('terms.cta.button')}
                                <Mail className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}