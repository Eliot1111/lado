import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MENU_FOOD_PHOTOS, photo } from '../data/constants';
import styles from './Menu.module.css';

export default function Menu() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

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
          transition={{ duration: 0.9, delay: 0.15 }}
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
                transition={{ duration: 0.7, delay: 0.25 + i * 0.08 }}
              >
                <img src={photo(name)} alt="" loading="lazy" />
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
