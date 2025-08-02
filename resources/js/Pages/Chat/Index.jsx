import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Paperclip, File as FileIcon, Check, CheckCheck, 
  Download, X, Smile, User as UserIcon, MoreHorizontal,
  Play, CheckCircle, Repeat, Clock, AlertCircle, CircleSlash,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/Components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import ClientDashboardLayout from '@/Layouts/ClientDashboardLayout';
import FreelancerDashboardLayout from '@/Layouts/FreelancerDashboardLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import ReviewForm from '../../components/ReviewForm';
import ReviewCard from '../../components/ReviewCard';

const statusConfig = {
  pending: { icon: <Clock className="w-4 h-4 text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800' },
  payment_verified: { icon: <CheckCircle className="w-4 h-4 text-blue-500" />, color: 'bg-blue-100 text-blue-800' },
  in_progress: { icon: <Play className="w-4 h-4 text-primary" />, color: 'bg-primary/10 text-primary' },
  review: { icon: <AlertCircle className="w-4 h-4 text-purple-500" />, color: 'bg-purple-100 text-purple-800' },
  completed: { icon: <CheckCircle className="w-4 h-4 text-green-500" />, color: 'bg-green-100 text-green-800' },
  cancelled: { icon: <CircleSlash className="w-4 h-4 text-red-500" />, color: 'bg-red-100 text-red-800' }
};

export default function ChatPage({ auth, order, messages: initialMessages }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState(initialMessages || []);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionProcessing, setIsActionProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [lastMarkedUnreadIds, setLastMarkedUnreadIds] = useState([]);
  
  const role = auth?.user?.role;
  const isClient = role === 'client';
  const isFreelancer = role === 'freelancer';
  
  const otherUser = isFreelancer ? order.client : order.freelancer;
  const Layout = isClient ? ClientDashboardLayout : isFreelancer ? FreelancerDashboardLayout : AdminLayout;

  // Only disable chat for these specific statuses
  const can_chat = !['completed', 'cancelled'].includes(order?.status) && order?.payment_status !== 'failed';
  const chatDisabled = !can_chat;

  // Toast handling
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: '', type: 'success' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Auto-scroll to bottom when new unread messages arrive
  useEffect(() => {
    if (messages.length === 0) return;

    const unreadMessages = messages.filter(
      m => m.sender_id !== auth.user.id && !m.read_at
    );

    if (unreadMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, auth.user.id]);

  // Poll for new messages
  useEffect(() => {
    if (chatDisabled || !order) return;
    
    const pollMessages = () => {
      if (document.visibilityState === 'visible') {
        router.reload({ 
          only: ['messages'], 
          preserveScroll: true,
          onSuccess: (page) => {
            if (page.props.messages) setMessages(page.props.messages);
          }
        });
      }
    };

    const interval = setInterval(pollMessages, 3000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') pollMessages();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [order, chatDisabled]);

  // Mark messages as read
  useEffect(() => {
    if (chatDisabled || !order || !messages.length) return;
    
    const unreadMessages = messages.filter(m => 
      m.sender_id !== auth.user.id && !m.read_at
    ).map(m => m.id);

    if (
      unreadMessages.length > 0 &&
      JSON.stringify(unreadMessages) !== JSON.stringify(lastMarkedUnreadIds)
    ) {
      setLastMarkedUnreadIds(unreadMessages);
      router.post(route('chat.markRead', order.id), { ids: unreadMessages }, {
        preserveScroll: true,
      });
    }
  }, [order, messages, auth.user.id, lastMarkedUnreadIds, chatDisabled]);

  const handleFileChange = (e) => {
    if (chatDisabled) return;
    
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      setFileType('image');
      if (selectedFile.size < 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target.result);
        reader.readAsDataURL(selectedFile);
      }
    } else {
      setFileType('doc');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (chatDisabled || (!newMessage.trim() && !file)) return;

    setIsLoading(true);
    const formData = new FormData();
    
    if (newMessage.trim()) formData.append('content', newMessage);
    if (file) {
      formData.append('file', file);
      formData.append('file_type', fileType);
    }

    try {
      await router.post(route('chat.send', order.id), formData, {
        forceFormData: true,
        onSuccess: (page) => {
          setNewMessage('');
          setFile(null);
          setFileType(null);
          setPreviewImage(null);
          if (page.props.messages) setMessages(page.props.messages);
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliverWork = async () => {
    if (chatDisabled) return;
    
    setIsActionProcessing(true);
    try {
      await router.post(`/freelancer/orders/${order.id}/deliver-work`, {}, {
        onSuccess: () => {
          setToast({ message: t('chatIndex.workDelivered'), type: 'success' });
          router.reload({ only: ['order', 'messages'] });
        },
        onError: () => {
          setToast({ message: t('chatIndex.failedDeliverWork'), type: 'error' });
        }
      });
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleRequestRevision = async () => {
    if (chatDisabled) return;
    
    setIsActionProcessing(true);
    try {
      await router.post(route('orders.request-revision', order.id), {}, {
        onSuccess: () => {
          setToast({ message: t('chatIndex.revisionRequested'), type: 'success' });
          router.reload({ only: ['order', 'messages'] });
        },
        onError: () => {
          setToast({ message: t('chatIndex.failedRequestRevision'), type: 'error' });
        }
      });
    } finally {
      setIsActionProcessing(false);
      }
  };

  const handleClientConfirm = async () => {
    if (chatDisabled) return;
    
    setIsActionProcessing(true);
    try {
      await router.post(`/orders/${order.id}/confirm-completion`, {}, {
        onSuccess: () => {
          setToast({ message: t('chatIndex.orderCompleted'), type: 'success' });
      router.reload({ only: ['order', 'messages'] });
        },
        onError: () => {
          setToast({ message: t('chatIndex.failedConfirmCompletion'), type: 'error' });
        }
      });
    } finally {
      setIsActionProcessing(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Group messages by sender
  const groupedMessages = [];
  let lastSenderId = null;
  let group = null;
  messages.forEach((msg, idx) => {
    if (msg.sender_id !== lastSenderId) {
      if (group) groupedMessages.push(group);
      group = { sender_id: msg.sender_id, sender: msg.sender, messages: [msg] };
      lastSenderId = msg.sender_id;
    } else {
      group.messages.push(msg);
    }
    if (idx === messages.length - 1 && group) groupedMessages.push(group);
  });

  if (!order) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold">{t('chatIndex.orderNotFoundTitle')}</h2>
            <p className="text-muted-foreground mt-2">
              {t('chatIndex.orderNotFoundDesc')}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const { can_review, waiting_review, review } = order;

  // Get disabled chat reason message
  const getDisabledReason = () => {
    if (order.status === 'completed') {
      return t('chatIndex.disabledReasonCompleted');
    } else if (order.status === 'cancelled') {
      return t('chatIndex.disabledReasonCancelled');
    } else if (order.payment_status === 'failed') {
      return t('chatIndex.disabledReasonPaymentFailed');
    }
    return t('chatIndex.disabledReasonGeneric');
  };

  return (
    <TooltipProvider>
    <Layout noPadding={true}>
        <Head title={t('chatIndex.title', { order: order.order_number })} />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white`}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{toast.message}</span>
              <button onClick={() => setToast({ message: '', type: 'success' })}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Container */}
      <div className={`flex flex-col  bg-background border-red-500 ${chatDisabled ? 'h-[calc(80vh-64px)]' : 'h-[calc(90vh-64px)]'}`}>
        {/* Chat Header */}
        <div className="border-b border-border p-4 flex items-center justify-between bg-card">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 me-2">
              <AvatarImage src={otherUser?.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {otherUser?.name?.charAt(0) || <UserIcon className="w-5 h-5" />}
              </AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-semibold">{otherUser?.name || t('chatIndex.unknownUser')}</h2>
                <div className="flex items-center ">
                  <Badge variant="outline" className="text-xs capitalize me-2">
                    {isClient ? t('auth.freelancer') : isFreelancer ? t('auth.client') : ''}
                </Badge>
                <Badge variant="outline" className={statusConfig[order.status]?.color + ' text-xs'}>
                    {t(`orders.status.${order.status}`)}
                </Badge>
                </div>
            </div>
          </div>

          {/* Order Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {isFreelancer && (order.status === 'payment_verified' || order.status === 'review') && (
                  <DropdownMenuItem 
                    onClick={() => router.post(route('freelancer.orders.updateStatus', order.id), { status: 'in_progress' })}
                      disabled={isActionProcessing || chatDisabled}
                  >
                      <Play className="w-4 h-4 me-2" />
                    {t('ordersList.markAsInProgress')}
                  </DropdownMenuItem>
                )}
              {isFreelancer && order.status === 'in_progress' && (
                <DropdownMenuItem 
                    onClick={handleDeliverWork}
                    disabled={isActionProcessing || chatDisabled}
                >
                    <Send className="w-4 h-4 me-2" />
                    {t('ordersList.deliverWork')}
                </DropdownMenuItem>
              )}
              {isClient && order.status === 'review' && (
                <>
                  <DropdownMenuItem 
                      onClick={handleClientConfirm}
                      disabled={isActionProcessing || chatDisabled}
                  >
                      <CheckCircle className="w-4 h-4 me-2 text-green-600" />
                    {t('ordersList.confirmCompletion')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                      onClick={handleRequestRevision}
                      disabled={isActionProcessing || chatDisabled}
                  >
                      <Repeat className="w-4 h-4 me-2 text-yellow-600" />
                    {t('ordersList.requestRevision')}
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem asChild>
                  <Link
                    href={isFreelancer ? `/freelancer/orders/${order.id}` : `/client/orders/${order.id}`}
                    className="flex items-start"
                  >
                    <FileIcon className="w-4 h-4 me-2" />
                    {t('chatIndex.viewOrderDetails')}
                  </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

          {/* Disabled Chat Banner - Only shows when chat is disabled */}
          {chatDisabled && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 p-4"
            >
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                    {t('chatIndex.chatDisabled')}
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {getDisabledReason()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 bg-muted/10">
            {groupedMessages.map((group, gIdx) => {
              const isOwn = group.sender_id === auth.user.id;
              const sender = group.sender || (isOwn ? auth.user : otherUser) || {};
              
              return (
                <div key={gIdx} className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex ${isOwn ? 'flex-row-reverse' : ''} max-w-[80%]`}>
                    {!isOwn && (
                    <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={sender.avatar} />
                        <AvatarFallback>{sender.name?.charAt(0) || <UserIcon />}</AvatarFallback>
                    </Avatar>
                  )}
                  
                    <div className={`flex flex-col ${isOwn ? 'me-2' : 'ms-2'} space-y-1`}>
                    {group.messages.map((msg, msgIndex) => (
                      <motion.div
                        key={msg.id || msgIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                          className={`rounded-xl px-4 py-2 ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-card border'} ${msgIndex === 0 ? 'rounded-tl-none' : ''}`}
                      >
                        {msg.content && (
                          <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        )}
                        
                        {msg.file_path && (
                          <div className="mt-2">
                            {msg.file_type === 'image' ? (
                              <div className="relative group">
                                <img
                                  src={msg.file_path.startsWith('http') ? msg.file_path : `/storage/${msg.file_path}`}
                                  alt="Attachment"
                                  className="rounded-lg max-h-60 cursor-pointer"
                                  onClick={() => setPreviewImage(msg.file_path.startsWith('http') ? msg.file_path : `/storage/${msg.file_path}`)}
                                />
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-background/80"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(msg.file_path.startsWith('http') ? msg.file_path : `/storage/${msg.file_path}`, '_blank');
                                    }}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <a
                                href={msg.file_path.startsWith('http') ? msg.file_path : `/storage/${msg.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg hover:bg-muted/80 transition-colors"
                              >
                                <FileIcon className="h-4 w-4" />
                                <span className="text-sm">
                                  {msg.file_type === 'final_delivery' ? t('chatList.finalDeliverySubmitted') : t('chatIndex.downloadFile')}
                                </span>
                              </a>
                            )}
                          </div>
                        )}
                        
                          <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${isOwn ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          <span>{formatTime(msg.created_at)}</span>
                            {isOwn && (
                            <Tooltip>
                              <TooltipTrigger>
                                {msg.read_at ? (
                                  <CheckCheck className="h-3 w-3 ms-1" />
                                ) : (
                                  <Check className="h-3 w-3 ms-1" />
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                {msg.read_at ? t('chatIndex.read') : t('chatIndex.sent')}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {messages.length > 0 && <div ref={messagesEndRef} />}
        </ScrollArea>

        {/* Order Status Bar */}
        <div className="border-t border-border p-3 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-sm font-medium me-2">{t('chatIndex.orderStatus')}:</div>
              <Badge className={statusConfig[order.status]?.color}>
                <div className="flex items-center space-x-1">
                  {statusConfig[order.status]?.icon}
                  <span>{t(`orders.status.${order.status}`)}</span>
                </div>
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {t('chatIndex.orderNumber', { order: order.order_number })}
            </span>
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-border p-3 bg-card">
          {/* Modern Deliver Work button for freelancers when in_progress */}
          {isFreelancer && order.status === 'in_progress' && (
            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleDeliverWork}
                disabled={isActionProcessing || chatDisabled}
              >
                <Send className="h-4 w-4" /> {t('chatIndex.deliverWork')}
              </Button>
            </div>
          )}

          {/* Show preview for image or chip for any file */}
          {file && (
            <div className="flex items-center mb-3 bg-muted rounded px-3 py-2 relative">
              {fileType === 'image' && previewImage ? (
                <img src={previewImage} alt="Preview" className="max-h-20 w-auto rounded me-2" />
              ) : (
              <FileIcon className="h-4 w-4 me-2" />
              )}
              <span className="text-sm truncate max-w-xs">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ms-2 h-6 w-6 rounded-full"
                onClick={() => { setFile(null); setFileType(null); setPreviewImage(null); }}
                disabled={chatDisabled}
              >
                <X className="h-4 w-4" />
              </Button>
              {isLoading && (
                <span className="ms-2 text-xs text-muted-foreground">{t('chatIndex.uploading')}</span>
              )}
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.zip"
              disabled={chatDisabled}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current.click()}
                  className="rounded-full"
                  disabled={chatDisabled}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('chatIndex.attachFile')}</TooltipContent>
            </Tooltip>
            <Input
              placeholder={chatDisabled ? t('chatIndex.chatDisabledPlaceholder') : t('chatIndex.messagePlaceholder')}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-full px-4 py-2 border-border bg-background focus-visible:ring-1 border "
              disabled={isLoading || chatDisabled}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || (!newMessage.trim() && !file) || chatDisabled}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Send className="h-5 w-5" />
                </motion.div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/80 hover:bg-background"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 right-4">
              <Link
                href={previewImage}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full hover:bg-background/90 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="h-4 w-4" />
                <span>{t('chatIndex.download')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {can_review && (
        <div className="p-4">

        <ReviewForm orderId={order.id} onSuccess={() => router.reload({ only: ['order'] })} />
        </div>
      )}
      
      {review && (
        <div className="p-4 mt-6">
          <ReviewCard review={review} />
        </div>
      )}
    </Layout>
    </TooltipProvider>
  );
}