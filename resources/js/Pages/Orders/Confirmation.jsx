import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Clock,
    Upload,
    FileText,
    CreditCard,
    AlertCircle,
    ArrowLeft,
    Download,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useLanguageChange } from "@/lib/useLanguageChange";
import Navbar from "@/Components/Home/Navbar";
import Footer from "@/Components/Home/Footer";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderConfirmation({ order, auth }) {
    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();

    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [paymentSubmitted, setPaymentSubmitted] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        transaction_ref: "",
        payment_screenshot: null,
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat("ar-SD", {
            style: "currency",
            currency: "SDG",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "payment_verified":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
                return "bg-purple-100 text-purple-800";
            case "review":
                return "bg-orange-100 text-orange-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return t("orders.status.pending");
            case "payment_verified":
                return t("orders.status.paymentVerified");
            case "in_progress":
                return t("orders.status.inProgress");
            case "review":
                return t("orders.status.underReview");
            case "completed":
                return t("orders.status.completed");
            case "cancelled":
                return t("orders.status.cancelled");
            default:
                return status;
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setData("payment_screenshot", file);
        }
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        post(`/orders/${order.id}/upload-payment`, {
            onSuccess: () => {
                setShowPaymentForm(false);
                setPaymentSubmitted(true);
            },
        });
    };

    return (
        <>
            <Head
                title={t("ordersConfirmation.pageTitle", {
                    order_number: order.order_number,
                })}
            />
            {/* <Navbar auth={auth} /> */}
            <div className="min-h-screen bg-background rtl">
                <div className="container mx-auto px-4 py-8">
                    {/* Hero Banner */}
                    
                    <Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-background via-card to-background">
                        
                        <CardContent className="flex flex-col  justify-between md:flex-row -center gap-6 p-6">
                        <div className="hidden md:block me-auto">
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/orders">
                                        <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180" />
                                        {t("common.back")}
                                    </Link>
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 flex-1">
                                {order.status === "completed" ? (
                                    <CheckCircle className="w-10 h-10 text-success" />
                                ) : order.status === "pending" ? (
                                    <Clock className="w-10 h-10 text-yellow-500" />
                                ) : (
                                    <FileText className="w-10 h-10 text-primary" />
                                )}
                                <div>
                                    <h1 className="text-2xl font-bold mb-1">
                                        {t("ordersConfirmation.pageTitle", {
                                            order_number: order.order_number,
                                        })}
                                    </h1>
                                    <Badge
                                        variant="outline"
                                        className="text-base px-3 py-1.5"
                                    >
                                        {getStatusText(order.status)}
                                    </Badge>
                                </div>
                            </div>
                            
                          
                           
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Payment Pending Banner */}
                            {order.status === "pending" &&
                                !paymentSubmitted && (
                                    <div className="">
                                        <Card className="border-primary bg-primary/5 animate-in fade-in mb-8">
                                            <CardContent className="p-8 text-center flex flex-col items-center">
                                                <Upload className="w-12 h-12 text-primary mb-4" />
                                                <h2 className="text-2xl font-bold text-primary mb-2">
                                                    {t(
                                                        "ordersConfirmation.uploadPaymentProof"
                                                    )}
                                                </h2>
                                                <p className="mb-6 text-muted-foreground max-w-xl mx-auto">
                                                    {t(
                                                        "ordersConfirmation.uploadPaymentProofDesc"
                                                    )}
                                                </p>
                                                {!showPaymentForm ? (
                                                    <Button
                                                        onClick={() =>
                                                            setShowPaymentForm(
                                                                true
                                                            )
                                                        }
                                                        size="lg"
                                                        className="mt-2"
                                                    >
                                                        {t(
                                                            "ordersConfirmation.uploadPaymentProof"
                                                        )}
                                                    </Button>
                                                ) : (
                                                    <form
                                                        onSubmit={
                                                            handlePaymentSubmit
                                                        }
                                                        className="space-y-6 max-w-md mx-auto w-full"
                                                    >
                                                        <div>
                                                            <Label htmlFor="transaction_ref">
                                                                {t(
                                                                    "ordersConfirmation.transactionReference"
                                                                )}
                                                            </Label>
                                                            <Input
                                                                id="transaction_ref"
                                                                type="text"
                                                                placeholder={t(
                                                                    "ordersConfirmation.enterTransactionReference"
                                                                )}
                                                                value={
                                                                    data.transaction_ref
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "transaction_ref",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                required
                                                            />
                                                            {errors.transaction_ref && (
                                                                <p className="text-destructive text-sm mt-1">
                                                                    {
                                                                        errors.transaction_ref
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="payment_screenshot">
                                                                {t(
                                                                    "ordersConfirmation.paymentScreenshot"
                                                                )}
                                                            </Label>
                                                            <div className="mt-2 border-2 border-dashed border-primary/30 rounded-lg p-4 bg-card flex flex-col items-center">
                                                                <Input
                                                                    id="payment_screenshot"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={
                                                                        handleFileChange
                                                                    }
                                                                    required
                                                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                                />
                                                                {selectedFile && (
                                                                    <p className="text-sm text-muted-foreground mt-2">
                                                                        {t(
                                                                            "ordersConfirmation.selectedFile",
                                                                            {
                                                                                filename:
                                                                                    selectedFile.name,
                                                                            }
                                                                        )}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {errors.payment_screenshot && (
                                                                <p className="text-destructive text-sm mt-1">
                                                                    {
                                                                        errors.payment_screenshot
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-3 justify-center">
                                                            <Button
                                                                type="submit"
                                                                size="lg"
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                {processing
                                                                    ? t(
                                                                          "ordersConfirmation.uploading"
                                                                      )
                                                                    : t(
                                                                          "ordersConfirmation.submitPaymentProof"
                                                                      )}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="lg"
                                                                onClick={() =>
                                                                    setShowPaymentForm(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                {t(
                                                                    "ordersConfirmation.cancel"
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </form>
                                                )}
                                            </CardContent>
                                        </Card>
                                        {/* Bank Transfer Details */}
                                        <Card className="shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <CreditCard className="w-5 h-5" />
                                                    {t("bankDetails.title")}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Bank Account */}
                                                    <div className="border rounded-lg p-4 bg-muted/50">
                                                        <h3 className="font-medium mb-3 flex items-center gap-2">
                                                            <Badge variant="secondary">
                                                                {t(
                                                                    "bankDetails.bankAccount"
                                                                )}
                                                            </Badge>
                                                        </h3>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <Label className="text-sm text-muted-foreground">
                                                                    {t(
                                                                        "bankDetails.accountName"
                                                                    )}
                                                                </Label>
                                                                <p className="font-medium">
                                                                    مصعب عوض
                                                                    محمد الماحي
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm text-muted-foreground">
                                                                    رقم الحساب
                                                                </Label>
                                                                <p className="font-mono">
                                                                    3929198
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Fawry Account */}
                                                    <div className="border rounded-lg p-4 bg-muted/50">
                                                        <h3 className="font-medium mb-3 flex items-center gap-2">
                                                            <Badge variant="secondary">
                                                                {t(
                                                                    "bankDetails.fawryAccount"
                                                                )}
                                                            </Badge>
                                                        </h3>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <Label className="text-sm text-muted-foreground">
                                                                    {t(
                                                                        "bankDetails.accountName"
                                                                    )}
                                                                </Label>
                                                                <p className="font-medium">
                                                                    مصعب عوض
                                                                    محمد الماحي
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm text-muted-foreground">
                                                                    رقم الحساب
                                                                </Label>
                                                                <p className="font-mono">
                                                                    51963415
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Transfer Guide */}
                                                {/* <div className="mt-6">
                                        <h3 className="font-medium mb-3">{t('bankDetails.transferGuide')}</h3>
                                        <div className="space-y-3">
                                            {[1, 2, 3, 4].map((step) => (
                                                <div key={step} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-primary text-sm font-semibold">{step}</span>
                                                    </div>
                                                    <p className="text-sm">
                                                        {t(`bankDetails.steps.${step}`, { 
                                                            amount: formatPrice(order.total_amount),
                                                            orderNumber: order.order_number 
                                                        })}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}

                                                {/* Important Note */}
                                                {/* <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 inline-block mr-2" />
                                        <span className="text-sm text-yellow-700 dark:text-yellow-300">
                                            {t('bankDetails.importantNote', { orderNumber: order.order_number })}
                                        </span>
                                    </div> */}
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                            {/* Payment Success Banner */}
                            {paymentSubmitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8"
                                >
                                    <Card className="border-success bg-success/10 animate-in fade-in">
                                        <CardContent className="p-8 text-center flex flex-col items-center">
                                            <CheckCircle className="w-12 h-12 text-success mb-4" />
                                            <h2 className="text-2xl font-bold text-success mb-2">
                                                {t(
                                                    "ordersConfirmation.paymentProofSubmitted"
                                                )}
                                            </h2>
                                            <p className="text-success mb-4 max-w-xl mx-auto">
                                                {t(
                                                    "ordersConfirmation.paymentProofSubmittedDesc"
                                                )}
                                            </p>
                                            <Button
                                                asChild
                                                size="lg"
                                                className="mt-2"
                                            >
                                                <Link
                                                    href={`/chat/${order.id}`}
                                                >
                                                    {t(
                                                        "ordersConfirmation.goToChat"
                                                    )}
                                                </Link>
                                            </Button>
                                            <div className="mt-8 text-sm text-muted-foreground w-full">
                                                <Separator className="mb-4" />
                                                <p className="font-semibold mb-2 text-start">
                                                    {t(
                                                        "ordersConfirmation.nextSteps"
                                                    )}
                                                </p>
                                                <ol className="list-decimal list-inside text-start max-w-md mt-2 space-y-1">
                                                    <li>
                                                        {t(
                                                            "ordersConfirmation.waitForVerification"
                                                        )}
                                                    </li>
                                                    <li>
                                                        {t(
                                                            "ordersConfirmation.discussInChat"
                                                        )}
                                                    </li>
                                                    <li>
                                                        {t(
                                                            "ordersConfirmation.workBegins"
                                                        )}
                                                    </li>
                                                </ol>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Order Information */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>
                                            {t(
                                                "ordersConfirmation.orderInformation"
                                            )}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={getStatusColor(
                                                order.status
                                            )}
                                        >
                                            {getStatusText(order.status)}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    "ordersConfirmation.orderNumber"
                                                )}
                                            </Label>
                                            <p className="font-semibold">
                                                {order.order_number}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    "ordersConfirmation.orderDate"
                                                )}
                                            </Label>
                                            <p>
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    "ordersConfirmation.package"
                                                )}
                                            </Label>
                                            <p className="font-semibold">
                                                {order.package_name}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    "ordersConfirmation.dueDate"
                                                )}
                                            </Label>
                                            <p>
                                                {new Date(
                                                    order.due_date
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {order.requirements && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    "ordersConfirmation.requirements"
                                                )}
                                            </Label>
                                            {Array.isArray(
                                                order.requirements
                                            ) &&
                                            order.requirements.length > 0 ? (
                                                <ul className="list-disc pl-5 mt-1 text-foreground">
                                                    {order.requirements.map(
                                                        (req, idx) => (
                                                            <li key={idx}>
                                                                {req}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            ) : (
                                                <p className="mt-1 text-foreground">
                                                    {order.requirements}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {order.additional_notes && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    "ordersConfirmation.additionalNotes"
                                                )}
                                            </Label>
                                            <p className="mt-1 text-foreground">
                                                {order.additional_notes}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Service Information */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>
                                        {t("ordersConfirmation.serviceDetails")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    "ordersConfirmation.service"
                                                )}
                                            </Label>
                                            <p className="font-semibold">
                                                {order.service.title}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    "ordersConfirmation.freelancer"
                                                )}
                                            </Label>
                                            <p>{order.freelancer.name}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Information */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        {t(
                                            "ordersConfirmation.paymentInformation"
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    "ordersConfirmation.packagePrice"
                                                )}
                                            </Label>
                                            <p className="font-semibold">
                                                {formatPrice(
                                                    order.package_price
                                                )}
                                            </p>
                                        </div>

                                        <div className="col-span-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t("ordersConfirmation.total")}
                                            </Label>
                                            <p className="font-semibold text-lg">
                                                {formatPrice(
                                                    order.total_amount
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t(
                                                "ordersConfirmation.paymentMethod"
                                            )}
                                        </Label>
                                        <p className="capitalize">
                                            {order.payment_method.replace(
                                                "_",
                                                " "
                                            )}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Status */}
                            {order.transaction_ref && (
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <CardTitle>
                                            {t(
                                                "ordersConfirmation.paymentDetails"
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="me-2 text-sm font-medium text-muted-foreground">
                                                    {t(
                                                        "ordersConfirmation.transactionReference"
                                                    )}
                                                </Label>
                                                <p className="font-mono">
                                                    {order.transaction_ref}
                                                </p>
                                            </div>
                                            {order.payment_screenshot && (
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">
                                                        {t(
                                                            "ordersConfirmation.paymentScreenshot"
                                                        )}
                                                    </Label>
                                                    <div className="mt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Eye className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                                            {t(
                                                                "ordersConfirmation.viewScreenshot"
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <Label className="me-2 text-sm font-medium text-muted-foreground">
                                                    {t(
                                                        "ordersConfirmation.paymentStatus"
                                                    )}
                                                </Label>
                                                <Badge
                                                    variant="outline"
                                                    className={getStatusColor(
                                                        order.payment_status
                                                    )}
                                                >
                                                    {order.payment_status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1 space-y-8">
                            {/* Next Steps */}
                            <Card className="bg-muted/50 border-0 shadow-none">
                                <CardHeader>
                                    <CardTitle>
                                        {t("ordersConfirmation.nextStepsTitle")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-primary text-base font-semibold">
                                                    1
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {t(
                                                        "ordersConfirmation.uploadPaymentProofStep"
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {t(
                                                        "ordersConfirmation.submitYourPaymentScreenshot"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-muted-foreground text-base font-semibold">
                                                    2
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-muted-foreground">
                                                    {t(
                                                        "ordersConfirmation.paymentVerification"
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {t(
                                                        "ordersConfirmation.verifyWithin24h"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-muted-foreground text-base font-semibold">
                                                    3
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-muted-foreground">
                                                    {t(
                                                        "ordersConfirmation.workBeginsStep"
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {t(
                                                        "ordersConfirmation.freelancerStartsWork"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Support */}
                            <Card className="bg-muted/50 border-0 shadow-none">
                                <CardHeader>
                                        <CardTitle>
                                            {t("ordersConfirmation.needHelp")}
                                        </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {t(
                                            "ordersConfirmation.contactSupportDesc"
                                        )}
                                    </p>
                                    <Link href={"/contact"}>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        {t("ordersConfirmation.contactSupport")}
                                    </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
