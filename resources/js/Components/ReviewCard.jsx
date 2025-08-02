import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MoreVertical, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';

export function ReviewCardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[70%]" />
      </CardContent>
    </Card>
  );
}

export function ReviewRating({ rating }) {

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
      <span className="text-sm text-muted-foreground ms-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ReviewCard({ review, compact = false, loading = false }) {
  const { t, i18n } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  console.log(review);
  
  if (loading) return <ReviewCardSkeleton />;
  if (!review) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await router.delete(`/client/orders/${review.order_id}/review`, {
        onSuccess: () => {
          toast.success(t('reviews.delete_success'));
          window.location.reload();
        },
        onError: () => {
          toast.error(t('reviews.delete_error'));
        },
        preserveScroll: true,
      });
    } catch (error) {
      toast.error(t('reviews.delete_error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(review.created_at).toLocaleDateString(i18n.language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="w-full max-w-2xl hover:shadow-sm transition-shadow mt-4">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-9 w-9 me-2">
              <AvatarImage src={review.client?.avatar} />
              <AvatarFallback>
                {review.client?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">
                  {review.client?.name || t('reviews.anonymous')}
                </p>
                {!compact && <ReviewRating rating={review.rating} />}
              </div>
              <p className="text-xs text-muted-foreground">
                {formattedDate}
              </p>
            </div>
          </div>
          
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('common.deleting')}
                  </span>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    {t('common.delete')}
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {compact && (
          <div className="mb-2">
            <ReviewRating rating={review.rating} />
          </div>
        )}
        <p className="text-sm text-foreground">
          {review.comment}
        </p>
      </CardContent>
    </Card>
  );
}