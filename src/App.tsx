import { useCallback, useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import { ArrowLeft, ArrowRight, ChevronDown, Compass, MapPin, Maximize2, X } from 'lucide-react'
import { destinations, travelRegions, type Destination, type TravelPhoto, type TravelRegion } from './data/destinations'

function useViewport() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}

function formatIndex(value: number) {
  return String(value).padStart(2, '0')
}

function formatCoordinate(value: number, positive: string, negative: string) {
  return `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positive : negative}`
}

type PhotoFormat = 'portrait' | 'landscape' | 'wide'
type GalleryRowKind = 'feature' | 'mixed' | 'portrait-pair' | 'portrait-trio' | 'landscape-pair' | 'single'
type GalleryItem = { photo: TravelPhoto; index: number; format: PhotoFormat }
type GalleryRow = { kind: GalleryRowKind; items: GalleryItem[] }

function getPhotoFormat(photo: TravelPhoto): PhotoFormat {
  const ratio = photo.width / photo.height
  if (ratio >= 1.55) return 'wide'
  if (ratio >= 1) return 'landscape'
  return 'portrait'
}

function buildGalleryRows(photos: TravelPhoto[]): GalleryRow[] {
  if (!photos.length) return []

  const items = photos.map((photo, index) => ({ photo, index, format: getPhotoFormat(photo) }))
  const rows: GalleryRow[] = [{ kind: 'feature', items: [items[0]] }]
  let cursor = 1

  while (cursor < items.length) {
    const current = items[cursor]
    const next = items[cursor + 1]
    const third = items[cursor + 2]

    if (current.format === 'portrait' && next?.format === 'portrait' && third?.format === 'portrait') {
      rows.push({ kind: 'portrait-trio', items: [current, next, third] })
      cursor += 3
      continue
    }

    if (!next) {
      rows.push({ kind: 'single', items: [current] })
      cursor += 1
      continue
    }

    const currentIsPortrait = current.format === 'portrait'
    const nextIsPortrait = next.format === 'portrait'
    const kind: GalleryRowKind = currentIsPortrait !== nextIsPortrait
      ? 'mixed'
      : currentIsPortrait
        ? 'portrait-pair'
        : 'landscape-pair'

    rows.push({ kind, items: [current, next] })
    cursor += 2
  }

  return rows
}

function PhotoSurface({ photo, className = '' }: { photo: TravelPhoto; className?: string }) {
  return (
    <div
      className={`photo-surface ${className}`}
      style={{ backgroundImage: `url(${photo.src})`, backgroundPosition: photo.position ?? 'center' }}
      role="img"
      aria-label={photo.caption}
    />
  )
}

function TravelArchive({
  destination,
  archiveIndex,
  onClose,
}: {
  destination: Destination
  archiveIndex: number
  onClose: () => void
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activePhoto = activeIndex === null ? null : destination.photos[activeIndex]
  const galleryRows = buildGalleryRows(destination.photos)
  const englishArchive = destination.language === 'en'

  const previous = useCallback(() => {
    setActiveIndex((current) => current === null ? 0 : (current - 1 + destination.photos.length) % destination.photos.length)
  }, [destination.photos.length])

  const next = useCallback(() => {
    setActiveIndex((current) => current === null ? 0 : (current + 1) % destination.photos.length)
  }, [destination.photos.length])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') activePhoto ? setActiveIndex(null) : onClose()
      if (activePhoto && event.key === 'ArrowLeft') previous()
      if (activePhoto && event.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activePhoto, next, onClose, previous])

  return (
    <section className="archive" aria-label={`${destination.name}旅行档案`}>
      <button className="archive-close" onClick={onClose} aria-label="关闭档案并返回地球">
        <X size={18} />
        <span>{englishArchive ? 'BACK TO GLOBE' : '返回地球'}</span>
      </button>

      <header className="archive-hero" style={{ '--archive-accent': destination.accent } as React.CSSProperties}>
        <PhotoSurface photo={destination.photos[0]} className="archive-cover" />
        <div className="cover-vignette" />
        <div className="archive-counter">ARCHIVE&nbsp;&nbsp;{formatIndex(archiveIndex + 1)} / {formatIndex(destinations.length)}</div>
        <div className={`archive-title ${destination.name.length > 5 ? 'archive-title-long' : ''}`}>
          <p>{destination.eyebrow}</p>
          <h2>{destination.name}</h2>
          <div className="title-row">
            <span>{destination.englishName}{destination.secondaryName ? ` · ${destination.secondaryName}` : ''}</span>
            <span>{destination.date}</span>
          </div>
        </div>
        <div className="scroll-hint"><ChevronDown size={17} /><span>{englishArchive ? 'SCROLL TO READ' : '向下阅读'}</span></div>
      </header>

      <div className="archive-body">
        <aside className="archive-meta">
          <p className="section-kicker">FIELD NOTES · {formatIndex(archiveIndex + 1)}</p>
          <dl>
            <div><dt>{englishArchive ? 'REGION' : '区域'}</dt><dd>{destination.region}<br />{destination.country}</dd></div>
            <div><dt>{englishArchive ? 'COORD.' : '坐标'}</dt><dd>{formatCoordinate(destination.lat, 'N', 'S')}<br />{formatCoordinate(destination.lng, 'E', 'W')}</dd></div>
            <div><dt>{englishArchive ? 'DATE' : '日期'}</dt><dd>{destination.date}</dd></div>
            <div><dt>{englishArchive ? 'THEME' : '主题'}</dt><dd>{destination.mood}</dd></div>
            <div><dt>{englishArchive ? 'FRAMES' : '影像'}</dt><dd>{destination.photos.length} {englishArchive ? 'FRAMES' : '帧'}</dd></div>
          </dl>
          <p className="source-note">{englishArchive ? <>LOCATION INFORMATION VERIFIED<br />ADD YOUR ACTUAL TRAVEL DATE</> : <>地点与区域信息已核对<br />日期保留给你的真实记录</>}</p>
        </aside>

        <article className="travel-note">
          <p className="section-kicker">TRAVEL JOURNAL</p>
          <h3>{destination.storyTitle}</h3>
          {destination.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>
      </div>

      <section className="gallery-section">
        <div className="gallery-heading">
          <div>
            <p className="section-kicker">SELECTED FRAMES · {formatIndex(destination.photos.length)}</p>
            <h3>{englishArchive ? 'Travel Fragments' : '旅途切片'}</h3>
          </div>
          <p>{englishArchive ? 'SELECT A FRAME TO VIEW FULL SCREEN' : '点击照片，全屏查看'}</p>
        </div>
        <div className="gallery-layout">
          {galleryRows.map((row) => {
            const portraitFirst = row.kind === 'mixed' && row.items[0].format === 'portrait'
            return (
              <div
                className={`gallery-row gallery-row-${row.kind}${portraitFirst ? ' gallery-row-portrait-first' : ''}`}
                key={row.items[0].photo.id}
              >
                {row.items.map(({ photo, index, format }) => (
                  <button
                    className={`gallery-card gallery-card-${format}`}
                    key={photo.id}
                    onClick={() => setActiveIndex(index)}
                    style={{ '--photo-ratio': `${photo.width} / ${photo.height}` } as React.CSSProperties}
                  >
                    <PhotoSurface photo={photo} />
                    <span className="gallery-index">{formatIndex(index + 1)}</span>
                    <span className="gallery-caption"><strong>{photo.title}</strong><small>{photo.caption}</small></span>
                    <Maximize2 className="expand-icon" size={18} />
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      </section>

      <footer className="archive-footer">
        <div><span>PERSONAL TRAVEL ARCHIVE</span><strong>{destination.englishName}</strong></div>
        <button onClick={onClose}>{englishArchive ? 'CLOSE ARCHIVE AND RETURN TO GLOBE' : '关闭档案并返回地球'} <ArrowRight size={18} /></button>
      </footer>

      {activePhoto && activeIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${activePhoto.title}大图`}>
          <button className="lightbox-close" onClick={() => setActiveIndex(null)} aria-label="关闭大图"><X /></button>
          <button className="lightbox-nav lightbox-prev" onClick={previous} aria-label="上一张"><ArrowLeft /></button>
          <PhotoSurface photo={activePhoto} className="lightbox-photo" />
          <button className="lightbox-nav lightbox-next" onClick={next} aria-label="下一张"><ArrowRight /></button>
          <div className="lightbox-caption">
            <span>{formatIndex(activeIndex + 1)} / {formatIndex(destination.photos.length)}</span>
            <div><strong>{activePhoto.title}</strong><p>{activePhoto.caption}</p></div>
          </div>
        </div>
      )}
    </section>
  )
}

type MapMode = 'world' | 'region'
type MapPoint = Destination | TravelRegion

const WORLD_VIEW = { lat: 24, lng: 70, altitude: 2.12 }

function isTravelRegion(point: MapPoint): point is TravelRegion {
  return 'destinationIds' in point
}

function App() {
  const { width, height } = useViewport()
  const globeRef = useRef<any>(null)
  const openTimer = useRef<number | null>(null)
  const [ready, setReady] = useState(false)
  const [mapMode, setMapMode] = useState<MapMode>('world')
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null)
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null)
  const [focusingId, setFocusingId] = useState<string | null>(null)

  const activeRegion = travelRegions.find((region) => region.id === activeRegionId) ?? null
  const regionDestinations = activeRegion
    ? destinations.filter((destination) => destination.regionId === activeRegion.id)
    : []
  const mapPoints: MapPoint[] = mapMode === 'world' ? travelRegions : regionDestinations

  const stopRotation = useCallback(() => {
    const controls = globeRef.current?.controls?.()
    if (controls) controls.autoRotate = false
  }, [])

  const focusRegion = useCallback((region: TravelRegion) => {
    if (focusingId || activeDestination) return
    setFocusingId(region.id)
    setActiveRegionId(region.id)
    stopRotation()
    globeRef.current?.pointOfView?.({ lat: region.lat, lng: region.lng, altitude: region.viewAltitude }, 1200)
    openTimer.current = window.setTimeout(() => {
      setMapMode('region')
      setFocusingId(null)
    }, 880)
  }, [activeDestination, focusingId, stopRotation])

  const focusDestination = useCallback((destination: Destination) => {
    if (focusingId || activeDestination) return
    const destinationRegion = travelRegions.find((region) => region.id === destination.regionId)
    setActiveRegionId(destination.regionId)
    setMapMode('region')
    setFocusingId(destination.id)
    stopRotation()
    globeRef.current?.pointOfView?.({ lat: destination.lat, lng: destination.lng, altitude: 0.045 }, 1050)
    openTimer.current = window.setTimeout(() => {
      setActiveDestination(destination)
      setFocusingId(null)
    }, 820)
    if (!destinationRegion) setActiveRegionId(null)
  }, [activeDestination, focusingId, stopRotation])

  const closeArchive = useCallback(() => {
    setActiveDestination(null)
    setMapMode('region')
    const region = travelRegions.find((item) => item.id === activeRegionId) ?? travelRegions[0]
    globeRef.current?.pointOfView?.({ lat: region.lat, lng: region.lng, altitude: region.viewAltitude }, 1100)
  }, [activeRegionId])

  const returnToWorld = useCallback(() => {
    if (focusingId || activeDestination) return
    setMapMode('world')
    setActiveRegionId(null)
    setFocusingId('world')
    globeRef.current?.pointOfView?.(WORLD_VIEW, 1250)
    openTimer.current = window.setTimeout(() => {
      const controls = globeRef.current?.controls?.()
      if (controls) controls.autoRotate = true
      setFocusingId(null)
    }, 1050)
  }, [activeDestination, focusingId])

  const createMapLabel = useCallback((point: object) => {
    const mapPoint = point as MapPoint
    const marker = document.createElement('button')
    marker.style.setProperty('--marker-accent', mapPoint.accent)
    const label = document.createElement('span')
    label.className = 'marker-label'
    const index = document.createElement('i')
    const name = document.createElement('strong')
    const detail = document.createElement('small')

    if (isTravelRegion(mapPoint)) {
      marker.className = `map-marker map-region-marker map-region-${mapPoint.id}`
      marker.setAttribute('aria-label', `查看${mapPoint.name}旅行地图`)
      index.textContent = formatIndex(travelRegions.findIndex((region) => region.id === mapPoint.id) + 1)
      name.textContent = mapPoint.name
      detail.textContent = `${mapPoint.englishName} · ${formatIndex(mapPoint.destinationIds.length)} ARCHIVES`
      marker.addEventListener('click', (event) => {
        event.stopPropagation()
        focusRegion(mapPoint)
      })
    } else {
      marker.className = `map-marker map-marker-${mapPoint.id}`
      marker.setAttribute('aria-label', `打开${mapPoint.name}旅行档案`)
      const parentRegion = travelRegions.find((region) => region.id === mapPoint.regionId)
      const destinationIndex = (parentRegion?.destinationIds.indexOf(mapPoint.id) ?? -1) + 1
      const destinationCount = parentRegion?.destinationIds.length ?? 1
      const labelOffset = (destinationIndex - 1 - (destinationCount - 1) / 2) * 52
      marker.style.setProperty('--marker-label-offset', `${labelOffset}px`)
      marker.style.setProperty('--marker-label-offset-mobile', `${labelOffset * 0.7}px`)
      index.textContent = formatIndex(destinationIndex)
      name.textContent = mapPoint.name
      detail.textContent = mapPoint.secondaryName ? `${mapPoint.secondaryName} · ${mapPoint.englishName}` : mapPoint.englishName
      marker.addEventListener('click', (event) => {
        event.stopPropagation()
        focusDestination(mapPoint)
      })
    }

    label.append(index, name, detail)
    marker.appendChild(label)
    return marker
  }, [focusDestination, focusRegion])

  useEffect(() => () => {
    if (openTimer.current) window.clearTimeout(openTimer.current)
  }, [])

  const onReady = () => {
    const globe = globeRef.current
    const controls = globe?.controls?.()
    if (controls) {
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.24
      controls.enableDamping = true
      controls.dampingFactor = 0.08
      controls.minDistance = 102
      controls.maxDistance = 460
    }
    globe?.renderer?.().setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    globe?.pointOfView?.(WORLD_VIEW, 0)
    setReady(true)
  }

  const activeArchiveIndex = activeDestination ? destinations.findIndex((item) => item.id === activeDestination.id) : -1
  const focusingName = destinations.find((item) => item.id === focusingId)?.name
    ?? travelRegions.find((item) => item.id === focusingId)?.name
    ?? (focusingId === 'world' ? '世界地图' : '')

  return (
    <main className={`experience experience-${mapMode}`}>
      <div className="globe-stage" aria-hidden={Boolean(activeDestination)}>
        <Globe
          ref={globeRef}
          width={width}
          height={height}
          onGlobeReady={onReady}
          globeImageUrl="/assets/earth-blue-marble.jpg"
          bumpImageUrl="/assets/earth-topology.png"
          backgroundImageUrl="/assets/night-sky.png"
          backgroundColor="#060807"
          atmosphereColor="#a9c9b7"
          atmosphereAltitude={0.16}
          pointsData={[]}
          ringsData={[]}
          htmlElementsData={mapPoints}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={(point) => isTravelRegion(point as MapPoint) ? 0.018 : 0.008}
          htmlElement={createMapLabel}
          htmlTransitionDuration={0}
          animateIn
        />
        <div className="grain" />
      </div>

      <nav className="top-nav">
        <button className="brand" onClick={returnToWorld} aria-label="返回世界地图"><Compass size={21} /><span>ATLAS<br />OF MOMENTS</span></button>
        <div className="edition">
          <span>PERSONAL TRAVEL ARCHIVE</span>
          <span>{mapMode === 'world' ? `WORLD · ${formatIndex(travelRegions.length)}` : `${activeRegion?.englishName.toUpperCase()} · ${formatIndex(regionDestinations.length)}`}</span>
        </div>
      </nav>

      {mapMode === 'world' ? (
        <section className="intro intro-world">
          <p className="intro-kicker"><span /> PERSONAL TRAVEL ETHNOGRAPHY</p>
          <h1>把走过的地方，<br /><em>留在一颗星球上。</em></h1>
          <p className="intro-copy">旋转地球，寻找那些被时间保存下来的片刻。<br />世界地图会随着每一次旅行继续生长。</p>
          <div className="destination-list region-list" aria-label="已收录旅行地区">
            {travelRegions.map((region, index) => (
              <button
                key={region.id}
                className="destination-button region-button"
                onClick={() => focusRegion(region)}
                disabled={!ready || Boolean(focusingId)}
                style={{ '--destination-accent': region.accent } as React.CSSProperties}
              >
                <span className="destination-number">{formatIndex(index + 1)}</span>
                <span className="destination-name"><strong>{region.name}</strong><small>{region.englishName} · {formatIndex(region.destinationIds.length)} 份档案</small></span>
                <MapPin size={16} />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="intro intro-region">
          <button className="world-back" onClick={returnToWorld}><ArrowLeft size={15} /> 返回世界地图</button>
          <p className="intro-kicker"><span /> {activeRegion && formatCoordinate(activeRegion.lat, 'N', 'S')} · {activeRegion && formatCoordinate(activeRegion.lng, 'E', 'W')}</p>
          <h1>{activeRegion?.introTitle}<br /><em>{activeRegion?.introEmphasis}</em></h1>
          <p className="intro-copy">{activeRegion?.introCopy[0]}<br />{activeRegion?.introCopy[1]}</p>
          <div className="destination-list" aria-label={`${activeRegion?.name}旅行目的地`}>
            {regionDestinations.map((destination, index) => (
              <button
                key={destination.id}
                className="destination-button"
                onClick={() => focusDestination(destination)}
                disabled={!ready || Boolean(focusingId)}
                style={{ '--destination-accent': destination.accent } as React.CSSProperties}
              >
                <span className="destination-number">{formatIndex(index + 1)}</span>
                <span className="destination-name"><strong>{destination.name}</strong><small>{destination.region}</small></span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="side-index">
        <span>01</span><i /><span>{mapMode === 'world' ? formatIndex(travelRegions.length) : formatIndex(regionDestinations.length)}</span>
      </div>

      <footer className="map-footer">
        <span>{ready ? '拖动旋转 · 滚轮缩放 · 点击光点' : '正在载入地球…'}</span>
        <span>{mapMode === 'world' ? 'EARTH / PERSONAL ARCHIVE' : `EARTH / ${activeRegion?.continent.toUpperCase()} / ${activeRegion?.englishName.toUpperCase()}`}</span>
      </footer>

      {focusingId && <div className="travel-status">正在前往 {focusingName}…</div>}
      {!ready && <div className="loader"><span /><p>CALIBRATING THE GLOBE</p></div>}
      {activeDestination && (
        <TravelArchive
          key={activeDestination.id}
          destination={activeDestination}
          archiveIndex={activeArchiveIndex}
          onClose={closeArchive}
        />
      )}
    </main>
  )
}

export default App
