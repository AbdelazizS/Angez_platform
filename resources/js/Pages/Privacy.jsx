import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Home/Navbar";
import Footer from "@/Components/Home/Footer";
import { useTranslation } from "react-i18next";
import { Shield, Mail, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Privacy({ auth }) {
    const { t } = useTranslation();
    const lastUpdated = new Date().getFullYear();

    return (
        <>
            <Head title={t('privacy.title')} />

            <Navbar auth={auth} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/5 to-background py-20 rtl">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center  flex-row-reverse gap-4 mb-4">
                        <Shield className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            {t('privacy.title')}
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('privacy.description')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                        {t('privacy.last_updated', { date: lastUpdated })}
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
                                {t('privacy.sections.introduction.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('privacy.sections.introduction.content')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Information Collected */}
                    <Card >
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('privacy.sections.information_collected.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 rtl">
                                {t('privacy.sections.information_collected.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Information Use */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('privacy.sections.information_use.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 ">
                                {t('privacy.sections.information_use.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index} className="text-muted-foreground ">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Protection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('privacy.sections.protection.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('privacy.sections.protection.content')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Sharing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('privacy.sections.sharing.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('privacy.sections.sharing.content')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Cookies */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('privacy.sections.cookies.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('privacy.sections.cookies.content')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Rights */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('privacy.sections.rights.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('privacy.sections.rights.content')}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Changes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {t('privacy.sections.changes.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {t('privacy.sections.changes.content')}
                            </p>
                        </CardContent>
                    </Card>

                
                    {/* CTA */}
                    <div className="bg-primary/5 rounded-xl p-8 text-center border border-border">
                        <div className="flex items-center justify-center  flex-row-reverse gap-3 mb-4">
                            <HelpCircle className="h-8 w-8 text-primary" />
                            <h3 className="text-2xl font-bold text-foreground">
                                {t('privacy.cta.heading')}
                            </h3>
                        </div>
                        <p className="text-lg text-muted-foreground mb-6">
                            {t('privacy.cta.description')}
                        </p>
                        <Button asChild>
                            <Link href="/contact">
                                {t('privacy.cta.button')}
                            <Mail className="h-4 w-4  mr-2  ml-0 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}