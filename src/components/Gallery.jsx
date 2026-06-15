import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PHOTOS, photo } from '../data/constants';
import styles from './Gallery.module.css';

gsap.registerPlugin(ScrollTrigger);

const layout = [
  { photo: PHOTOS[0], span: 'a' },
  { photo: PHOTOS[2], span: 'b' },
  { photo: PHOTOS[4], span: 'c' },
  { photo: PHOTOS[6], span: 'd' },
  { photo: PHOTOS[8], span: 'e' },
  { photo: PHOTOS[10], span: 'f' },
  { photo: PHOTOS[12], span: 'g' },
  { photo: PHOTOS[14], span: 'h' },
  { photo: PHOTOS[16], span: 'i' },
  { photo: PHOTOS[18], span: 'j' },
];

function GalleryItem({ item, index }) {
  const ref = useRef(null);
  const imgRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        el.style.transform = `translateY(${(self.progress - 0.5) * 40}px) scale(1.05)`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <motion.figure
      ref={ref}
      className={`${styles.item} ${styles[item.span]}`}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.frame}>
        <div ref={imgRef} className={styles.imgWrap}>
          <img src={photo(item.photo)} alt="" loading="lazy" />
        </div>
        <div className={styles.shine} />
      </div>
    </motion.figure>
  );
}

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section id="gallery" className={styles.gallery} ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="section-label">Gallery</p>
          <h2 className="section-title">Атмосфера вечера</h2>
          <p className="section-desc">
            Интерьер, блюда и моменты, которые определяют характер lado.
          </p>
        </motion.div>

        <div className={styles.mosaic}>
          {layout.map((item, i) => (
            <GalleryItem key={item.photo} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
