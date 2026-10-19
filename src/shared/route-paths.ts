export const ROUTE_PATHS = {
  DASHBOARD: '/',
  SHIPPING_BILLS: '/shipping-bills',
  CREATE_BILL: '/shipping-bills/new',
  ESANCHIT_LOCKER: '/esanchit',
  TARIFF_LOOKUP: '/tariff-lookup',
  ICEGATE_UTILITY: '/icegate-utility',
  SETTINGS: '/settings',
} as const;

export type AppRoute = keyof typeof ROUTE_PATHS;
