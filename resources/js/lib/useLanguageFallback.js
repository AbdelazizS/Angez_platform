import { useLanguageChange } from './useLanguageChange';

/**
 * Hook to get content in the preferred language with fallback to English
 * @param {Object} content - Object containing content in different languages
 * @param {string} content.en - English content
 * @param {string} content.ar - Arabic content
 * @returns {string} Content in preferred language or fallback to English
 */
export function useLanguageFallback(content) {
  const { isRTL } = useLanguageChange();
  
  // If RTL (Arabic) and Arabic content exists, use Arabic
  if (isRTL && content.ar && content.ar.trim()) {
    return content.ar;
  }
  
  // Otherwise, use English content
  return content.en || content.ar || '';
}

/**
 * Hook to get content with language fallback for multiple fields
 * @param {Object} service - Service object with language fields
 * @returns {Object} Service content in preferred language
 */
export function useServiceLanguageFallback(service) {
  const { isRTL } = useLanguageChange();
  
  const getContent = (enField, arField) => {
    if (isRTL && service[arField] && service[arField].trim()) {
      return service[arField];
    }
    return service[enField] || service[arField] || '';
  };

  const getArrayContent = (enField, arField) => {
    if (isRTL && service[arField] && service[arField].length > 0) {
      return service[arField];
    }
    return service[enField] || service[arField] || [];
  };

  return {
    title: getContent('title', 'title_ar'),
    description: getContent('description', 'description_ar'),
    detailedDescription: getContent('detailed_description', 'detailed_description_ar'),
    category: getContent('category', 'category_ar'),
    subcategory: getContent('subcategory', 'subcategory_ar'),
    deliveryTime: getContent('delivery_time', 'delivery_time_ar'),
    tags: getArrayContent('tags', 'tags_ar'),
    features: getArrayContent('features', 'features_ar'),
    packages: getArrayContent('packages', 'packages_ar'),
    faq: getArrayContent('faq', 'faq_ar'),
    dynamicSections: service.dynamic_sections || [],
  };
} 