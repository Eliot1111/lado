import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS, RESTAURANT, photo } from '../data/constants';
import { scrollTo } from '../hooks/useScroll';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    setTimeout(() => scrollTo(id), open ? 350 : 0);
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <button type="button" className={styles.logo} onClick={() => go('hero')}>
          <span className={styles.logoMark}>{RESTAURANT.name[0]}</span>
          <span className={styles.logoText}>{RESTAURANT.name}</span>
        </button>

        <button
          type="button"
          className={`${styles.toggle} ${open ? styles.toggleOpen : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Меню"
        >
          <span /><span />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.overlayBg}>
              <img src={photo('IMG_7288.jpg')} alt="" className={styles.overlayImg} />
              <div className={styles.overlayGlass} />
            </div>

            <motion.nav
              className={styles.nav}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  type="button"
                  className={styles.navLink}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.5 }}
                  onClick={() => go(link.id)}
                >
                  <span className={styles.navHint}>{link.hint}</span>
                  <span className={styles.navLabel}>{link.label}</span>
                </motion.button>
              ))}

              <motion.div
                className={styles.navFooter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p>{RESTAURANT.address}</p>
                <p>{RESTAURANT.hours}</p>
              </motion.div>
            </motion.nav>

            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
