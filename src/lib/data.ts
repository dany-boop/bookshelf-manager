export interface Menu {
  id: number;
  name: string;
  url: string;
  icon: string;
}

export const menu: Menu[] = [
  {
    id: 1,
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'solar:home-line-duotone',
  },
  { id: 2, name: 'Catalog', url: '/catalog', icon: 'ph:books-duotone' },
];
