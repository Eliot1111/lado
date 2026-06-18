export const PHOTOS = [
  'IMG_7277.jpg', 'IMG_7278.jpg', 'IMG_7279.jpg', 'IMG_7280.jpg',
  'IMG_7281.jpg', 'IMG_7282.jpg', 'IMG_7283.jpg', 'IMG_7284.jpg',
  'IMG_7285.jpg', 'IMG_7286.jpg', 'IMG_7287.jpg', 'IMG_7288.jpg',
  'IMG_7289.jpg', 'IMG_7290.jpg', 'IMG_7291.jpg', 'IMG_7292.jpg',
  'IMG_7293.jpg', 'IMG_7294.jpg', 'IMG_7295.jpg', 'IMG_7296.jpg',
  'IMG_7297.jpg',
];

export const MENU_FOOD_PHOTOS = {
  hero: 'IMG_7293.jpg',
  cards: ['IMG_7285.jpg', 'IMG_7279.jpg', 'IMG_7291.jpg', 'IMG_7295.jpg', 'IMG_7288.jpg'],
};

export const photo = (name) => `${import.meta.env.BASE_URL}photos/${name}`;

export const YANDEX_MAPS_URL = 'https://yandex.com/maps/-/CTAe5Rzy';

export const NAV_LINKS = [
  { id: 'about', label: 'О ресторане' },
  { id: 'menu', label: 'Меню' },
  { id: 'gallery', label: 'Галерея' },
  { id: 'reservation', label: 'Бронирование' },
  { id: 'contacts', label: 'Контакты' },
];

export const RESTAURANT = {
  name: 'Ладо',
  tagline: 'Светлый ресторан в Москве',
  phone: '+7 (925) 195-61-69',
  address: 'Москва, Кривоколенный переулок, 9с2',
  hours: 'Ежедневно · 12:00 — 00:00',
  email: 'hello@lado.moscow',
  openedYear: 2026,
};

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

export function sectionT(progress, start, end) {
  return clamp((progress - start) / (end - start), 0, 1);
}
