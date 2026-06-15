import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { RESTAURANT } from '../data/constants';
import { scrollTo } from '../hooks/useScroll';
import styles from './Hero.module.css';

export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="hero" className={styles.hero} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.content}>
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              {RESTAURANT.tagline}
            </motion.p>

            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              Авторская кухня
              <br />
              <em>в сердце Москвы</em>
            </motion.h1>

            <motion.p
              className={styles.desc}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Авторская кухня, вечерняя атмосфера и гастрономический опыт
              в сердце Москвы. Приватность, эстетика и вкус — в каждой детали.
            </motion.p>

            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <button type="button" className="btn btn-primary" onClick={() => scrollTo('reservation')}>
                Забронировать стол
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => scrollTo('menu')}>
                Смотреть меню
              </button>
            </motion.div>

            <motion.div
              className={styles.meta}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <span>{RESTAURANT.hours}</span>
              <span className={styles.metaDot} />
              <span>{RESTAURANT.address}</span>
            </motion.div>
          </div>

          <div className={styles.visualSpace} aria-hidden="true" />
        </div>
      </div>

      <motion.div
        className={styles.scrollCue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </motion.div>
    </section>
  );
}
