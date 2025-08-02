import { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet as WalletIcon,
    Send,
    Download,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    ChevronDown,
    ChevronUp,
    Banknote,
    CreditCard,
    DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import FreelancerDashboardLayout from "@/Layouts/FreelancerDashboardLayout";

// Utility functions
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US").format(amount);
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const STATUS_CONFIG = {
    pending: {
        icon: <Clock className="w-4 h-4 text-yellow-500" />,
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending",
    },
    approved: {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        color: "bg-green-100 text-green-800",
        label: "Approved",
    },
    rejected: {
        icon: <XCircle className="w-4 h-4 text-red-500" />,
        color: "bg-red-100 text-red-800",
        label: "Rejected",
    },
    paid: {
        icon: <CheckCircle className="w-4 h-4 text-blue-500" />,
        color: "bg-blue-100 text-blue-800",
        label: "Paid",
    },
    payout_paid: {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        color: "bg-green-100 text-green-800",
        label: "Completed",
    },
};

export default function FreelancerWallet({
    wallet,
    transactions,
    payoutRequests,
    canRequestPayout,
    minPayoutAmount = 200000,
}) {
    const { t } = useTranslation();
    const [showPayoutForm, setShowPayoutForm] = useState(false);
    const [amount, setAmount] = useState("");
    const [bankDetails, setBankDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedRequestId, setExpandedRequestId] = useState(null);

    const sortedTransactions = useMemo(() => {
        return [...transactions.data].sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        );
    }, [transactions.data]);

    const sortedPayoutRequests = useMemo(() => {
        return [...payoutRequests.data].sort(
            (a, b) =>
                new Date(b.requested_at).getTime() -
                new Date(a.requested_at).getTime()
        );
    }, [payoutRequests.data]);

    const handlePayoutRequest = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const parsedAmount = parseFloat(amount);

            if (parsedAmount < minPayoutAmount) {
                toast.error(
                    `Minimum payout amount is ${formatCurrency(
                        minPayoutAmount
                    )} SDG`
                );
                return;
            }

            if (parsedAmount > wallet.balance) {
                toast.error("Requested amount exceeds your current balance");
                return;
            }

            await router.post(
                route("freelancer.wallet.payout"),
                {
                    amount: parsedAmount,
                    bank_account_details: bankDetails,
                },
                {
                    onSuccess: () => {
                        setShowPayoutForm(false);
                        setAmount("");
                        setBankDetails("");
                        toast.success(t("wallet.payout_request_submitted"));
                    },
                    onError: (errors) => {
                        toast.error(
                            errors.message || "Failed to submit payout request"
                        );
                    },
                }
            );
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleRequestDetails = (requestId) => {
        setExpandedRequestId(
            expandedRequestId === requestId ? null : requestId
        );
    };

    return (
        <FreelancerDashboardLayout>
            <Head title={t("wallet.title")} />

            <div className="space-y-6">
                {/* Balance Card */}
                <Card className="bg-gradient-to-r rtl:bg-gradient-to-l from-primary/90 to-primary/60 text-white shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <WalletIcon className="w-6 h-6" />
                            {t("wallet.current_balance")}
                        </CardTitle>
                        <CardDescription className="text-blue-100">
                            {t("wallet.available_funds")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="text-4xl font-bold mb-2">
                                    {formatCurrency(wallet.balance)} SDG
                                </div>
                                <p className="text-blue-100 text-sm">
                                    {t("wallet.last_updated")}:{" "}
                                    {formatDate(new Date().toISOString())}
                                </p>
                            </div>

                            {canRequestPayout ? (
                                <Dialog
                                    open={showPayoutForm}
                                    onOpenChange={setShowPayoutForm}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            className="bg-white text-blue-600 hover:bg-gray-50 shadow-md"
                                            size="lg"
                                        >
                                            <Send className="w-5 h-5 mr-2" />
                                            {t("wallet.request_payout")}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <Banknote className="w-5 h-5" />
                                                {t("wallet.request_payout")}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <form
                                            onSubmit={handlePayoutRequest}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    {t("wallet.amount")} (min{" "}
                                                    {formatCurrency(
                                                        minPayoutAmount
                                                    )}{" "}
                                                    SDG)
                                                </label>
                                                <Input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) =>
                                                        setAmount(
                                                            e.target.value
                                                        )
                                                    }
                                                    min={minPayoutAmount}
                                                    max={wallet.balance}
                                                    required
                                                    placeholder={t(
                                                        "wallet.enter_amount"
                                                    )}
                                                    className="text-lg py-3"
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {t(
                                                        "wallet.available_balance"
                                                    )}
                                                    :{" "}
                                                    {formatCurrency(
                                                        wallet.balance
                                                    )}{" "}
                                                    SDG
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    {t("wallet.bank_details")}
                                                </label>
                                                <Textarea
                                                    value={bankDetails}
                                                    onChange={(e) =>
                                                        setBankDetails(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    placeholder={t(
                                                        "wallet.enter_bank_details"
                                                    )}
                                                    rows={4}
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setShowPayoutForm(false)
                                                    }
                                                    disabled={isSubmitting}
                                                >
                                                    {t("common.cancel")}
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="min-w-32"
                                                >
                                                    {isSubmitting ? (
                                                        <span className="flex items-center gap-2">
                                                            <svg
                                                                className="animate-spin h-4 w-4"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                            {t(
                                                                "wallet.submitting"
                                                            )}
                                                        </span>
                                                    ) : (
                                                        t(
                                                            "wallet.submit_request"
                                                        )
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-400/30">
                                    <p className="text-sm">
                                        {t("wallet.minimum_payout_notice", {
                                            amount: formatCurrency(
                                                minPayoutAmount
                                            ),
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Transaction History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <FileText className="w-5 h-5" />
                            {t("wallet.transaction_history")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {sortedTransactions.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {t("wallet.description")}
                                        </TableHead>
                                        <TableHead>
                                            {t("wallet.date")}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {t("wallet.amount")}
                                        </TableHead>
                                        <TableHead>
                                            {t("wallet.status")}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {sortedTransactions.map(
                                            (transaction) => (
                                                <motion.tr
                                                    key={transaction.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="hover:bg-muted/50"
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            {transaction.type.includes(
                                                                "payout"
                                                            ) ? (
                                                                <CreditCard className="w-4 h-4 text-blue-500" />
                                                            ) : (
                                                                <DollarSign className="w-4 h-4 text-green-500" />
                                                            )}
                                                            {
                                                                transaction.description
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(
                                                            transaction.created_at
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        className={`text-right font-semibold ${
                                                            transaction.type ===
                                                            "payout_paid"
                                                                ? "text-blue-600"
                                                                : transaction.amount >
                                                                  0
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {transaction.type ===
                                                        "payout_paid"
                                                            ? "✓ "
                                                            : ""}
                                                        {transaction.amount > 0
                                                            ? "+"
                                                            : ""}
                                                        {formatCurrency(
                                                            transaction.amount
                                                        )}{" "}
                                                        SDG
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className="capitalize text-xs"
                                                        >
                                                            {transaction.type ===
                                                            "payout_paid"
                                                                ? t(
                                                                      "wallet.paid"
                                                                  )
                                                                : transaction.type ===
                                                                  "payout_request"
                                                                ? t(
                                                                      "wallet.payout_request"
                                                                  )
                                                                : transaction.type ===
                                                                  "payout_approved"
                                                                ? t(
                                                                      "wallet.payout_approved"
                                                                  )
                                                                : transaction.type ===
                                                                  "payout_rejected"
                                                                ? t(
                                                                      "wallet.payout_rejected"
                                                                  )
                                                                : transaction.type ===
                                                                  "credit"
                                                                ? t(
                                                                      "wallet.credit"
                                                                  )
                                                                : transaction.type}
                                                        </Badge>
                                                    </TableCell>
                                                </motion.tr>
                                            )
                                        )}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <FileText className="w-12 h-12 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    {t("wallet.no_transactions")}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payout Requests */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <Download className="w-5 h-5" />
                            {t("wallet.payout_requests")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {sortedPayoutRequests.length > 0 ? (
                            <div className="space-y-3">
                                {sortedPayoutRequests.map((request) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border rounded-lg overflow-hidden"
                                    >
                                        <Collapsible
                                            open={
                                                expandedRequestId === request.id
                                            }
                                            onOpenChange={() =>
                                                toggleRequestDetails(request.id)
                                            }
                                        >
                                            <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-blue-100 p-2 rounded-lg">
                                                            <Banknote className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">
                                                                {request.amount >
                                                                0
                                                                    ? `${formatCurrency(
                                                                          request.amount
                                                                      )} SDG`
                                                                    : (request.status ===
                                                                          "payout_paid" ||
                                                                          request.status ===
                                                                              "paid") &&
                                                                      request.payment_proof
                                                                    ? t(
                                                                          "wallet.payment_completed"
                                                                      )
                                                                    : t(
                                                                          "wallet.amount_not_specified"
                                                                      )}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {t(
                                                                    "wallet.requested"
                                                                )}
                                                                :{" "}
                                                                {formatDate(
                                                                    request.requested_at
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <Badge
                                                            className={`${
                                                                STATUS_CONFIG[
                                                                    request
                                                                        .status
                                                                ]?.color
                                                            } px-3 py-1`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {
                                                                    STATUS_CONFIG[
                                                                        request
                                                                            .status
                                                                    ]?.icon
                                                                }
                                                                <span>
                                                                    {
                                                                        STATUS_CONFIG[
                                                                            request.status ===
                                                                                "approved" &&
                                                                            request.payment_proof
                                                                                ? "payout_paid"
                                                                                : request.status
                                                                        ]?.label
                                                                    }
                                                                </span>
                                                            </div>
                                                        </Badge>
                                                        <CollapsibleTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="w-9 p-0"
                                                            >
                                                                {expandedRequestId ===
                                                                request.id ? (
                                                                    <ChevronUp className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                )}
                                                                <span className="sr-only">
                                                                    Toggle
                                                                </span>
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                    </div>
                                                </div>
                                            </div>
                                            <CollapsibleContent className="px-4 pb-4 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-medium text-muted-foreground">
                                                            {t(
                                                                "wallet.bank_details"
                                                            )}
                                                        </h4>
                                                        <p className="text-sm">
                                                            {request.bank_account_details ||
                                                                t(
                                                                    "wallet.not_provided"
                                                                )}
                                                        </p>
                                                    </div>

                                                    {(request.status ===
                                                        "paid" ||
                                                        request.status ===
                                                            "payout_paid") &&
                                                        request.payment_proof && (
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-medium text-muted-foreground">
                                                                    {t(
                                                                        "wallet.payment_details"
                                                                    )}
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {t(
                                                                        "wallet.paid_on"
                                                                    )}
                                                                    :{" "}
                                                                    {formatDate(
                                                                        request
                                                                            .payment_proof
                                                                            .created_at
                                                                    )}
                                                                </p>
                                                                <p className="text-sm">
                                                                    {t(
                                                                        "wallet.reference"
                                                                    )}
                                                                    :{" "}
                                                                    {
                                                                        request
                                                                            .payment_proof
                                                                            .reference_number
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                </div>

                                                {/* {request.payment_proof && (
                          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-green-800">
                                {t('wallet.payment_proof')}
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/storage/${request.payment_proof?.screenshot_path}`, '_blank')}
                              >
                                {t('wallet.view_proof')}
                              </Button>
                            </div>
                          </div>
                        )} */}

                                                {request.admin_notes && (
                                                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                                        <h4 className="text-sm font-medium text-blue-800 mb-1">
                                                            {t(
                                                                "wallet.admin_notes"
                                                            )}
                                                        </h4>
                                                        <p className="text-sm text-blue-700">
                                                            {
                                                                request.admin_notes
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Download className="w-12 h-12 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    {t("wallet.no_payout_requests")}
                                </p>
                                {canRequestPayout && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowPayoutForm(true)}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        {t("wallet.request_payout")}
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </FreelancerDashboardLayout>
    );
}
