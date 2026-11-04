import { useEffect, useMemo, useState } from 'react'
import { readGallery, type Photo } from '../lib/content'
import usePageTitle from '../lib/usePageTitle'
import Reveal from '../components/Reveal'

const events = readGallery()
const photos = events.flatMap((event) => event.photos.map((photo) => ({ ...photo, event: event.event, dateLabel: event.dateLabel })))

export default function Gallery() {
  usePageTitle('Галерея')
  const [active, setActive] = useState<number | null>(null)
  const current = useMemo(() => active === null ? null : photos[active], [active])

  useEffect(() => {
    if (active === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') setActive((index) => index === null ? null : (index + 1) % photos.length)
      if (event.key === 'ArrowLeft') setActive((index) => index === null ? null : (index - 1 + photos.length) % photos.length)
    }
    document.body.classList.add('lightbox-open')
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('lightbox-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [active])

  const changePhoto = (step: number) => setActive((index) => index === null ? null : (index + step + photos.length) % photos.length)

  return (
    <main className="inner-page">
      <section className="page-hero page-shell">
        <div className="page-hero__copy"><p className="eyebrow">АРХИВ КЛУБА · {photos.length.toString().padStart(2, '0')} КАДРА</p><h1>Взгляд<br /><em>изнутри.</em></h1><p>Лица, встречи и моменты между ходами. Небольшой архив клуба — и каждая фотография со своей историей.</p></div>
        <span className="page-hero__index">FILE<br /><strong>02</strong></span>
      </section>

      <section className="gallery-page page-shell">
        {events.map((event, eventIndex) => {
          const eventPhotos = photos.map((photo, index) => ({ photo, index })).filter(({ photo }) => photo.event === event.event)
          return (
            <section key={event.id} className="gallery-event">
              <Reveal className="gallery-event__heading"><div><span className="eyebrow">ДЕЛО 0{eventIndex + 1}</span><h2>{event.event}</h2></div><span>{event.dateLabel ?? 'Из архива клуба'}</span></Reveal>
              <div className={`gallery-grid${eventPhotos.length === 1 ? ' gallery-grid--single' : ''}`}>
                {eventPhotos.map(({ photo, index }) => (
                  <GalleryTile key={photo.src} photo={photo} index={index} onOpen={() => setActive(index)} />
                ))}
              </div>
            </section>
          )
        })}
      </section>
      {current && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" onClick={() => setActive(null)}>
        <button className="lightbox__close" onClick={() => setActive(null)} aria-label="Закрыть просмотр">×</button>
        <button className="lightbox__nav lightbox__nav--prev" onClick={(event) => { event.stopPropagation(); changePhoto(-1) }} aria-label="Предыдущая фотография">←</button>
        <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
          <img src={current.src} alt={current.alt} />
          <figcaption><span>{current.caption ?? current.event}</span><span>{(active! + 1).toString().padStart(2, '0')} / {photos.length.toString().padStart(2, '0')}</span></figcaption>
        </figure>
        <button className="lightbox__nav lightbox__nav--next" onClick={(event) => { event.stopPropagation(); changePhoto(1) }} aria-label="Следующая фотография">→</button>
      </div>}
    </main>
  )
}

function GalleryTile({ photo, index, onOpen }: { photo: Photo & { event: string; dateLabel?: string }; index: number; onOpen: () => void }) {
  return (
    <Reveal className={`gallery-tile gallery-tile--${index % 4 + 1}`}>
      <button className="gallery-tile__button" onClick={onOpen} aria-label={`Открыть фотографию: ${photo.alt}`}>
        <img src={photo.thumbnail ?? photo.src} alt={photo.alt} loading="lazy" />
        <span className="gallery-tile__veil" />
        <span className="gallery-tile__caption"><span>{photo.event}</span><strong>{photo.caption ?? 'Открыть фотографию'} <i aria-hidden="true">↗</i></strong></span>
        <span className="gallery-tile__number">0{index + 1}</span>
      </button>
    </Reveal>
  )
}
