import { Link } from 'react-router-dom'
import siteInfo from '../data/site-info.json'
import Mark from './Mark'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Mark className="footer-mark" />
          <div><strong>ПОД ПРИЦЕЛОМ</strong><span>Интеллектуальная игра · Калуга</span></div>
        </div>
        <p>Каждое слово, жест и решение<br />могут стать уликой.</p>
        <div className="footer-links">
          <Link to="/">Главная</Link><Link to="/gallery">Галерея</Link><Link to="/leaderboard">Рейтинг</Link><Link to="/quotes">Цитатник</Link>
        </div>
        <a className="footer-social" href={siteInfo.vkUrl} target="_blank" rel="noreferrer">Сообщество ВКонтакте <span aria-hidden="true">↗</span></a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} «Мафия под прицелом»</span>
        <span>Играем честно. Подозреваем всех.</span>
      </div>
    </footer>
  )
}
