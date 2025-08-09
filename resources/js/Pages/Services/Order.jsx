import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    CheckCircle, 
    CreditCard, 
    Lock, 
    Shield, 
    Clock, 
    FileText,
    AlertCircle,
    Star,
    MapPin,
    Calendar,
    DollarSign,
    MessageSquare,
    Upload,
    Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/lib/useLanguageChange';
import Navbar from '@/components/Home/Navbar';
import Footer from '@/components/Home/Footer';

export default function ServiceOrder({ service, selectedPackage, auth }) {
    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();
    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    
    // Get query string
    const location = typeof window !== 'undefined' ? window.location : { search: '' };
    // Update query string
    function updateQueryString(pkgName) {
        if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `?package=${encodeURIComponent(pkgName)}`);
        }
    }
    // Determine if service has packages
    const hasPackages = Array.isArray(service.packages) && service.packages.length > 0;
    // Helper to parse price as integer
    function parsePrice(val) {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseInt(val.replace(/[^\d]/g, ''), 10) || 0;
        return 0;
    }
    // Helper to robustly get delivery time and revisions from package
    function getPackageDeliveryTime(pkg) {
        return pkg.delivery_time || pkg.deliveryTime || '-';
    }
    function getPackageRevisions(pkg) {
        return pkg.revisions || '-';
    }
    function getPackageFeatures(pkg) {
        if (Array.isArray(pkg.features)) return pkg.features;
        if (typeof pkg.features === 'string') {
            try {
                const arr = JSON.parse(pkg.features);
                if (Array.isArray(arr)) return arr;
            } catch {}
        }
        return [];
    }
    // Helper to get package from query string
    function getPackageFromQuery() {
        const params = new URLSearchParams(location.search);
        const pkgName = params.get('package');
        if (hasPackages && pkgName) {
            const pkg = service.packages.find(p => p.name === pkgName);
            if (pkg) {
                return { ...pkg, price: parsePrice(pkg.price) };
            }
        }
        return null;
    }
    // Initial selected package
    const initialPackage = getPackageFromQuery() || (selectedPackage ? { ...selectedPackage, price: parsePrice(selectedPackage.price) } : service.packages?.find(p => p.isPopular) ? { ...service.packages.find(p => p.isPopular), price: parsePrice(service.packages.find(p => p.isPopular).price) } : service.packages?.[0] ? { ...service.packages[0], price: parsePrice(service.packages[0].price) } : { name: 'Standard', price: parsePrice(service.price), deliveryTime: service.delivery_time, revisions: service.revisions, features: service.features || [] });
    const [selectedPackageState, setSelectedPackageState] = useState(initialPackage);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        package_name: selectedPackageState?.name || '',
        package_price: selectedPackageState?.price || 0,
        requirements: '',
        additional_notes: '',
        agree_to_terms: false
    });

    // Requirements as dynamic list
    const [requirements, setRequirements] = useState(() => {
        let reqs = (selectedPackageState && selectedPackageState.requirements) || (service && service.requirements) || [''];
        if (typeof reqs === 'string') reqs = [reqs];
        if (!Array.isArray(reqs) || reqs.length === 0) reqs = [''];
        return reqs;
    });

    // Update requirements in form data whenever requirements state changes
    useEffect(() => {
        setData('requirements', requirements.filter(r => r.trim() !== ''));
    }, [requirements]);

    // Add new requirement field
    const addRequirement = () => {
        setRequirements([...requirements, '']);
    };

    // Remove a requirement field
    const removeRequirement = (idx) => {
        setRequirements(requirements.filter((_, i) => i !== idx));
    };

    // Update a requirement
    const updateRequirement = (idx, value) => {
        setRequirements(requirements.map((r, i) => i === idx ? value : r));
    };

    // Custom formatter for SDG: ج.س. for Arabic, SDG for English
    const formatPrice = (price) => {
        const safePrice = typeof price === 'number' && !isNaN(price) ? price : 0;
        if (currentLang === 'ar') {
            let formatted = new Intl.NumberFormat('ar-EG', {
                style: 'currency',
                currency: 'SDG',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(safePrice);
            formatted = formatted.replace(/SDG|ج\.س\.|ج\. س\.|جنيه سوداني|SD£|£SD|\u0633\u002e|\u062c\u002e\u0633\u002e|\u062c\u002e\u0020\u0633\u002e/gi, 'ج.س.');
            if (!formatted.includes('ج.س.')) {
                formatted = `ج.س. ${formatted.replace(/[^\d.,٬]+/g, '').trim()}`;
            }
            return formatted;
        } else {
            let formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'SDG',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
                currencyDisplay: 'code',
            }).format(safePrice);
            // Ensure SDG is at the start
            formatted = formatted.replace(/SDG|ج\.س\.|ج\. س\.|جنيه سوداني|SD£|£SD|\u0633\u002e|\u062c\u002e\u0633\u002e|\u062c\u002e\u0020\u0633\u002e/gi, 'SDG');
            if (!formatted.startsWith('SDG')) {
                formatted = `SDG ${formatted.replace(/[^\d.,]+/g, '').trim()}`;
            }
            return formatted;
        }
    };

    const handlePackageSelect = (pkg) => {
        const parsedPkg = { ...pkg, price: parsePrice(pkg.price) };
        setSelectedPackageState(parsedPkg);
        setData({
            ...data,
            package_name: parsedPkg.name,
            package_price: parsedPkg.price
        });
        updateQueryString(parsedPkg.name);
    };

    // On mount, update state if query string changes
    useEffect(() => {
        const pkg = getPackageFromQuery();
        if (pkg && pkg.name !== selectedPackageState?.name) {
            setSelectedPackageState(pkg);
            setData({
                ...data,
                package_name: pkg.name,
                package_price: pkg.price
            });
        }
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agreeToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }
        setIsProcessing(true);
        post(`/services/${service.id}/order`, {
            data: {
                ...data,
                package_price: parsePrice(selectedPackageState.price)
            },
            onSuccess: () => {},
            onError: () => {
                setIsProcessing(false);
            }
        });
    };

    const calculateFees = () => {
        const basePrice = parsePrice(selectedPackageState.price) || parsePrice(service.price);
        const serviceFee = 0; // No service fee
        const total = basePrice;
        return { serviceFee, total };
    };

    const { serviceFee, total } = calculateFees();

    // Helper to get best available array field (for features, packages, etc.)
    const getArrayField = (obj, field, lang = currentLang) => {
      if (lang === 'ar' && Array.isArray(obj[`${field}_ar`]) && obj[`${field}_ar`].length > 0) {
        return obj[`${field}_ar`];
      }
      return obj[field] || [];
    };
    // Helper to get best available field (for title, description, etc.)
    const getField = (obj, field, lang = currentLang) => {
      if (lang === 'ar') return obj[`${field}_ar`] || obj[field] || '';
      return obj[field] || '';
    };

    const features = getArrayField(service, 'features', currentLang);
    const packages = getArrayField(service, 'packages', currentLang);
    // const hasPackages = Array.isArray(packages) && packages.length > 0;
    const serviceTitle = getField(service, 'title', currentLang);
    const serviceDescription = getField(service, 'description', currentLang);

    return (
        <>
            <Head title={`Order - ${service.title}`} />
            <Navbar auth={auth} />
            
            <div className="min-h-screen bg-background rtl">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link 
                            href={`/services/${service.id}`}
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180" />
                            {t('servicesOrder.backToService', 'Back to Service')}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Order Form */}
                        <div className="lg:col-span-2 ">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Receipt className="w-5 h-5" />
                                        {t('servicesOrder.orderDetails', 'Order Details')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Package Selection or Base Price */}
                                        {hasPackages ? (
                                        <div>
                                            <Label className="text-base font-medium">{t('servicesOrder.selectPackage', 'Select Package')}</Label>
                                            <RadioGroup
                                                value={selectedPackageState?.name || ''}
                                                onValueChange={(value) => {
                                                    const pkg = packages.find(p => getField(p, 'name', currentLang) === value);
                                                    if (pkg) handlePackageSelect(pkg);
                                                }}
                                                className="mt-3 rtl"
                                            >
                                                <div className="space-y-3">
                                                    {packages.map((pkg, index) => (
                                                            <Label 
                                                            key={index}
                                                                htmlFor={`package-${index}`}
                                                                className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                                selectedPackageState?.name === getField(pkg, 'name', currentLang)
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-border hover:border-border'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="font-semibold text-lg">{getField(pkg, 'name', currentLang)}</h3>
                                                                        {pkg.isPopular && (
                                                                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                                                                {t('servicesOrder.popular', 'Popular')}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-2xl font-bold text-primary mt-2">
                                                                            {formatPrice(parsePrice(pkg.price))}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground mt-1">
                                                                            {t('servicesOrder.deliveryIn', 'Delivery in')} {getField(pkg, 'delivery_time', currentLang) || getField(pkg, 'deliveryTime', currentLang) || '-'}
                                                                    </p>
                                                                </div>
                                                                <RadioGroupItem
                                                                    value={getField(pkg, 'name', currentLang)}
                                                                        id={`package-${index}`}
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                                {getArrayField(pkg, 'features', currentLang).length > 0 && (
                                                                <div className="mt-4">
                                                                    <ul className="space-y-2">
                                                                            {getArrayField(pkg, 'features', currentLang).map((feature, featureIndex) => (
                                                                            <li key={featureIndex} className="flex items-center gap-2 text-sm">
                                                                                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                                                                                {feature}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            </Label>
                                                        ))}
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        ) : (
                                            <div>
                                                <Label className="text-base font-medium">{t('servicesOrder.servicePrice', 'Service Price')}</Label>
                                                <div className="border-2 rounded-lg p-4 bg-primary/5 border-primary">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-lg">{t('servicesOrder.standard', 'Standard')}</h3>
                                                            <p className="text-2xl font-bold text-primary mt-2">
                                                                {formatPrice(service.price)}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {t('servicesOrder.deliveryIn', 'Delivery in')} {getField(service, 'delivery_time', currentLang) || getField(service, 'deliveryTime', currentLang) || ''}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                   {getField(service, 'revisions', currentLang) || ''} {t('servicesOrder.revisions', 'revisions')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {features.length > 0 && (
                                                        <div className="mt-4">
                                                            <ul className="space-y-2">
                                                                {features.map((feature, featureIndex) => (
                                                                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                                                                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                                                                        {feature}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                        </div>
                                        )}

                                        {/* Requirements */}
                                        <div>
                                            <Label htmlFor="requirements">{t('servicesOrder.projectRequirements', 'Project Requirements')}</Label>
                                            <div className="space-y-2 mt-2">
                                                {requirements.map((req, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <Input
                                                            type="text"
                                                            value={req}
                                                            onChange={e => updateRequirement(idx, e.target.value)}
                                                            placeholder={t('servicesOrder.requirementN', `Requirement #${idx + 1}`).replace('{n}', idx + 1)}
                                                            className="flex-1"
                                                        />
                                                        {requirements.length > 1 && (
                                                            <Button type="button" variant="destructive" size="icon" onClick={() => removeRequirement(idx)}>
                                                                &times;
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                                <Button type="button" variant="outline" size="sm" onClick={addRequirement} className="mt-2">
                                                    {t('servicesOrder.addRequirement', '+ Add Requirement')}
                                                </Button>
                                            </div>
                                            {errors.requirements && (
                                                <p className="text-destructive text-sm mt-1">{errors.requirements}</p>
                                            )}
                                        </div>

                                        {/* Additional Notes */}
                                        <div>
                                            <Label htmlFor="additional_notes">{t('servicesOrder.additionalNotes', 'Additional Notes (Optional)')}</Label>
                                            <Textarea
                                                id="additional_notes"
                                                placeholder={t('servicesOrder.additionalNotesPlaceholder', 'Any additional information or special requests...')}
                                                value={data.additional_notes}
                                                onChange={(e) => setData('additional_notes', e.target.value)}
                                                className="mt-2"
                                                rows={3}
                                            />
                                            {errors.additional_notes && (
                                                <p className="text-destructive text-sm mt-1">{errors.additional_notes}</p>
                                            )}
                                        </div>

                                        {/* Terms and Conditions */}
                                        <div className="flex items-start ">
                                            <Checkbox
                                                id="terms"
                                                checked={agreeToTerms}
                                                onCheckedChange={setAgreeToTerms}
                                            />
                                            <Label htmlFor="terms" className="text-sm ms-2">
                                                {t('servicesOrder.agreeToTerms', 'I agree to the')}{' '}
                                                <Link href="/terms" className="text-primary hover:underline">
                                                    {t('servicesOrder.termsAndConditions', 'Terms and Conditions')}
                                                </Link>{' '}
                                                {t('servicesOrder.and', 'and')}{' '}
                                                <Link href="/privacy" className="text-primary hover:underline">
                                                    {t('servicesOrder.privacyPolicy', 'Privacy Policy')}
                                                </Link>
                                            </Label>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={!agreeToTerms || processing || isProcessing}
                                        >
                                            {processing || isProcessing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    {t('servicesOrder.processing', 'Processing...')}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Lock className="w-4 h-4" />
                                                    {t('servicesOrder.placeOrderSecurely', 'Place Order Securely')}
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1 ">
                            <div className="sticky top-8">
                                {/* Service Info */}
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{t('servicesOrder.serviceDetails', 'Service Details')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">{serviceTitle}</h3>
                                            <p className="text-muted-foreground text-sm mt-1">{serviceDescription}</p>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            {service.freelancer.location || t('servicesOrder.locationNotSpecified', 'Location not specified')}
                                        </div>
                                        
                                      
                                    </CardContent>
                                </Card>

                                {/* Order Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{t('servicesOrder.orderSummary', 'Order Summary')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span>{t('servicesOrder.packagePrice', 'Package Price:')}</span>
                                                <span className="font-semibold">{formatPrice(selectedPackageState.price)}</span>
                                            </div>
                                            {hasPackages && (
                                                <>
                                            <Separator />
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>{t('servicesOrder.total', 'Total:')}</span>
                                                <span className="text-primary">{formatPrice(total)}</span>
                                            </div>
                                                </>
                                            )}
                                        </div>
                                        
                                        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-primary">{t('servicesOrder.securePayment', 'Secure Payment')}</p>
                                                    <p className="text-primary/80">{t('servicesOrder.securePaymentDesc', 'Your payment is protected by our secure payment system')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    );
} 