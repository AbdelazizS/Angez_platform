import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { router, usePage } from '@inertiajs/react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';

export default function ReviewForm({ orderId, onSuccess }) {
  const { t } = useTranslation();
  const { errors: pageErrors } = usePage().props;
  const [hoverRating, setHoverRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  const currentRating = watch('rating');
  const currentComment = watch('comment');

  const handleRatingClick = (value) => {
    setValue('rating', value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await router.post(
        `/client/orders/${orderId}/review`,
        data,
        {
          onSuccess: () => {
            toast.success(t('reviews.submitted'), {
              description: t('reviews.thank_you'),
            });
            onSuccess?.();
          },
          onError: (err) => {
            const errorMessage = 
              pageErrors?.rating || 
              pageErrors?.comment || 
              pageErrors?.review || 
              t('reviews.submit_error');
            
            toast.error(t('reviews.submission_failed'), {
              description: errorMessage,
            });
          },
          preserveScroll: true,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mt-4 p-4">
      <CardHeader>
        <CardTitle className="text-lg">{t('reviews.leave_review')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rating">{t('reviews.rating')}</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="relative"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      (hoverRating ?? currentRating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-muted-foreground ms-2">
                {currentRating}/5
              </span>
            </div>
            {(errors.rating || pageErrors?.rating) && (
              <p className="text-sm text-destructive">
                {errors.rating?.message || pageErrors?.rating}
              </p>
            )}
            <input
              type="hidden"
              {...register('rating', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">{t('reviews.comment')}</Label>
            <Textarea
              id="comment"
              {...register('comment', { 
                required: t('reviews.comment_required'),
                minLength: {
                  value: 10,
                  message: t('reviews.comment_min_length')
                },
                maxLength: {
                  value: 2000,
                  message: t('reviews.comment_max_length')
                }
              })}
              placeholder={t('reviews.comment_placeholder')}
              className="min-h-[120px]"
            />
            <div className="flex justify-between items-center">
              {(errors.comment || pageErrors?.comment) && (
                <p className="text-sm text-destructive">
                  {errors.comment?.message || pageErrors?.comment}
                </p>
              )}
              <span className="text-xs text-muted-foreground ms-auto">
                {currentComment?.length || 0}/2000
              </span>
            </div>
          </div>

          {pageErrors?.review && (
            <p className="text-sm text-destructive">{pageErrors.review}</p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                {t('reviews.submitting')}
              </>
            ) : (
              t('reviews.submit')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}