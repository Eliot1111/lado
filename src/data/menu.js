export const MENU_CATEGORIES = [
  {
    id: 'starters',
    title: 'Starters',
    subtitle: 'Закуски',
    items: [
      { name: 'Тартар из тунца', desc: 'Авocado, юдзу, кунжутное масло', price: 1680 },
      { name: 'Утиная грудка', desc: 'Кaramelized fig, бalsamic reduction', price: 1420 },
      { name: 'Бurrata', desc: 'Heirloom tomatoes, basil oil', price: 1290 },
      { name: 'Осьминог', desc: 'Paprika emulsion, charred leek', price: 1890 },
    ],
  },
  {
    id: 'mains',
    title: 'Main Courses',
    subtitle: 'Основные блюда',
    items: [
      { name: 'Стейк ribeye', desc: 'Dry-aged 45 days, bone marrow butter', price: 4200 },
      { name: 'Дикий лосось', desc: 'Champagne beurre blanc, caviar', price: 2980 },
      { name: 'Утка confit', desc: 'Cherry glaze, parsnip purée', price: 2650 },
      { name: 'Ризotto с трюфелем', desc: 'Black truffle, aged parmesan', price: 2340 },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    subtitle: 'Десерты',
    items: [
      { name: 'Soufflé au chocolat', desc: 'Valrhona 70%, gold leaf', price: 980 },
      { name: 'Crème brûlée', desc: 'Madagascar vanilla, berries', price: 890 },
      { name: 'Mille-feuille', desc: 'Pistachio cream, rose water', price: 920 },
      { name: 'Sorbet trio', desc: 'Seasonal fruits, meringue', price: 760 },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    subtitle: 'Напитки',
    items: [
      { name: 'Signature Negroni', desc: 'Barrel-aged gin, house vermouth', price: 1100 },
      { name: 'Champagne Ruinart', desc: 'Blanc de Blancs, glass', price: 2400 },
      { name: 'Old Fashioned', desc: 'Single malt, demerara, bitters', price: 980 },
      { name: 'Sommelier pairing', desc: '4 wines, curated for your menu', price: 5800 },
    ],
  },
];

export function formatPrice(rub) {
  return `${rub.toLocaleString('ru-RU')} ₽`;
}
