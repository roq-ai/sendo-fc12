const mapping: Record<string, string> = {
  airlines: 'airline',
  'luggage-delivery-orders': 'luggage_delivery_order',
  porters: 'porter',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
