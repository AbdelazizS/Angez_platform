import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function EditService() {
  const { t } = useTranslation();
  const { service } = usePage().props;
  const { data, setData, patch, processing, errors } = useForm({
    title: service.title || '',
    description: service.description || '',
    category: service.category || '',
    subcategory: service.subcategory || '',
    price: service.price || '',
    delivery_time: service.delivery_time || '',
    revisions: service.revisions || '',
    tags: service.tags || [],
    gallery: service.gallery || [],
    features: service.features || [],
    is_popular: !!service.is_popular,
    is_featured: !!service.is_featured,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(name, type === 'checkbox' ? checked : value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('services.update', service.id));
  };

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">{t('services.edit') || 'Edit Service'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">{t('services.name') || 'Title'}</label>
          <input type="text" name="title" value={data.title} onChange={handleChange} className="w-full border rounded p-2" />
          {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
        </div>
        <div>
          <label className="block font-medium mb-1">{t('services.description') || 'Description'}</label>
          <textarea name="description" value={data.description} onChange={handleChange} className="w-full border rounded p-2" />
          {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
        </div>
        <div>
          <label className="block font-medium mb-1">{t('services.category') || 'Category'}</label>
          <input type="text" name="category" value={data.category} onChange={handleChange} className="w-full border rounded p-2" />
          {errors.category && <div className="text-red-600 text-sm">{errors.category}</div>}
        </div>
        <div>
          <label className="block font-medium mb-1">{t('services.subcategory') || 'Subcategory'}</label>
          <input type="text" name="subcategory" value={data.subcategory} onChange={handleChange} className="w-full border rounded p-2" />
          {errors.subcategory && <div className="text-red-600 text-sm">{errors.subcategory}</div>}
        </div>
        <div>
          <label className="block font-medium mb-1">{t('services.price') || 'Price'}</label>
          <input type="number" name="price" value={data.price} onChange={handleChange} className="w-full border rounded p-2" />
          {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
        </div>
        <div>
          <label className="block font-medium mb-1">{t('services.deliveryTime') || 'Delivery Time'}</label>
          <input type="text" name="delivery_time" value={data.delivery_time} onChange={handleChange} className="w-full border rounded p-2" />
          {errors.delivery_time && <div className="text-red-600 text-sm">{errors.delivery_time}</div>}
        </div>
        <div>
          <label className="block font-medium mb-1">{t('services.revisions') || 'Revisions'}</label>
          <input type="number" name="revisions" value={data.revisions} onChange={handleChange} className="w-full border rounded p-2" />
          {errors.revisions && <div className="text-red-600 text-sm">{errors.revisions}</div>}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input type="checkbox" name="is_popular" checked={data.is_popular} onChange={handleChange} className="mr-2" />
            {t('services.popular') || 'Popular'}
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="is_featured" checked={data.is_featured} onChange={handleChange} className="mr-2" />
            {t('services.featured') || 'Featured'}
          </label>
        </div>
        <Button type="submit" disabled={processing} className="w-full">
          {t('services.save') || 'Save Changes'}
        </Button>
      </form>
    </div>
  );
} 