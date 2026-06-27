import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MENU_FOOD_PHOTOS, photo } from '../data/constants';
import { MENU_CATEGORIES, formatPrice, formatCalories } from '../data/menu';
import styles from './Menu.module.css';

export default function Menu() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const [active, setActive] = useState(MENU_CATEGORIES[0].id);
  const category = MENU_CATEGORIES.find((c) => c.id === active);

  return (
    <section id="menu" className={styles.menu} ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Меню</h2>
          <p className="section-desc">
            Авторские блюда, сезонные продукты и летнее настроение в каждой подаче.
          </p>
        </motion.div>

        <motion.div
          className={styles.composition}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <div className={styles.heroPhoto}>
            <img
              src={photo(MENU_FOOD_PHOTOS.hero)}
              alt="Авторское блюдо в ресторане Ладо"
              loading="lazy"
            />
            <div className={styles.heroOverlay} />
          </div>

          <div className={styles.cards}>
            {MENU_FOOD_PHOTOS.cards.map((name, i) => (
              <motion.figure
                key={name}
                className={styles.card}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }}
              >
                <img src={photo(name)} alt="" loading="lazy" />
              </motion.figure>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.menuPanel}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <div className={styles.tabs}>
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.tab} ${active === cat.id ? styles.tabActive : ''}`}
                onClick={() => setActive(cat.id)}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <ul className={styles.items}>
            {category.items.map((item, i) => (
              <motion.li
                key={item.name}
                className={styles.item}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className={styles.itemMain}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDesc}>{item.desc}</p>
                </div>
                <div className={styles.itemMeta}>
                  <span className={styles.itemCalories}>{formatCalories(item.calories)}</span>
                  <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                </div>
              </motion.li>
            ))}
          </ul>

          <p className={styles.calorieNote}>
            Калорийность указана ориентировочно для стандартной ресторанной порции.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
