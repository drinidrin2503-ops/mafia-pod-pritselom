import { useState } from 'react'
import informationSource from '../data/important-information.txt?raw'
import Reveal from '../components/Reveal'
import usePageTitle from '../lib/usePageTitle'

const sourceSections = informationSource.match(
  /^Адрес:\r?\nМы находимся по адресу: ([^\r\n]+)\r?\n\r?\nПравила игры:\r?\n\r?\n([\s\S]*)$/,
)

if (!sourceSections) {
  throw new Error('Не удалось прочитать адрес и правила из файла important-information.txt.')
}

const address = sourceSections[1]
const rules = sourceSections[2].split(/\r?\n/)
const headings = new Set([
  'УСЛОВИЯ ПОБЕДЫ',
  'МАФИЯ И ДОН',
  'ШЕРИФ 🕵️‍♂️',
  'МИРНЫЕ ЖИТЕЛИ 👀',
  'МИРНЫЙ ДЕНЬ 🙏 (просыпаются все игроки)',
  'ОПРАВДАНИЕ 🗣️',
  'ДОПОЛНИТЕЛЬНО',
  '❗️ЧТО ЗАПРЕЩЕНО ВО ВРЕМЯ ИГРЫ:',
])

export default function Information() {
  usePageTitle('Важная информация')
  const [copyStatus, setCopyStatus] = useState('')

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopyStatus('Адрес скопирован.')
    } catch (error) {
      console.error('Не удалось скопировать адрес клуба.', error)
      setCopyStatus('Не удалось скопировать адрес. Выделите текст адреса и скопируйте его вручную.')
    }
  }

  return (
    <main className="inner-page information-page">
      <section className="page-hero page-shell">
        <div className="page-hero__copy">
          <p className="eyebrow">ПЕРЕД ВСТРЕЧЕЙ · ВАЖНО ПРОЧИТАТЬ</p>
          <h1>Важная<br /><em>информация.</em></h1>
          <p>Адрес клуба и полный текст правил спортивной версии игры.</p>
        </div>
        <span className="page-hero__index">INFO<br /><strong>05</strong></span>
      </section>

      <div className="page-shell information-content">
        <section className="information-address" aria-labelledby="club-address-title">
          <Reveal className="information-section-heading">
            <p className="eyebrow">01 — КАК НАЙТИ КЛУБ</p>
            <h2 id="club-address-title">Адрес клуба</h2>
          </Reveal>
          <Reveal className="address-card">
            <span className="address-card__label">МЫ НАХОДИМСЯ ПО АДРЕСУ</span>
            <p className="address-card__text">{address}</p>
            <button className="button button--ghost" onClick={copyAddress}>
              Скопировать адрес <span aria-hidden="true">▣</span>
            </button>
            <span className="address-card__status" aria-live="polite">{copyStatus}</span>
          </Reveal>
        </section>

        <section className="information-rules" aria-labelledby="game-rules-title">
          <Reveal className="information-section-heading">
            <p className="eyebrow">02 — ИГРАЕМ ПО ПРАВИЛАМ</p>
            <h2 id="game-rules-title">Правила игры</h2>
            <p className="information-section-heading__description">
              Полный текст правил спортивной версии игры «Мафия».
            </p>
          </Reveal>
          <article className="rules-document" aria-label="Полный текст правил игры">
            <h3 className="rules-document__title">{rules[0]}</h3>
            <div className="rules-document__body">
              {rules.slice(1).map((line, index) => {
                if (!line) return <div key={`gap-${index}`} className="rules-document__gap" aria-hidden="true" />
                if (headings.has(line)) {
                  return <h4 key={`heading-${index}`} className="rules-document__heading">{line}</h4>
                }
                const isWarning = line.startsWith('❗️') || line.startsWith('❌')
                return (
                  <p key={`rule-${index}`} className={`rules-document__paragraph${isWarning ? ' rules-document__paragraph--warning' : ''}`}>
                    {line}
                  </p>
                )
              })}
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
