import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_CATEGORIES, formatPrice } from '../data/menu';
import { MENU_HEIC, MENU_IMAGE_FALLBACK } from '../data/constants';
import { useHeicImage } from '../hooks/useHeicImage';
import styles from './Menu.module.css';

export default function Menu() {
  const [active, setActive] = useState('starters');
  const { src: menuBg, ready } = useHeicImage(MENU_HEIC, MENU_IMAGE_FALLBACK);
  const category = MENU_CATEGORIES.find((c) => c.id === active);

  return (
    <section id="menu" className={styles.menu}>
      <div className="container">
        <div className={styles.header}>
          <p className="section-label">Menu</p>
          <h2 className="section-title">Сезонная карта</h2>
          <p className="section-desc">
            Меню обновляется вместе с сезоном. Каждое блюдо — баланс текстур,
            ароматов и визуальной подачи.
          </p>
        </div>

        <div className={styles.layout}>
          <div
            className={styles.visualPanel}
            style={{ backgroundImage: ready ? `url(${menuBg})` : undefined }}
          >
            <div className={styles.visualOverlay} />
            <div className={styles.visualContent}>
              <span className={styles.visualTag}>Chef&apos;s selection</span>
              <p className={styles.visualQuote}>
                «Каждый вечер — новая история на тарелке»
              </p>
            </div>
            {/* Fallback note: swap MENU_HEIC → MENU_IMAGE_FALLBACK or .webp in constants.js */}
          </div>

          <div className={styles.menuPanel}>
            <div className={styles.tabs}>
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.tab} ${active === cat.id ? styles.tabActive : ''}`}
                  onClick={() => setActive(cat.id)}
                >
                  <span className={styles.tabEn}>{cat.title}</span>
                  <span className={styles.tabRu}>{cat.subtitle}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className={styles.items}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {category.items.map((item, i) => (
                  <motion.article
                    key={item.name}
                    className={styles.item}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <div className={styles.itemHead}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                    </div>
                    <p className={styles.itemDesc}>{item.desc}</p>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
