import { Link } from 'react-router-dom'
import { readGallery, readQuotes, siteInfo } from '../lib/content'
import usePageTitle from '../lib/usePageTitle'
import Mark from '../components/Mark'
import Reveal from '../components/Reveal'

const photos = readGallery().flatMap((event) => event.photos.map((photo) => ({ ...photo, event: event.event })))
const quotes = readQuotes()
const featuredQuote = quotes.find((quote) => quote.featured) ?? quotes[0]

export default function Home() {
  usePageTitle('Клуб игры «Мафия» в Калуге')
  return (
    <main>
      <section className="hero">
        <div className="hero__backdrop" />
        <div className="hero__grain" />
        <div className="hero__content page-shell">
          <div className="hero__copy">
            <p className="eyebrow"><span className="live-dot" /> КЛУБ ИНТЕЛЛЕКТУАЛЬНОЙ ИГРЫ · {siteInfo.city.toUpperCase()}</p>
            <h1>Ночь.<br />Город.<br /><em>Подозрение.</em></h1>
            <p className="hero__lead">За этим столом каждое слово имеет вес. Найдите свою команду в игре, где решают логика, наблюдательность и умение убеждать.</p>
            <div className="hero__actions">
              <a className="button button--primary" href={siteInfo.vkUrl} target="_blank" rel="noreferrer">Записаться на игру <span aria-hidden="true">↗</span></a>
              <a className="button button--ghost" href={siteInfo.vkUrl} target="_blank" rel="noreferrer">Сообщество ВКонтакте <span aria-hidden="true">↗</span></a>
            </div>
            <div className="hero__facts">
              <span><i>01</i> Новичкам рады</span><span><i>02</i> {siteInfo.priceRubles} ₽ за вечер</span>
            </div>
          </div>
          <div className="hero__visual" aria-label="Атмосфера игры «Мафия»">
            <div className="hero__visual-frame">
              <img src="/images/mafia-noir-reference.jpg" alt="" fetchPriority="high" />
              <div className="hero__visual-shade" />
              <div className="hero__visual-caption"><span>ДЕЛО № 001</span><span>КАЛУГА · НОЧЬ</span></div>
              <Mark className="hero__target" />
            </div>
            <span className="hero__vertical">STRATEGY · TEAM · VICTORY</span>
          </div>
        </div>
        <div className="hero__bottom page-shell"><span>ЛИСТАЙТЕ, ГОРОД НЕ СПИТ</span><span className="hero__line" /><span>01 / 04</span></div>
      </section>

      <section className="intro-section section-pad">
        <div className="page-shell intro-grid">
          <Reveal><p className="eyebrow">01 — О КЛУБЕ</p><h2 className="section-title">Это больше,<br /><em>чем просто игра.</em></h2></Reveal>
          <Reveal className="intro-copy">
            <p className="intro-copy__lead">«Мафия под прицелом» — игровое сообщество в Калуге для тех, кому нравится читать между строк.</p>
            <p>Здесь встречаются, чтобы сыграть в интеллектуальную «Мафию», проверить свои версии и провести вечер в хорошей компании. А если вы впервые — вам объяснят правила и помогут быстро освоиться.</p>
            <Link to="/gallery" className="text-link">Почувствовать атмосферу <span aria-hidden="true">↗</span></Link>
          </Reveal>
        </div>
      </section>

      <section className="process-section section-pad">
        <div className="page-shell">
          <Reveal className="section-heading"><div><p className="eyebrow">02 — В ИГРЕ</p><h2 className="section-title">Сначала слушай.<br /><em>Потом решай.</em></h2></div><p>Внимание к деталям, убедительные версии и неожиданные повороты — суть игры за столом.</p></Reveal>
          <div className="process-list">
            {[
              ['01', 'Займите место', 'Познакомьтесь с игроками и узнайте правила. В первый раз? Вам всё объяснят.'],
              ['02', 'Ищите улики', 'Слушайте версии, замечайте детали и решайте, кому можно доверять.'],
              ['03', 'Сделайте ход', 'Обсуждайте, убеждайте и проверяйте свои догадки — каждое решение меняет игру.'],
            ].map(([number, title, text]) => (
              <Reveal key={number} className="process-item">
                <span className="process-item__number">{number}</span><div><h3>{title}</h3><p>{text}</p></div><span className="process-item__arrow" aria-hidden="true">↗</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="welcome-section">
        <div className="page-shell welcome-grid">
          <Reveal className="welcome-main"><p className="eyebrow">ВАША ПЕРВАЯ ИГРА</p><h2>Не знаете правил?<br /><em>Начните с любопытства.</em></h2><p>{siteInfo.beginnerNote}</p><a className="button button--primary" href={siteInfo.vkUrl} target="_blank" rel="noreferrer">Узнать о ближайшей игре <span aria-hidden="true">↗</span></a></Reveal>
          <Reveal className="welcome-card"><span className="welcome-card__label">ВЕЧЕР В ХОРОШЕЙ КОМПАНИИ</span><strong>{siteInfo.priceRubles}<small> ₽</small></strong><span>стоимость игрового вечера</span><div className="welcome-card__rule" /><p>{siteInfo.scheduleNote}</p></Reveal>
        </div>
      </section>

      <section className="moments-section section-pad">
        <div className="page-shell">
          <Reveal className="section-heading"><div><p className="eyebrow">03 — ЗА КАДРОМ</p><h2 className="section-title">Лица и <em>улики.</em></h2></div><Link to="/gallery" className="text-link">Вся галерея <span aria-hidden="true">↗</span></Link></Reveal>
          <div className="moments-grid">
            {photos.slice(0, 2).map((photo, index) => (
              <Reveal key={photo.src} className={`moment-card moment-card--${index + 1}`}>
                <Link to="/gallery" className="moment-card__image"><img src={photo.thumbnail ?? photo.src} alt={photo.alt} loading="lazy" /><span className="moment-card__open">↗</span></Link>
                <div className="moment-card__meta"><span>{photo.event}</span><span>0{index + 1} / 02</span></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featuredQuote && <section className="quote-feature">
        <div className="quote-feature__glow" />
        <div className="page-shell quote-feature__inner">
          <Reveal><p className="eyebrow">04 — ИЗ КЛУБНОГО ЦИТАТНИКА</p><span className="quote-feature__mark">“</span><blockquote>{featuredQuote.text}</blockquote><div className="quote-feature__byline"><span>{featuredQuote.author}</span><span>{featuredQuote.dateLabel ?? 'Из архива клуба'}</span></div><Link to="/quotes" className="text-link">Другие фразы, которые нельзя забыть <span aria-hidden="true">↗</span></Link></Reveal>
          <span className="quote-feature__stamp">ЗАПИСАНО<br />В ДЕЛО</span>
        </div>
      </section>}

      <section className="final-cta">
        <div className="page-shell final-cta__inner">
          <Mark className="final-cta__mark" />
          <p className="eyebrow">СЛЕДУЮЩИЙ ХОД — ЗА ВАМИ</p>
          <h2>Готовы занять<br /><em>место за столом?</em></h2>
          <p>{siteInfo.scheduleNote} {siteInfo.bookingNote}</p>
          <a className="button button--primary" href={siteInfo.vkUrl} target="_blank" rel="noreferrer">Перейти в сообщество <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </main>
  )
}
