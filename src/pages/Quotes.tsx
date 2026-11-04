import { useMemo, useState } from 'react'
import { readQuotes } from '../lib/content'
import usePageTitle from '../lib/usePageTitle'
import Reveal from '../components/Reveal'

const allQuotes = readQuotes()

export default function Quotes() {
  usePageTitle('Цитатник')
  const [query, setQuery] = useState('')
  const [author, setAuthor] = useState('Все авторы')
  const [order, setOrder] = useState<'newest' | 'oldest'>('newest')
  const [randomQuoteId, setRandomQuoteId] = useState<string | null>(null)
  const authors = Array.from(new Set(allQuotes.map((quote) => quote.author))).sort((a, b) => a.localeCompare(b, 'ru'))
  const quotes = useMemo(() => allQuotes.filter((quote) => {
    const searchText = `${quote.text} ${quote.author} ${quote.event ?? ''}`.toLocaleLowerCase('ru')
    return searchText.includes(query.trim().toLocaleLowerCase('ru')) && (author === 'Все авторы' || quote.author === author)
  }).sort((a, b) => {
    const left = a.date ?? ''
    const right = b.date ?? ''
    return order === 'newest' ? right.localeCompare(left) : left.localeCompare(right)
  }), [author, order, query])
  const randomQuote = allQuotes.find((quote) => quote.id === randomQuoteId)

  const showRandom = () => {
    if (!allQuotes.length) return
    const pool = allQuotes.length > 1 ? allQuotes.filter((quote) => quote.id !== randomQuoteId) : allQuotes
    setRandomQuoteId(pool[Math.floor(Math.random() * pool.length)].id)
  }

  return (
    <main className="inner-page quotes-page">
      <section className="page-hero page-shell">
        <div className="page-hero__copy"><p className="eyebrow">ЗАПИСАНО СО СЛОВ УЧАСТНИКОВ</p><h1>Слово —<br /><em>не воробей.</em></h1><p>В игре иногда важнее не то, кто победил, а кто это сказал. Архив фраз, которые стали частью клубной истории.</p></div>
        <span className="page-hero__index">NOTES<br /><strong>04</strong></span>
      </section>
      <section className="quotes-page__body page-shell">
        <Reveal className="random-panel">
          <div><p className="eyebrow">СЛУЧАЙНАЯ УЛИКА</p><h2>Откройте цитату<br />наугад.</h2><p>Иногда одна фраза рассказывает больше, чем целое дело.</p></div>
          <button className="button button--primary" onClick={showRandom}>Достать из архива <span aria-hidden="true">↗</span></button>
          {randomQuote && <div className="random-panel__result" aria-live="polite"><span>“</span><p>{randomQuote.text}</p><small>{randomQuote.author} · {randomQuote.dateLabel ?? 'Дата не указана'}</small></div>}
        </Reveal>
        <div className="quotes-toolbar">
          <label className="search-field"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Искать по фразе или имени" aria-label="Поиск по цитатам" /></label>
          <label className="sort-field"><span>АВТОР:</span><select value={author} onChange={(event) => setAuthor(event.target.value)} aria-label="Фильтр по автору"><option>Все авторы</option>{authors.map((name) => <option key={name}>{name}</option>)}</select></label>
          <button className="sort-direction" onClick={() => setOrder((current) => current === 'newest' ? 'oldest' : 'newest')} aria-label="Изменить порядок цитат">{order === 'newest' ? 'СНАЧАЛА НОВЫЕ ↓' : 'СНАЧАЛА СТАРЫЕ ↑'}</button>
        </div>
        <div className="quote-grid">
          {quotes.map((quote, index) => <Reveal key={quote.id} className={`quote-card${quote.featured ? ' quote-card--featured' : ''}`}>
            <div className="quote-card__top"><span>{quote.featured ? 'ИЗБРАННОЕ ДЕЛО' : `ЗАПИСЬ 0${index + 1}`}</span><span>“</span></div>
            <blockquote>{quote.text}</blockquote>
            {quote.note && <p className="quote-card__note">{quote.note}</p>}
            <div className="quote-card__footer"><div><strong>{quote.author}</strong><span>{quote.event ?? 'Участник клуба'}</span></div><time>{quote.dateLabel ?? 'Дата не указана'}</time></div>
          </Reveal>)}
          {!quotes.length && <div className="quotes-empty"><h2>Таких фраз пока нет.</h2><p>Попробуйте изменить запрос или фильтр.</p></div>}
        </div>
        <p className="quotes-total">В АРХИВЕ: {quotes.length.toString().padStart(2, '0')} {quotes.length === 1 ? 'ЦИТАТА' : 'ЦИТАТ'}</p>
      </section>
    </main>
  )
}
