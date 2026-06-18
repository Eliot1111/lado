import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { RESTAURANT, photo } from '../data/constants';
import styles from './About.module.css';

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section id="about" className={styles.about} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-label">О ресторане</p>
            <h2 className="section-title">Летнее настроение в центре Москвы</h2>
            <div className="accent-line" />
            <p className="section-desc">
              Ресторан работает с {RESTAURANT.openedYear} года и уже стал местом для тех,
              кто ценит красивую подачу, летнюю атмосферу и современную кухню в Москве.
            </p>
            <p className={styles.extra}>
              В «{RESTAURANT.name}» — светлый зал, сезонные продукты и блюда, которые хочется
              фотографировать. Уютно днём и вечером, без лишней пафосности.
            </p>

            <div className={styles.stats}>
              <div>
                <span className={styles.statNum}>{RESTAURANT.openedYear}</span>
                <span className={styles.statLabel}>год открытия</span>
              </div>
              <div>
                <span className={styles.statNum}>48</span>
                <span className={styles.statLabel}>позиций в меню</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.visual}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.imageMain}>
              <img src={photo('IMG_7288.jpg')} alt="Интерьер ресторана Ладо" loading="lazy" />
            </div>
            <div className={styles.imageSecondary}>
              <img src={photo('IMG_7291.jpg')} alt="Блюдо в ресторане Ладо" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
