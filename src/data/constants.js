export const PHOTOS = [
  'IMG_7277.jpg', 'IMG_7278.jpg', 'IMG_7279.jpg', 'IMG_7280.jpg',
  'IMG_7281.jpg', 'IMG_7282.jpg', 'IMG_7283.jpg', 'IMG_7284.jpg',
  'IMG_7285.jpg', 'IMG_7286.jpg', 'IMG_7287.jpg', 'IMG_7288.jpg',
  'IMG_7289.jpg', 'IMG_7290.jpg', 'IMG_7291.jpg', 'IMG_7292.jpg',
  'IMG_7293.jpg', 'IMG_7294.jpg', 'IMG_7295.jpg', 'IMG_7296.jpg',
  'IMG_7297.jpg',
];

// HEIC source for menu — replace with .jpg or .webp if browser support is insufficient
export const MENU_HEIC = '/photos/IMG_7290.HEIC';
export const MENU_IMAGE_FALLBACK = '/photos/IMG_7290.jpg';

export const photo = (name) => `/photos/${name}`;

export const NAV_LINKS = [
  { id: 'about', label: 'О ресторане', hint: 'About' },
  { id: 'menu', label: 'Меню', hint: 'Menu' },
  { id: 'gallery', label: 'Галерея', hint: 'Gallery' },
  { id: 'reservation', label: 'Бронирование', hint: 'Reserve' },
  { id: 'contacts', label: 'Контакты', hint: 'Contact' },
];

export const RESTAURANT = {
  name: 'lado',
  tagline: 'Modern Moscow Dining',
  phone: '+7 (495) 123-45-67',
  address: 'Москва, Патриаршие пруды, 12',
  hours: 'Вт–Вс · 18:00 — 00:00',
  email: 'hello@lado.moscow',
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
