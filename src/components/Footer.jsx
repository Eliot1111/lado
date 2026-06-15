import { RESTAURANT, NAV_LINKS } from '../data/constants';
import { scrollTo } from '../hooks/useScroll';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <p className={styles.brand}>{RESTAURANT.name}</p>
            <p className={styles.tagline}>{RESTAURANT.tagline}</p>
          </div>

          <nav className={styles.nav}>
            {NAV_LINKS.map((l) => (
              <button key={l.id} type="button" onClick={() => scrollTo(l.id)}>
                {l.label}
              </button>
            ))}
          </nav>

          <div className={styles.meta}>
            <p>{RESTAURANT.address}</p>
            <p>{RESTAURANT.phone}</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} {RESTAURANT.name}. Москва.</p>
        </div>
      </div>
    </footer>
  );
}
