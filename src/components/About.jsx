import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { photo } from '../data/constants';
import styles from './About.module.css';

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section id="about" className={styles.about} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          <motion.div
            className={styles.text}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-label">About</p>
            <h2 className="section-title">Пространство вкуса и света</h2>
            <div className="gold-line" />
            <p className="section-desc">
              lado — это вечерний ресторан на Патриарших, где авторская кухня
              встречается с архитектурой интерьера. Мягкий свет, приглушённые
              тона, открытая кухня и внимание к каждому гостю.
            </p>
            <p className={styles.extra}>
              Мы работаем с сезонными продуктами, создаём блюда как композиции
              и подбираем вина, которые раскрывают характер каждого вечера.
            </p>

            <div className={styles.stats}>
              <div>
                <span className={styles.statNum}>12</span>
                <span className={styles.statLabel}>Столов в зале</span>
              </div>
              <div>
                <span className={styles.statNum}>48</span>
                <span className={styles.statLabel}>Позиций в меню</span>
              </div>
              <div>
                <span className={styles.statNum}>2019</span>
                <span className={styles.statLabel}>Год открытия</span>
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
              <img src={photo('IMG_7293.jpg')} alt="Интерьер ресторана lado" loading="lazy" />
            </div>
            <div className={styles.imageSecondary}>
              <img src={photo('IMG_7285.jpg')} alt="Блюдо" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
