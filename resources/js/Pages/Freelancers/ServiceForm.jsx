import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/Components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { ChevronDown, Globe, Languages, Info, HelpCircle } from 'lucide-react';
import { createServiceSchema } from '@/lib/validations/service';

function ArrayInput({ label, name, value, onChange, error, placeholder, description, t, trigger }) {
  const [input, setInput] = React.useState('');
  
  function addItem(e) {
    e.preventDefault();
    if (input.trim()) {
      const newValue = [...value, input.trim()];
      onChange(name, newValue);
      setInput('');
      // Trigger validation after adding item
      if (trigger) {
        trigger(name);
      }
    }
  }
  
  function removeItem(idx) {
    const newValue = value.filter((_, i) => i !== idx);
    onChange(name, newValue);
    // Trigger validation after removing item
    if (trigger) {
      trigger(name);
    }
  }
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}
      <div className="flex gap-2 mb-2">
        <Input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder={placeholder}
          onKeyPress={e => e.key === 'Enter' && addItem(e)}
        />
        <Button type="button" onClick={addItem} size="sm">
          {t('freelancerServiceCreate.fields.tags.addButton')}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((item, idx) => (
          <span key={idx} className="inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-sm">
            {item}
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="ms-1 text-red-500 hover:text-red-700" 
              onClick={() => removeItem(idx)}
            >
              &times;
            </Button>
          </span>
        ))}
      </div>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
}

function PackagesInput({ value, onChange, error, t }) {
  function addPackage() {
    onChange('packages', [...value, { name: '', price: '', delivery_time: '', revisions: '', features: [] }]);
  }
  
  function updatePackage(idx, field, val) {
    const updated = value.map((pkg, i) => i === idx ? { ...pkg, [field]: val } : pkg);
    onChange('packages', updated);
  }
  
  function removePackage(idx) {
    onChange('packages', value.filter((_, i) => i !== idx));
  }
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{t('freelancerServiceCreate.fields.packages.label')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('freelancerServiceCreate.fields.packages.description')}</p>
        <Button type="button" onClick={addPackage} size="sm" className="mt-2">
          {t('freelancerServiceCreate.fields.packages.addButton')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {value.map((pkg, idx) => (
          <Card key={idx} className="p-4 space-y-3 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input 
                placeholder={t('freelancerServiceCreate.fields.packages.name')} 
                value={pkg.name} 
                onChange={e => updatePackage(idx, 'name', e.target.value)} 
              />
              <Input 
                type="number" 
                placeholder={t('freelancerServiceCreate.fields.packages.price')} 
                value={pkg.price} 
                onChange={e => updatePackage(idx, 'price', e.target.value)} 
              />
              <Input 
                placeholder={t('freelancerServiceCreate.fields.packages.deliveryTime')} 
                value={pkg.delivery_time} 
                onChange={e => updatePackage(idx, 'delivery_time', e.target.value)} 
              />
              <Input 
                type="number" 
                placeholder={t('freelancerServiceCreate.fields.packages.revisions')} 
                value={pkg.revisions} 
                onChange={e => updatePackage(idx, 'revisions', e.target.value)} 
              />
            </div>
            <div className="flex justify-between items-center">
              <ArrayInput 
                label={t('freelancerServiceCreate.fields.features.label')} 
                name="features" 
                value={pkg.features || []} 
                onChange={(n, v) => updatePackage(idx, 'features', v)}
                placeholder={t('freelancerServiceCreate.fields.features.placeholder')}
                t={t}
              />
              <Button 
                type="button" 
                size="sm" 
                variant="destructive" 
                onClick={() => removePackage(idx)}
              >
                {t('freelancerServiceCreate.fields.packages.removeButton')}
              </Button>
            </div>
          </Card>
        ))}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </CardContent>
    </Card>
  );
}

function FAQInput({ value, onChange, t }) {
  function addFAQ() {
    onChange('faq', [...value, { question: '', answer: '' }]);
  }
  
  function updateFAQ(idx, field, val) {
    const updated = value.map((faq, i) => i === idx ? { ...faq, [field]: val } : faq);
    onChange('faq', updated);
  }
  
  function removeFAQ(idx) {
    onChange('faq', value.filter((_, i) => i !== idx));
  }
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{t('freelancerServiceCreate.fields.faq.label')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('freelancerServiceCreate.fields.faq.description')}</p>
        <Button type="button" onClick={addFAQ} size="sm" className="mt-2">
          {t('freelancerServiceCreate.fields.faq.addButton')}
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {value.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger>
                <span>{faq.question || `${t('freelancerServiceCreate.fields.faq.label')} #${idx + 1}`}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <Input 
                    placeholder={t('freelancerServiceCreate.fields.faq.question')} 
                    value={faq.question} 
                    onChange={e => updateFAQ(idx, 'question', e.target.value)} 
                  />
                  <Textarea 
                    placeholder={t('freelancerServiceCreate.fields.faq.answer')} 
                    value={faq.answer} 
                    onChange={e => updateFAQ(idx, 'answer', e.target.value)} 
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => removeFAQ(idx)}
                  >
                    {t('freelancerServiceCreate.fields.faq.removeButton')}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default function ServiceForm({ initialData = {}, onSubmit, errors = {}, processing, submitLabel = 'Save' }) {
  const { t } = useTranslation();
  
    const methods = useForm({
    resolver: zodResolver(createServiceSchema(t)),
    defaultValues: {
      title: initialData.title || '',
      title_ar: initialData.title_ar || '',
      description: initialData.description || '',
      description_ar: initialData.description_ar || '',
      detailed_description: initialData.detailed_description || '',
      detailed_description_ar: initialData.detailed_description_ar || '',
      category: initialData.category || '',
      category_ar: initialData.category_ar || '',
      subcategory: initialData.subcategory || '',
      subcategory_ar: initialData.subcategory_ar || '',
      price: initialData.price || '',
      delivery_time: initialData.delivery_time || '',
      delivery_time_ar: initialData.delivery_time_ar || '',
      revisions: initialData.revisions || 2,
      tags: initialData.tags || [],
      tags_ar: initialData.tags_ar || [],
      features: initialData.features || [],
      features_ar: initialData.features_ar || [],
      packages: initialData.packages || [],
      packages_ar: initialData.packages_ar || [],
      faq: initialData.faq || [],
      faq_ar: initialData.faq_ar || [],
    },
    mode: 'onChange'
  });

  const { register, handleSubmit, formState: { errors: formErrors }, setValue, watch } = methods;

  // Check if any Arabic content exists
  const hasArabicContent = React.useMemo(() => {
    const data = watch();
    return data.title_ar || data.description_ar || data.detailed_description_ar || 
           data.category_ar || data.subcategory_ar || data.delivery_time_ar ||
           (data.tags_ar && data.tags_ar.length > 0) || 
           (data.features_ar && data.features_ar.length > 0) ||
           (data.packages_ar && data.packages_ar.length > 0) ||
           (data.faq_ar && data.faq_ar.length > 0);
  }, [watch]);

  function handleArrayChange(name, value) {
    setValue(name, value);
  }

  function handleFormSubmit(data) {
    onSubmit(data);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 w-full">
      {/* Primary Language Section (English) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Globe className="w-5 h-5" />
            <span>{t('freelancerServiceCreate.primaryInfo')}</span>
        </div>
        
        <div>
            <Label htmlFor="title" className="text-sm font-medium">
              {t('freelancerServiceCreate.fields.title.label')} *
            </Label>
            <Input 
              id="title" 
              {...register('title')} 
              placeholder={t('freelancerServiceCreate.fields.title.placeholder')}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t('freelancerServiceCreate.fields.title.description')}
            </p>
            {formErrors.title && (
              <div className="text-red-600 text-sm mt-1">{formErrors.title.message}</div>
            )}
            {errors.title && (
              <div className="text-red-600 text-sm mt-1">{errors.title}</div>
            )}
        </div>

        <div>
            <Label htmlFor="description" className="text-sm font-medium">
              {t('freelancerServiceCreate.fields.description.label')} *
            </Label>
            <Textarea 
              id="description" 
              {...register('description')} 
              placeholder={t('freelancerServiceCreate.fields.description.placeholder')}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t('freelancerServiceCreate.fields.description.description')}
            </p>
            {formErrors.description && (
              <div className="text-red-600 text-sm mt-1">{formErrors.description.message}</div>
            )}
            {errors.description && (
              <div className="text-red-600 text-sm mt-1">{errors.description}</div>
            )}
        </div>

        <div>
            <Label htmlFor="detailed_description" className="text-sm font-medium">
              {t('freelancerServiceCreate.fields.detailedDescription.label')}
            </Label>
            <Textarea 
              id="detailed_description" 
              {...register('detailed_description')} 
              placeholder={t('freelancerServiceCreate.fields.detailedDescription.placeholder')}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t('freelancerServiceCreate.fields.detailedDescription.description')}
            </p>
            {formErrors.detailed_description && (
              <div className="text-red-600 text-sm mt-1">{formErrors.detailed_description.message}</div>
            )}
            {errors.detailed_description && (
              <div className="text-red-600 text-sm mt-1">{errors.detailed_description}</div>
            )}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
              <Label htmlFor="category" className="text-sm font-medium">
                {t('freelancerServiceCreate.fields.category.label')} *
              </Label>
              <Input 
                id="category" 
                {...register('category')} 
                placeholder={t('freelancerServiceCreate.fields.category.placeholder')}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('freelancerServiceCreate.fields.category.description')}
              </p>
              {formErrors.category && (
                <div className="text-red-600 text-sm mt-1">{formErrors.category.message}</div>
              )}
              {errors.category && (
                <div className="text-red-600 text-sm mt-1">{errors.category}</div>
              )}
        </div>
        <div>
              <Label htmlFor="subcategory" className="text-sm font-medium">
                {t('freelancerServiceCreate.fields.subcategory.label')}
              </Label>
              <Input 
                id="subcategory" 
                {...register('subcategory')} 
                placeholder={t('freelancerServiceCreate.fields.subcategory.placeholder')}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('freelancerServiceCreate.fields.subcategory.description')}
              </p>
              {formErrors.subcategory && (
                <div className="text-red-600 text-sm mt-1">{formErrors.subcategory.message}</div>
              )}
              {errors.subcategory && (
                <div className="text-red-600 text-sm mt-1">{errors.subcategory}</div>
              )}
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
              <Label htmlFor="price" className="text-sm font-medium">
                {t('freelancerServiceCreate.fields.price.label')} *
              </Label>
              <Input 
                id="price" 
                type="number" 
                {...register('price')} 
                placeholder={t('freelancerServiceCreate.fields.price.placeholder')}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('freelancerServiceCreate.fields.price.description')}
              </p>
              {formErrors.price && (
                <div className="text-red-600 text-sm mt-1">{formErrors.price.message}</div>
              )}
              {errors.price && (
                <div className="text-red-600 text-sm mt-1">{errors.price}</div>
              )}
        </div>
        <div>
              <Label htmlFor="delivery_time" className="text-sm font-medium">
                {t('freelancerServiceCreate.fields.deliveryTime.label')} *
              </Label>
              <Input 
                id="delivery_time" 
                {...register('delivery_time')} 
                placeholder={t('freelancerServiceCreate.fields.deliveryTime.placeholder')}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('freelancerServiceCreate.fields.deliveryTime.description')}
              </p>
              {formErrors.delivery_time && (
                <div className="text-red-600 text-sm mt-1">{formErrors.delivery_time.message}</div>
              )}
              {errors.delivery_time && (
                <div className="text-red-600 text-sm mt-1">{errors.delivery_time}</div>
              )}
        </div>
                    <div>
              <Label htmlFor="revisions" className="text-sm font-medium">
                {t('freelancerServiceCreate.fields.revisions.label')} *
              </Label>
              <Input 
                id="revisions" 
                type="number" 
                {...register('revisions')} 
                placeholder={t('freelancerServiceCreate.fields.revisions.placeholder')}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t('freelancerServiceCreate.fields.revisions.helpText')}
              </p>
              <p className="text-sm text-amber-600 mt-1 font-medium">
                ⚠️ {t('freelancerServiceCreate.fields.revisions.warning')}
              </p>
              {formErrors.revisions && (
                <div className="text-red-600 text-sm mt-1">{formErrors.revisions.message}</div>
              )}
              {errors.revisions && (
                <div className="text-red-600 text-sm mt-1">{errors.revisions}</div>
              )}
            </div>
          </div>

          <ArrayInput 
            label={t('freelancerServiceCreate.fields.tags.label')} 
            name="tags" 
            value={watch('tags')} 
            onChange={handleArrayChange} 
            error={formErrors.tags?.message || errors.tags}
            placeholder={t('freelancerServiceCreate.fields.tags.placeholder')}
            description={t('freelancerServiceCreate.fields.tags.description')}
            t={t}
            trigger={methods.trigger}
          />
          
          <ArrayInput 
            label={t('freelancerServiceCreate.fields.features.label')} 
            name="features" 
            value={watch('features')} 
            onChange={handleArrayChange} 
            error={formErrors.features?.message || errors.features}
            placeholder={t('freelancerServiceCreate.fields.features.placeholder')}
            description={t('freelancerServiceCreate.fields.features.description')}
            t={t}
            trigger={methods.trigger}
          />
          
          <PackagesInput 
            value={watch('packages')} 
            onChange={handleArrayChange} 
            error={errors.packages}
            t={t}
          />
          
          <FAQInput 
            value={watch('faq')} 
            onChange={handleArrayChange}
            t={t}
          />
      </div>

      {/* Optional Arabic Section */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="arabic-content" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              <span className="font-medium">
                  {hasArabicContent ? t('freelancerServiceCreate.arabicContent') : t('freelancerServiceCreate.wantToAddArabic')}
                </span>
                {hasArabicContent && (
                  <span className="ms-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {t('freelancerServiceCreate.hasContent')}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-6 pt-4">
              <div className="text-sm text-gray-600 mb-4">
                  {t('freelancerServiceCreate.arabicContentDesc')}
              </div>

              <div>
                  <Label htmlFor="title_ar" className="text-sm font-medium">
                    {t('freelancerServiceCreate.fields.title.label')} (العربية)
                  </Label>
                  <Input 
                    id="title_ar" 
                    {...register('title_ar')} 
                    placeholder="عنوان الخدمة" 
                    dir="rtl" 
                    className="mt-1"
                  />
                  {errors.title_ar && (
                    <div className="text-red-600 text-sm mt-1">{errors.title_ar}</div>
                  )}
              </div>

              <div>
                  <Label htmlFor="description_ar" className="text-sm font-medium">
                    {t('freelancerServiceCreate.fields.description.label')} (العربية)
                  </Label>
                  <Textarea 
                    id="description_ar" 
                    {...register('description_ar')} 
                    placeholder="وصف الخدمة" 
                    dir="rtl" 
                    className="mt-1"
                  />
                  {errors.description_ar && (
                    <div className="text-red-600 text-sm mt-1">{errors.description_ar}</div>
                  )}
              </div>

              <div>
                  <Label htmlFor="detailed_description_ar" className="text-sm font-medium">
                    {t('freelancerServiceCreate.fields.detailedDescription.label')} (العربية)
                  </Label>
                  <Textarea 
                    id="detailed_description_ar" 
                    {...register('detailed_description_ar')} 
                    placeholder="وصف مفصل للخدمة" 
                    dir="rtl" 
                    className="mt-1"
                  />
                  {errors.detailed_description_ar && (
                    <div className="text-red-600 text-sm mt-1">{errors.detailed_description_ar}</div>
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="category_ar" className="text-sm font-medium">
                      {t('freelancerServiceCreate.fields.category.label')} (العربية)
                    </Label>
                    <Input 
                      id="category_ar" 
                      {...register('category_ar')} 
                      placeholder="مثال: تطوير الويب" 
                      dir="rtl" 
                      className="mt-1"
                    />
                    {errors.category_ar && (
                      <div className="text-red-600 text-sm mt-1">{errors.category_ar}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="subcategory_ar" className="text-sm font-medium">
                      {t('freelancerServiceCreate.fields.subcategory.label')} (العربية)
                    </Label>
                    <Input 
                      id="subcategory_ar" 
                      {...register('subcategory_ar')} 
                      placeholder="مثال: تطوير React" 
                      dir="rtl" 
                      className="mt-1"
                    />
                    {errors.subcategory_ar && (
                      <div className="text-red-600 text-sm mt-1">{errors.subcategory_ar}</div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="delivery_time_ar" className="text-sm font-medium">
                    {t('freelancerServiceCreate.fields.deliveryTime.label')} (العربية)
                  </Label>
                  <Input 
                    id="delivery_time_ar" 
                    {...register('delivery_time_ar')} 
                    placeholder="مثال: 3-5 أيام" 
                    dir="rtl" 
                    className="mt-1"
                  />
                  {errors.delivery_time_ar && (
                    <div className="text-red-600 text-sm mt-1">{errors.delivery_time_ar}</div>
                  )}
              </div>

                <ArrayInput 
                  label={`${t('freelancerServiceCreate.fields.tags.label')} (العربية)`} 
                  name="tags_ar" 
                  value={watch('tags_ar')} 
                  onChange={handleArrayChange} 
                  error={errors.tags_ar}
                  placeholder="إضافة وسم..."
                  t={t}
                  trigger={methods.trigger}
                />
                
                <ArrayInput 
                  label={`${t('freelancerServiceCreate.fields.features.label')} (العربية)`} 
                  name="features_ar" 
                  value={watch('features_ar')} 
                  onChange={handleArrayChange} 
                  error={errors.features_ar}
                  placeholder="إضافة ميزة..."
                  t={t}
                  trigger={methods.trigger}
                />
              
              {/* Arabic Packages */}
              <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-lg">{t('freelancerServiceCreate.fields.packages.label')} (العربية)</CardTitle>
                    <Button 
                      type="button" 
                      onClick={() => handleArrayChange('packages_ar', [...(watch('packages_ar') || []), { name: '', price: '', delivery_time: '', revisions: '', features: [] }])} 
                      size="sm" 
                      className="mt-2"
                    >
                      {t('freelancerServiceCreate.fields.packages.addButton')}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(watch('packages_ar') || []).map((pkg, idx) => (
                      <Card key={idx} className="p-4 space-y-3 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <Input 
                            placeholder="الاسم (العربية)" 
                            value={pkg.name} 
                            onChange={e => {
                              const updated = (watch('packages_ar') || []).map((p, i) => i === idx ? { ...p, name: e.target.value } : p);
                          handleArrayChange('packages_ar', updated);
                            }} 
                            dir="rtl" 
                          />
                          <Input 
                            type="number" 
                            placeholder={t('freelancerServiceCreate.fields.packages.price')} 
                            value={pkg.price} 
                            onChange={e => {
                              const updated = (watch('packages_ar') || []).map((p, i) => i === idx ? { ...p, price: e.target.value } : p);
                          handleArrayChange('packages_ar', updated);
                            }} 
                          />
                          <Input 
                            placeholder="وقت التسليم (العربية)" 
                            value={pkg.delivery_time} 
                            onChange={e => {
                              const updated = (watch('packages_ar') || []).map((p, i) => i === idx ? { ...p, delivery_time: e.target.value } : p);
                          handleArrayChange('packages_ar', updated);
                            }} 
                            dir="rtl" 
                          />
                          <Input 
                            type="number" 
                            placeholder={t('freelancerServiceCreate.fields.packages.revisions')} 
                            value={pkg.revisions} 
                            onChange={e => {
                              const updated = (watch('packages_ar') || []).map((p, i) => i === idx ? { ...p, revisions: e.target.value } : p);
                          handleArrayChange('packages_ar', updated);
                            }} 
                          />
                        </div>
                                                 <div className="flex justify-between items-center">
                           <ArrayInput 
                             label={`${t('freelancerServiceCreate.fields.features.label')} (العربية)`} 
                             name="features" 
                             value={pkg.features || []} 
                             onChange={(n, v) => {
                               const updated = (watch('packages_ar') || []).map((p, i) => i === idx ? { ...p, features: v } : p);
                               handleArrayChange('packages_ar', updated);
                             }}
                             placeholder={`${t('freelancerServiceCreate.fields.features.placeholder')} (العربية)`}
                             t={t}
                             trigger={methods.trigger}
                           />
                           <Button 
                             type="button" 
                             size="sm" 
                             variant="destructive" 
                             onClick={() => {
                               handleArrayChange('packages_ar', (watch('packages_ar') || []).filter((_, i) => i !== idx));
                             }}
                           >
                             {t('freelancerServiceCreate.fields.packages.removeButton')}
                           </Button>
                         </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Arabic FAQ */}
              <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-lg">{t('freelancerServiceCreate.fields.faq.label')} (العربية)</CardTitle>
                    <Button 
                      type="button" 
                      onClick={() => handleArrayChange('faq_ar', [...(watch('faq_ar') || []), { question: '', answer: '' }])} 
                      size="sm" 
                      className="mt-2"
                    >
                      {t('freelancerServiceCreate.fields.faq.addButton')}
                    </Button>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                      {(watch('faq_ar') || []).map((faq, idx) => (
                      <AccordionItem key={idx} value={`faq-ar-${idx}`}>
                        <AccordionTrigger>
                            <span>{faq.question || `${t('freelancerServiceCreate.fields.faq.label')} #${idx + 1} (العربية)`}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3">
                              <Input 
                                placeholder="السؤال (العربية)" 
                                value={faq.question} 
                                onChange={e => {
                                  const updated = (watch('faq_ar') || []).map((f, i) => i === idx ? { ...f, question: e.target.value } : f);
                              handleArrayChange('faq_ar', updated);
                                }} 
                                dir="rtl" 
                              />
                              <Textarea 
                                placeholder="الإجابة (العربية)" 
                                value={faq.answer} 
                                onChange={e => {
                                  const updated = (watch('faq_ar') || []).map((f, i) => i === idx ? { ...f, answer: e.target.value } : f);
                              handleArrayChange('faq_ar', updated);
                                }} 
                                dir="rtl" 
                              />
                              <Button 
                                type="button" 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => {
                                  handleArrayChange('faq_ar', (watch('faq_ar') || []).filter((_, i) => i !== idx));
                                }}
                              >
                                {t('freelancerServiceCreate.fields.faq.removeButton')}
                              </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button type="submit" disabled={processing} className="w-full">
          {processing ? t('freelancerServiceCreate.creating') : submitLabel}
      </Button>
    </form>
    </FormProvider>
  );
} 