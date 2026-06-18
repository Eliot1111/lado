import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { RESTAURANT, YANDEX_MAPS_URL } from '../data/constants';
import styles from './Contacts.module.css';

export default function Contacts() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section id="contacts" className={styles.contacts} ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="section-label">Контакты</p>
          <h2 className="section-title">Как нас найти</h2>
          <p className="section-desc">
            Мы в центре Москвы — рядом с метро «Тургеневская». Добро пожаловать.
          </p>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className={styles.block}>
              <span className={styles.label}>Адрес</span>
              <p>{RESTAURANT.address}</p>
            </div>
            <div className={styles.block}>
              <span className={styles.label}>Телефон</span>
              <a href={`tel:${RESTAURANT.phone.replace(/\D/g, '')}`}>{RESTAURANT.phone}</a>
            </div>
            <div className={styles.block}>
              <span className={styles.label}>Часы работы</span>
              <p>{RESTAURANT.hours}</p>
            </div>
            <div className={styles.block}>
              <span className={styles.label}>Email</span>
              <a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <a
              href={YANDEX_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
              aria-label="Открыть в Яндекс Картах"
            >
              <div className={styles.mapInner}>
                <div className={styles.mapGrid} aria-hidden="true">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <span key={i} />
                  ))}
                </div>
                <div className={styles.mapPin} aria-hidden="true">
                  <span className={styles.pinDot} />
                  <span className={styles.pinLabel}>Ладо</span>
                </div>
                <div className={styles.mapGlow} aria-hidden="true" />
                <span className={styles.mapCta}>Открыть в Яндекс Картах</span>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
