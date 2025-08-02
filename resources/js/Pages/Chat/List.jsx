import { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { route } from "ziggy-js";
import {
  MessageCircle,
  FileText,
  Image as ImageIcon,
  Search,
  Filter,
  CircleDot,
  Clock,
  CheckCircle2,
  AlertCircle,
  CircleSlash,
} from "lucide-react";
import ClientDashboardLayout from "@/Layouts/ClientDashboardLayout";
import FreelancerDashboardLayout from "@/Layouts/FreelancerDashboardLayout";
import AdminLayout from "@/Layouts/AdminLayout";

// Status configuration with icons and colors
const statusConfig = {
  pending: {
    icon: <CircleDot className="w-4 h-4 text-yellow-500" />,
    color: "bg-yellow-100 text-yellow-800",
  },
  payment_verified: {
    icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />,
    color: "bg-blue-100 text-blue-800",
  },
  in_progress: {
    icon: <Clock className="w-4 h-4 text-primary" />,
    color: "bg-primary/10 text-primary",
  },
  review: {
    icon: <AlertCircle className="w-4 h-4 text-purple-500" />,
    color: "bg-purple-100 text-purple-800",
  },
  completed: {
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    color: "bg-green-100 text-green-800",
  },
  cancelled: {
    icon: <CircleSlash className="w-4 h-4 text-red-500" />,
    color: "bg-red-100 text-red-800",
  },
};

export default function ChatList({ auth, chats = [] }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Determine user role
  const role = auth?.user?.role;
  const isClient = role === "client";
  const isFreelancer = role === "freelancer";

  // Conversation mapping with order status
  const conversations = useMemo(() => {
    return chats.map((chat) => {
      console.log(chat);
      
      let other_user, other_role;
      if (isClient && chat.freelancer) {
        other_user = chat.freelancer;
        other_role = "freelancer";
      } else if (isFreelancer && chat.client) {
        other_user = chat.client;
        other_role = "client";
      } else {
        other_user = chat.freelancer || chat.client || { name: "Unknown User" };
        other_role = chat.freelancer ? "freelancer" : chat.client ? "client" : "unknown";
      }

      // Get status configuration
      const status = chat.order_status || "pending";
      const statusInfo = statusConfig[status] || statusConfig.pending;

      return {
        id: chat.order_id,
        order_id: chat.order_id,
        order_number: chat.order_number,
        order_status: status,
        other_user: { ...other_user, role: other_role },
        last_message: chat.last_message,
        unread_count: chat.unread_count,
        statusInfo,
      };
    });
  }, [chats, isClient, isFreelancer]);

  // Filter conversations
  const filtered = useMemo(() => {
    let result = conversations;
    
    // Apply search filter
    if (search.trim()) {
      result = result.filter(c =>
        c.other_user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.order_number?.toString().includes(search)
      );
    }
    
    // Apply status filter
    if (activeFilter !== "all") {
      result = result.filter(c => c.order_status === activeFilter);
    }
    
    return result;
  }, [search, activeFilter, conversations]);

  // Format time display
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Get status count for filters
  const statusCounts = useMemo(() => {
    const counts = { all: conversations.length };
    Object.keys(statusConfig).forEach(status => {
      counts[status] = conversations.filter(c => c.order_status === status).length;
    });
    return counts;
  }, [conversations]);

  const Layout = isClient ? ClientDashboardLayout : 
                isFreelancer ? FreelancerDashboardLayout : AdminLayout;

  return (
    <Layout noPadding>
      <Head title={t("chatList.title")} />
      
      <div className="flex h-full bg-background">
        {/* Sidebar for filters */}
        <div className="hidden md:block w-64 p-4 border-r bg-background">
          <div className="space-y-6">
            <div className="px-2">
              <h2 className="text-lg font-semibold">{t("chatList.orderStatus")}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t("chatList.filterByOrderStatus")}
              </p>
            </div>
            
            <div className="space-y-1">
              {["all", ...Object.keys(statusConfig)].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left ${activeFilter === filter ? 'bg-accent font-medium' : 'hover:bg-accent/50'}`}
                >
                  <div className="flex items-center">
                    {filter !== "all" && (
                      <span className="me-2">
                        {statusConfig[filter]?.icon}
                      </span>
                    )}
                    <span className="capitalize">
                      {filter === "all" ? t("chatList.allOrders") : t(`orders.status.${filter}`)}
                    </span>
                  </div>
                  <Badge variant="outline" className="px-2 py-0.5 text-xs">
                    {statusCounts[filter]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with search */}
          <div className="p-4 border-b bg-background">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{t("chatList.title")}</h1>
                <p className="text-sm text-muted-foreground">
                  {t("chatList.subtitle")}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("chatList.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-4 bg-background rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-[160px]" />
                          <Skeleton className="h-4 w-[60px]" />
                        </div>
                        <Skeleton className="h-3 w-[200px]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white">
                <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">{t("chatList.noConversations")}</h3>
                <p className="text-muted-foreground mt-1">
                  {search ? t("chatList.tryDifferentSearch") : t("chatList.emptyState")}
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filtered.map((conv) => (
                  <Link
                    key={conv.id}
                    href={route("chat.show", conv.order_id)}
                    className={`block p-3 bg-background rounded-lg border  hover:bg-muted hover:shadow-sm transition-shadow ${conv.unread_count > 0 ? 'border-primary/30 bg-muted' : 'border-transparent'}`}
                  >
                    <div className="flex items-start">
                      <div className="relative me-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conv.other_user?.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {conv.other_user?.name?.charAt(0)}

                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          {conv.statusInfo.icon}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium flex items-center">
                              {conv.other_user?.name}
                              <Badge variant="outline" className="ms-2 text-xs capitalize">
                                {conv.other_user?.role === 'client' ? t('auth.client') : conv.other_user?.role === 'freelancer' ? t('auth.freelancer') : conv.other_user?.role}
                              </Badge>
                            </h3>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className={`text-xs ${conv.statusInfo.color}`}>
                                {t(`orders.status.${conv.order_status}`)}
                              </Badge>
                              <span className="text-xs text-muted-foreground ms-2">
                                #{conv.order_number}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTime(conv.last_message?.created_at)}
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {conv.last_message?.file_type === "image" && (
                              <ImageIcon className="inline me-1 w-4 h-4" />
                            )}
                            {conv.last_message?.file_type === "doc" && (
                              <FileText className="inline me-1 w-4 h-4" />
                            )}
                            {conv.last_message?.content || 
                              (conv.last_message?.file_type === "final_delivery" ? 
                                t("chatList.finalDeliverySubmitted") : 
                                t("chatList.noMessagesYet"))}
                          </p>
                        </div>
                      </div>
                      
                      {conv.unread_count > 0 && (
                        <div className="ms-3">
                          <Badge className="bg-primary text-primary-foreground">
                            {conv.unread_count}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}