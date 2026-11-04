import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Mark from './Mark'

const links = [
  { to: '/', label: 'Главная' },
  { to: '/gallery', label: 'Галерея' },
  { to: '/leaderboard', label: 'Рейтинг' },
  { to: '/quotes', label: 'Цитатник' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)} aria-label="Мафия под прицелом — главная">
          <Mark className="brand__mark" />
          <span className="brand__text"><strong>ПОД ПРИЦЕЛОМ</strong><small>КЛУБ ИГРЫ «МАФИЯ» · КАЛУГА</small></span>
        </Link>
        <button
          className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <span /><span />
        </button>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Основная навигация">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <a className="nav-cta" href="https://vk.ru/mafia_podprizelom" target="_blank" rel="noreferrer">
            Вступить в игру <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
