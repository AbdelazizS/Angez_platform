import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Home/Navbar";
import Footer from "@/Components/Home/Footer";
import { useTranslation } from "react-i18next";
import { Shield, Mail, HelpCircle, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Rights({ auth }) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('rights.title')} />

            <Navbar auth={auth} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/5 to-background py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <Shield className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            {t('rights.title')}
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('rights.description')}
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
                                {t('rights.introduction.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('rights.introduction.content')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Provider Rights */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">
                                {t('rights.provider_rights.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3     pl-6">
                                {t('rights.provider_rights.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Provider Responsibilities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">
                                {t('rights.provider_responsibilities.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3     pl-6">
                                {t('rights.provider_responsibilities.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Client Rights */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">
                                {t('rights.client_rights.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3     pl-6">
                                {t('rights.client_rights.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Client Responsibilities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">
                                {t('rights.client_responsibilities.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3     pl-6">
                                {t('rights.client_responsibilities.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Platform Commitments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">
                                {t('rights.platform_commitments.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3     pl-6">
                                {t('rights.platform_commitments.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('rights.tips.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('rights.tips.content')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* CTA */}
                    <div className="bg-primary/5 rounded-xl p-8 text-center border border-border">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <HelpCircle className="h-8 w-8 text-primary" />
                            <h3 className="text-2xl font-bold text-foreground">
                                {t('rights.cta.heading')}
                            </h3>
                        </div>
                        <p className="text-lg text-muted-foreground mb-6">
                            {t('rights.cta.description')}
                        </p>
                        <Button asChild>
                            <Link href="/contact">
                                {t('rights.cta.button')}
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