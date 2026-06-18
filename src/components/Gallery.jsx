import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PHOTOS, photo } from '../data/constants';
import { useIsMobile, useMediaQuery } from '../hooks/useMedia';
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

function GalleryItem({ item, index, parallax }) {
  const ref = useRef(null);
  const imgRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  useEffect(() => {
    if (!parallax) return;
    const el = imgRef.current;
    const trigger = ref.current;
    if (!el || !trigger) return;

    const st = ScrollTrigger.create({
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => {
        el.style.transform = `translate3d(0, ${(self.progress - 0.5) * 32}px, 0) scale(1.04)`;
      },
    });
    return () => st.kill();
  }, [parallax]);

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
          <img src={photo(item.photo)} alt="" loading="lazy" decoding="async" />
        </div>
        <div className={styles.shine} />
      </div>
    </motion.figure>
  );
}

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const isMobile = useIsMobile();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const parallax = !isMobile && !reducedMotion;

  return (
    <section id="gallery" className={styles.gallery} ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="section-label">Галерея</p>
          <h2 className="section-title">Летняя атмосфера</h2>
          <p className="section-desc">
            Интерьер, блюда и моменты, которые определяют характер «Ладо».
          </p>
        </motion.div>

        <div className={styles.mosaic}>
          {layout.map((item, i) => (
            <GalleryItem key={item.photo} item={item} index={i} parallax={parallax} />
          ))}
        </div>
      </div>
    </section>
  );
}
