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
  { id: 3, name: 'Profile', url: '/profile', icon: 'solar:user-bold-duotone' },
];

export const categories = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'History',
  'Fantasy',
  'Mystery',
  'Biography',
  'Novel',
  'Philosophy',
  'Comic',
  'Romance',
  'Buddhism',
  'Hinduism',
  'Islam',
  'Religion',
  'Christianity',
];

export const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Greek',
  'Italy',
  'Ancient',
  'Indonesia',
  'Japanese',
  'Arabic',
];
