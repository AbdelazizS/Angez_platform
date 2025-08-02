import { useTranslation } from 'react-i18next';

export function useRTL() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return {
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'text-right' : 'text-left',
    flexDirection: isRTL ? 'flex-row-reverse' : '',
    borderSide: isRTL ? 'border-r-4' : 'border-l-4',
    marginSide: isRTL ? 'mr-3' : 'ml-3',
    marginAuto: isRTL ? 'mr-auto' : 'ml-auto',
    spaceReverse: isRTL ? 'space-x-reverse' : '',
    dropdownAlign: isRTL ? 'start' : 'end',
    // Utility functions
    getTextAlign: (rtlClass = 'text-right', ltrClass = 'text-left') => 
      isRTL ? rtlClass : ltrClass,
    getBorderSide: (rtlClass = 'border-r-4', ltrClass = 'border-l-4') => 
      isRTL ? rtlClass : ltrClass,
    getMarginSide: (rtlClass = 'mr-3', ltrClass = 'ml-3') => 
      isRTL ? rtlClass : ltrClass,
    getFlexDirection: (rtlClass = 'flex-row-reverse', ltrClass = '') => 
      isRTL ? rtlClass : ltrClass,
    getDropdownAlign: (rtlAlign = 'start', ltrAlign = 'end') => 
      isRTL ? rtlAlign : ltrAlign,
  };
} 