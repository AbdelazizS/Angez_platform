import { useTranslation } from 'react-i18next';

export function useBreadcrumbs() {
  const { t } = useTranslation();
  
  const translateBreadcrumb = (key) => {
    return t(`header.breadcrumbs.${key}`, key);
  };
  
  const generateBreadcrumbs = (path) => {
    const segments = path.split('/').filter(Boolean);
    let breadcrumbPath = '';
    
    return segments.map((seg, idx) => {
      breadcrumbPath += `/${seg}`;
      const translatedKey = seg.replace(/-/g, '_');
      
      return {
        label: translateBreadcrumb(translatedKey),
        href: idx < segments.length - 1 ? breadcrumbPath : undefined,
      };
    });
  };
  
  const getCommonBreadcrumbs = () => ({
    dashboard: translateBreadcrumb('dashboard'),
    services: translateBreadcrumb('services'),
    orders: translateBreadcrumb('orders'),
    messages: translateBreadcrumb('messages'),
    wallet: translateBreadcrumb('wallet'),
    profile: translateBreadcrumb('profile'),
    settings: translateBreadcrumb('settings'),
    admin: translateBreadcrumb('admin'),
    users: translateBreadcrumb('users'),
    payments: translateBreadcrumb('payments'),
    reports: translateBreadcrumb('reports'),
    freelancers: translateBreadcrumb('freelancers'),
    clients: translateBreadcrumb('clients'),
    chat: translateBreadcrumb('chat'),
    create: translateBreadcrumb('create'),
    edit: translateBreadcrumb('edit'),
    view: translateBreadcrumb('view'),
    manage: translateBreadcrumb('manage'),
    analytics: translateBreadcrumb('analytics'),
    transactions: translateBreadcrumb('transactions'),
    payouts: translateBreadcrumb('payouts'),
    notifications: translateBreadcrumb('notifications'),
  });
  
  return {
    translateBreadcrumb,
    generateBreadcrumbs,
    getCommonBreadcrumbs,
  };
} 