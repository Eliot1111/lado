/**
 * Калорийность — ориентировочная для ресторанной порции
 * (по данным открытых nutrition-справочников и аналогов в ресторанах).
 */
export const MENU_CATEGORIES = [
  {
    id: 'starters',
    title: 'Закуски',
    items: [
      { name: 'Тартар из тунца', desc: 'Авокадо, юдзу, кунжутное масло', price: 1680, calories: 350 },
      { name: 'Утиная грудка', desc: 'Инжир карамелизованный, бальзамический соус', price: 1420, calories: 380 },
      { name: 'Burrata', desc: 'Томаты, масло базилика', price: 1290, calories: 470 },
      { name: 'Осьминог', desc: 'Эмульсия из паприки, обжжённый лук-порей', price: 1890, calories: 280 },
    ],
  },
  {
    id: 'mains',
    title: 'Основные блюда',
    items: [
      { name: 'Стейк ribeye', desc: 'Dry-aged 45 дней, масло из костного мозга', price: 4200, calories: 780 },
      { name: 'Дикий лосось', desc: 'Бёль-бланс с шампанским, икра', price: 2980, calories: 410 },
      { name: 'Утка confit', desc: 'Вишнёвый глазур, пюре из пастернака', price: 2650, calories: 520 },
      { name: 'Ризотто с трюфелем', desc: 'Чёрный трюфель, выдержанный пармезан', price: 2340, calories: 480 },
    ],
  },
  {
    id: 'desserts',
    title: 'Десерты',
    items: [
      { name: 'Soufflé au chocolat', desc: 'Valrhona 70%, золотой лист', price: 980, calories: 380 },
      { name: 'Crème brûlée', desc: 'Ваниль Мадагаскар, ягоды', price: 890, calories: 340 },
      { name: 'Mille-feuille', desc: 'Фисташковый крем, розовая вода', price: 920, calories: 430 },
      { name: 'Sorbet trio', desc: 'Сезонные фрукты, меренга', price: 760, calories: 190 },
    ],
  },
  {
    id: 'drinks',
    title: 'Напитки',
    items: [
      { name: 'Signature Negroni', desc: 'Выдержанный джин, домашний вермут', price: 1100, calories: 200 },
      { name: 'Champagne Ruinart', desc: 'Blanc de Blancs, бокал', price: 2400, calories: 95 },
      { name: 'Old Fashioned', desc: 'Односолодовый виски, демерара, биттер', price: 980, calories: 175 },
      { name: 'Sommelier pairing', desc: '4 вина, подобранных к вашему меню', price: 5800, calories: 320 },
    ],
  },
];

export function formatPrice(rub) {
  return `${rub.toLocaleString('ru-RU')} ₽`;
}

export function formatCalories(kcal) {
  return `~${kcal} ккал`;
}
