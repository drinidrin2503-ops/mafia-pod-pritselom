import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Leaderboard from './pages/Leaderboard'
import Quotes from './pages/Quotes'

function PageReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function Preloader() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem('mafia-intro-seen'))

  useEffect(() => {
    if (!visible) return
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('mafia-intro-seen', 'true')
      setVisible(false)
    }, 1550)
    return () => window.clearTimeout(timer)
  }, [visible])

  if (!visible) return null
  return (
    <button className="preloader" onClick={() => { sessionStorage.setItem('mafia-intro-seen', 'true'); setVisible(false) }} aria-label="Пропустить заставку">
      <span className="preloader__mark"><span /></span>
      <span className="preloader__name">ПОД ПРИЦЕЛОМ</span>
      <span className="preloader__skip">нажмите, чтобы пропустить</span>
    </button>
  )
}

function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">ДОСЬЕ НЕ НАЙДЕНО</p>
      <h1>Кажется, вы свернули не туда.</h1>
      <Link to="/" className="button button--primary">На главную <span aria-hidden="true">↗</span></Link>
    </main>
  )
}

export default function App() {
  return (
    <>
      <PageReset />
      <Preloader />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
