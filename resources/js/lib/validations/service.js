import { z } from 'zod';

export function createServiceSchema(t) {
  return z.object({
    title: z.string()
      .min(3, t('freelancerServiceCreate.validation.title.min'))
      .max(255, t('freelancerServiceCreate.validation.title.max')),
    title_ar: z.string().optional(),
    description: z.string()
      .min(10, t('freelancerServiceCreate.validation.description.min'))
      .max(1000, t('freelancerServiceCreate.validation.description.max')),
    description_ar: z.string().optional(),
    detailed_description: z.string().optional(),
    detailed_description_ar: z.string().optional(),
    category: z.string()
      .min(2, t('freelancerServiceCreate.validation.category.min'))
      .max(100, t('freelancerServiceCreate.validation.category.max')),
    category_ar: z.string().optional(),
    subcategory: z.string().optional(),
    subcategory_ar: z.string().optional(),
    price: z.coerce.number()
      .min(1, t('freelancerServiceCreate.validation.price.min')),
    delivery_time: z.string()
      .min(2, t('freelancerServiceCreate.validation.deliveryTime.min'))
      .max(100, t('freelancerServiceCreate.validation.deliveryTime.max')),
    delivery_time_ar: z.string().optional(),
    revisions: z.coerce.number()
      .min(1, t('freelancerServiceCreate.validation.revisions.min'))
      .default(2)
      .refine((val) => val >= 1, {
        message: t('freelancerServiceCreate.validation.revisions.required')
      }),
    tags: z.array(z.string())
      .min(2, t('freelancerServiceCreate.validation.tags.min'))
      .max(10, t('freelancerServiceCreate.validation.tags.max')),
    tags_ar: z.array(z.string()).optional(),
    features: z.array(z.string())
      .min(2, t('freelancerServiceCreate.validation.features.min'))
      .max(15, t('freelancerServiceCreate.validation.features.max')),
    features_ar: z.array(z.string()).optional(),
    packages: z.array(z.object({
      name: z.string().optional(),
      price: z.string().optional(),
      delivery_time: z.string().optional(),
      revisions: z.string().optional(),
      features: z.array(z.string()).optional(),
    })).optional(),
    packages_ar: z.array(z.object({
      name: z.string().optional(),
      price: z.string().optional(),
      delivery_time: z.string().optional(),
      revisions: z.string().optional(),
      features: z.array(z.string()).optional(),
    })).optional(),
    faq: z.array(z.object({
      question: z.string().optional(),
      answer: z.string().optional(),
    })).optional(),
    faq_ar: z.array(z.object({
      question: z.string().optional(),
      answer: z.string().optional(),
    })).optional(),
  });
} 