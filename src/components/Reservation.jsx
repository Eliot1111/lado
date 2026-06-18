import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Reservation.module.css';

const initial = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: '2',
  comment: '',
};

export default function Reservation() {
  const [form, setForm] = useState(initial);
  const [sent, setSent] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="reservation" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.intro}>
            <p className="section-label">Бронирование</p>
            <h2 className="section-title">Забронировать стол</h2>
            <div className="gold-line" />
            <p className="section-desc">
              Оставьте заявку — мы свяжемся с вами для подтверждения.
              Для групп от 8 человек рекомендуем бронировать заранее.
            </p>
          </div>

          <div className={`${styles.formWrap} glass`}>
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  className={styles.form}
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className={styles.row}>
                    <label className={styles.field}>
                      <span>Имя</span>
                      <input name="name" value={form.name} onChange={update} required placeholder="Александр" />
                    </label>
                    <label className={styles.field}>
                      <span>Телефон</span>
                      <input name="phone" type="tel" value={form.phone} onChange={update} required placeholder="+7 (___) ___-__-__" />
                    </label>
                  </div>

                  <div className={styles.row}>
                    <label className={styles.field}>
                      <span>Дата</span>
                      <input name="date" type="date" value={form.date} onChange={update} required />
                    </label>
                    <label className={styles.field}>
                      <span>Время</span>
                      <input name="time" type="time" value={form.time} onChange={update} required />
                    </label>
                    <label className={styles.field}>
                      <span>Гостей</span>
                      <select name="guests" value={form.guests} onChange={update}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className={styles.field}>
                    <span>Комментарий</span>
                    <textarea
                      name="comment"
                      value={form.comment}
                      onChange={update}
                      rows={3}
                      placeholder="Особые пожелания, аллергии, повод..."
                    />
                  </label>

                  <button type="submit" className="btn btn-primary">Отправить заявку</button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className={styles.success}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.successIcon}>✓</div>
                  <h3>Заявка подготовлена</h3>
                  <p>
                    Спасибо, {form.name || 'гость'}. Мы получили вашу заявку на{' '}
                    {form.date || 'выбранную дату'} в {form.time || 'указанное время'}.
                    Менеджер свяжется с вами по телефону {form.phone || 'указанному номеру'}.
                  </p>
                  <button type="button" className="btn btn-ghost" onClick={() => { setSent(false); setForm(initial); }}>
                    Новая заявка
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
