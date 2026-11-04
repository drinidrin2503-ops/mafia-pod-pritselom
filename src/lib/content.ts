import galleryJson from '../data/gallery.json'
import leaderboardJson from '../data/leaderboard.json'
import quotesJson from '../data/quotes.json'
import siteInfoJson from '../data/site-info.json'

export type Photo = {
  src: string
  thumbnail?: string
  alt: string
  caption?: string
}

export type GalleryEvent = {
  id: string
  event: string
  date: string | null
  dateLabel?: string
  photos: Photo[]
}

export type Player = {
  id: string
  name: string
  games: number
  wins: number
  points: number
}

export type Quote = {
  id: string
  text: string
  author: string
  date: string | null
  dateLabel?: string
  event?: string | null
  featured?: boolean
  note?: string
}

export type SiteInfo = {
  name: string
  city: string
  vkUrl: string
  priceRubles: number
  scheduleNote: string
  bookingNote: string
  beginnerNote: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredString(record: Record<string, unknown>, key: string, context: string): string {
  const value = record[key]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Некорректные данные: ${context}.${key} должен быть непустой строкой.`)
  }
  return value
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined
}

function nullableDate(value: unknown, context: string): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Некорректные данные: ${context}.date должен быть датой ISO или null.`)
  }
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== value) {
    throw new Error(`Некорректные данные: ${context}.date содержит недействительную дату.`)
  }
  return value
}

export function readSiteInfo(): SiteInfo {
  if (!isRecord(siteInfoJson)) throw new Error('Файл site-info.json должен содержать объект.')
  const price = siteInfoJson.priceRubles
  if (typeof price !== 'number' || price < 0) throw new Error('Некорректные данные: priceRubles должен быть неотрицательным числом.')
  const vkUrl = requiredString(siteInfoJson, 'vkUrl', 'site-info.json')
  if (!/^https:\/\/(vk\.ru|vk\.com)\//.test(vkUrl)) throw new Error('Некорректные данные: vkUrl должен вести на ВКонтакте.')
  return {
    name: requiredString(siteInfoJson, 'name', 'site-info.json'),
    city: requiredString(siteInfoJson, 'city', 'site-info.json'),
    vkUrl,
    priceRubles: price,
    scheduleNote: optionalString(siteInfoJson.scheduleNote) ?? 'Расписание уточняйте в сообществе ВКонтакте.',
    bookingNote: optionalString(siteInfoJson.bookingNote) ?? 'Запись — в сообщениях сообщества ВКонтакте.',
    beginnerNote: optionalString(siteInfoJson.beginnerNote) ?? 'Новичкам помогут освоиться.',
  }
}

export function readGallery(): GalleryEvent[] {
  if (!Array.isArray(galleryJson)) throw new Error('Файл gallery.json должен содержать список мероприятий.')
  return galleryJson.map((rawEvent, eventIndex) => {
    const context = `gallery.json[${eventIndex}]`
    if (!isRecord(rawEvent)) throw new Error(`Некорректные данные: ${context} должен быть объектом.`)
    if (!Array.isArray(rawEvent.photos)) throw new Error(`Некорректные данные: ${context}.photos должен быть списком.`)
    const photos = rawEvent.photos.map((rawPhoto, photoIndex) => {
      const photoContext = `${context}.photos[${photoIndex}]`
      if (!isRecord(rawPhoto)) throw new Error(`Некорректные данные: ${photoContext} должен быть объектом.`)
      return {
        src: requiredString(rawPhoto, 'src', photoContext),
        thumbnail: optionalString(rawPhoto.thumbnail),
        alt: requiredString(rawPhoto, 'alt', photoContext),
        caption: optionalString(rawPhoto.caption),
      }
    })
    return {
      id: requiredString(rawEvent, 'id', context),
      event: requiredString(rawEvent, 'event', context),
      date: nullableDate(rawEvent.date, context),
      dateLabel: optionalString(rawEvent.dateLabel),
      photos,
    }
  }).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

export function readLeaderboard(): Player[] {
  if (!Array.isArray(leaderboardJson)) throw new Error('Файл leaderboard.json должен содержать список игроков.')
  return leaderboardJson.map((rawPlayer, index) => {
    const context = `leaderboard.json[${index}]`
    if (!isRecord(rawPlayer)) throw new Error(`Некорректные данные: ${context} должен быть объектом.`)
    const count = (key: string) => {
      const value = rawPlayer[key]
      if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
        throw new Error(`Некорректные данные: ${context}.${key} должен быть целым неотрицательным числом.`)
      }
      return value
    }
    const player: Player = {
      id: requiredString(rawPlayer, 'id', context),
      name: requiredString(rawPlayer, 'name', context),
      games: count('games'),
      wins: count('wins'),
      points: count('points'),
    }
    if (player.wins > player.games) {
      throw new Error(`Некорректные данные: ${context}.wins не может превышать games.`)
    }
    return player
  })
}

export function readQuotes(): Quote[] {
  if (!Array.isArray(quotesJson)) throw new Error('Файл quotes.json должен содержать список цитат.')
  return quotesJson.map((rawQuote, index) => {
    const context = `quotes.json[${index}]`
    if (!isRecord(rawQuote)) throw new Error(`Некорректные данные: ${context} должен быть объектом.`)
    const featured = rawQuote.featured
    if (featured !== undefined && typeof featured !== 'boolean') {
      throw new Error(`Некорректные данные: ${context}.featured должен иметь значение true или false.`)
    }
    return {
      id: requiredString(rawQuote, 'id', context),
      text: requiredString(rawQuote, 'text', context),
      author: requiredString(rawQuote, 'author', context),
      date: nullableDate(rawQuote.date, context),
      dateLabel: optionalString(rawQuote.dateLabel),
      event: optionalString(rawQuote.event) ?? null,
      featured: featured === true,
      note: optionalString(rawQuote.note),
    }
  })
}

export const siteInfo = readSiteInfo()
