import { useMemo, useState } from 'react'
import { readLeaderboard } from '../lib/content'
import usePageTitle from '../lib/usePageTitle'
import Reveal from '../components/Reveal'

type SortKey = 'points' | 'games' | 'wins' | 'rate'

export default function Leaderboard() {
  usePageTitle('Рейтинг игроков')
  const players = readLeaderboard()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('points')
  const sorted = useMemo(() => players
    .filter((player) => player.name.toLocaleLowerCase('ru').includes(search.trim().toLocaleLowerCase('ru')))
    .sort((a, b) => {
      const value = (key: SortKey, player: typeof a) => key === 'rate' ? (player.games ? player.wins / player.games : 0) : player[key]
      return value(sortBy, b) - value(sortBy, a)
    }), [players, search, sortBy])

  return (
    <main className="inner-page">
      <section className="page-hero page-shell">
        <div className="page-hero__copy"><p className="eyebrow">ТУРНИРНАЯ ТАБЛИЦА · ОБЩИЙ ЗАЧЁТ</p><h1>Кто держит<br /><em>город?</em></h1><p>Имена тех, кто лучше всех читает игру. Статистика обновляется из открытого файла клуба.</p></div>
        <span className="page-hero__index">RANK<br /><strong>03</strong></span>
      </section>
      <section className="leaderboard-page page-shell">
        <Reveal className="leaderboard-note"><span className="leaderboard-note__icon">↗</span><p>Рейтинг заполняется владельцами клуба. Пока статистика не предоставлена — таблица останется пустой, без вымышленных результатов.</p></Reveal>
        <div className="leaderboard-toolbar">
          <label className="search-field"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Найти игрока" aria-label="Найти игрока" /></label>
          <label className="sort-field"><span>СОРТИРОВАТЬ:</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortKey)} aria-label="Сортировать рейтинг"><option value="points">По очкам</option><option value="games">По играм</option><option value="wins">По победам</option><option value="rate">По проценту побед</option></select></label>
        </div>
        <div className="leaderboard-table-wrap">
          <table className="leaderboard-table">
            <thead><tr><th>МЕСТО</th><th>ИГРОК</th><th>ИГРЫ</th><th>ПОБЕДЫ</th><th>ПОБЕДЫ %</th><th>ОЧКИ</th></tr></thead>
            <tbody>{sorted.map((player, index) => <tr key={player.id} className={index < 3 ? `leaderboard-row leaderboard-row--${index + 1}` : 'leaderboard-row'}>
              <td><span className="rank-badge">{(index + 1).toString().padStart(2, '0')}</span></td><td className="player-name">{player.name}</td><td data-label="Игры">{player.games}</td><td data-label="Победы">{player.wins}</td><td data-label="Победы %">{player.games ? `${Math.round(player.wins / player.games * 100)}%` : '—'}</td><td data-label="Очки" className="player-points">{player.points}</td>
            </tr>)}</tbody>
          </table>
          {sorted.length === 0 && <div className="leaderboard-empty"><span className="leaderboard-empty__seal">—</span><h2>{search ? 'Игрок не найден' : 'Пока без записей'}</h2><p>{search ? 'Измените запрос и попробуйте ещё раз.' : 'Как только клуб добавит статистику игроков, она появится здесь.'}</p></div>}
        </div>
        <p className="table-footnote">Игроков: {sorted.length.toString().padStart(2, '0')} <span>ОЧКИ / ПОБЕДЫ / ИГРЫ</span></p>
      </section>
    </main>
  )
}
