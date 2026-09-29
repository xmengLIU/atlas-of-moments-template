/**
 * 这是模板中唯一需要频繁编辑的内容文件。
 *
 * 1. 把照片放进 public/photos/<地点 ID>/
 * 2. 在 travelRegions 中添加地区
 * 3. 在 destinations 中添加这个地区里的具体目的地
 *
 * 经纬度可以在地图应用中搜索地点后复制；北纬、东经为正数，南纬、西经为负数。
 */

export type TravelPhoto = {
  id: string
  title: string
  caption: string
  src: string
  width: number
  height: number
  position?: string
}

export type Destination = {
  id: string
  regionId: string
  name: string
  englishName: string
  secondaryName?: string
  language?: 'zh' | 'en'
  region: string
  country: string
  lat: number
  lng: number
  date: string
  mood: string
  eyebrow: string
  storyTitle: string
  story: string[]
  accent: string
  photos: TravelPhoto[]
}

export type TravelRegion = {
  id: string
  name: string
  englishName: string
  continent: string
  lat: number
  lng: number
  viewAltitude: number
  accent: string
  destinationIds: string[]
  introTitle: string
  introEmphasis: string
  introCopy: [string, string]
}

// 世界地图上的一级地区。一个地区可以包含多个具体目的地。
export const travelRegions: TravelRegion[] = [
  {
    id: 'hangzhou',
    name: '杭州',
    englishName: 'Hangzhou',
    continent: 'Asia',
    lat: 30.25,
    lng: 120.15,
    viewAltitude: 0.16,
    accent: '#8bae91',
    destinationIds: ['sample-lake', 'sample-garden', 'sample-bamboo'],
    introTitle: 'HANGZHOU,',
    introEmphasis: 'LAKE, GARDEN, BAMBOO.',
    introCopy: [
      'Three sample archives show how one city can hold several independent destinations.',
      '三份示例档案展示了如何在同一座城市中保存多个彼此独立的目的地。',
    ],
  },
]

// 具体目的地。复制任意一个对象，就可以继续添加新的旅行档案。
export const destinations: Destination[] = [
  {
    id: 'sample-lake',
    regionId: 'hangzhou',
    name: 'WEST LAKE',
    englishName: 'West Lake',
    secondaryName: '西湖',
    language: 'en',
    region: 'West Lake Scenic Area',
    country: 'Hangzhou · China',
    lat: 30.2431,
    lng: 120.1506,
    date: '2026.04',
    mood: 'LAKESIDE DUSK',
    eyebrow: 'Following the final light across water, pavilion roofs and distant hills',
    storyTitle: 'AT DUSK,\nTHE LAKE BECOMES A MIRROR.',
    story: [
      'Write the first part of your travel journal here. Short paragraphs work especially well with the editorial layout.',
      '在这里写下旅行手记的第一段。中英文可以交替出现，也可以只保留一种语言。',
      'Record a small observation: the weather, a sound, a street corner, or the moment that made this place memorable.',
      '不必只介绍景点，也可以记录天气、声音、街角，以及真正让你记住这个地方的瞬间。',
    ],
    accent: '#8bae91',
    photos: [
      {
        id: 'lake-01',
        title: 'DUSK OVER THE LAKE',
        caption: 'Replace this sentence with the story behind your photograph.',
        src: '/photos/sample-lake/01.jpg',
        width: 1400,
        height: 1005,
      },
      {
        id: 'lake-02',
        title: 'A VERTICAL MEMORY',
        caption: 'Portrait and landscape photographs are arranged automatically.',
        src: '/photos/sample-lake/02.jpg',
        width: 933,
        height: 1400,
      },
    ],
  },
  {
    id: 'sample-garden',
    regionId: 'hangzhou',
    name: 'TAIZIWAN PARK',
    englishName: 'Taiziwan Park',
    secondaryName: '太子湾公园',
    language: 'en',
    region: 'South of West Lake',
    country: 'Hangzhou · China',
    lat: 30.2293,
    lng: 120.142,
    date: '2026.04',
    mood: 'GARDEN WALK',
    eyebrow: 'A quiet walk through lawns, reflections and old trees',
    storyTitle: 'A GARDEN CAN HOLD\nMORE THAN ONE SEASON.',
    story: [
      'Use each destination as a small visual essay rather than a list of attractions.',
      '可以把每个目的地写成一篇小型视觉随笔，而不仅仅是一份景点清单。',
      'The archive opens above the globe and returns visitors to the map when it closes.',
      '档案会覆盖在地球上方，关闭之后访客会自然回到地图。',
    ],
    accent: '#d7ad68',
    photos: [
      {
        id: 'garden-01',
        title: 'THE OPEN LAWN',
        caption: 'Add a precise, personal caption for every frame.',
        src: '/photos/sample-garden/01.jpg',
        width: 1400,
        height: 933,
      },
      {
        id: 'garden-02',
        title: 'IRIS IN THE SHADE',
        caption: 'The lightbox includes previous and next controls automatically.',
        src: '/photos/sample-garden/02.jpg',
        width: 906,
        height: 1400,
      },
    ],
  },
  {
    id: 'sample-bamboo',
    regionId: 'hangzhou',
    name: 'YUNQI BAMBOO PATH',
    englishName: 'Yunqi Bamboo Path',
    secondaryName: '云栖竹径',
    language: 'en',
    region: 'West Lake Hills',
    country: 'Hangzhou · China',
    lat: 30.1838,
    lng: 120.0874,
    date: '2026.04',
    mood: 'FOREST SHADE',
    eyebrow: 'Entering the bamboo shade where stone, water and old trees soften the light',
    storyTitle: 'THE PATH DISAPPEARS\nINTO DEEP GREEN.',
    story: [
      'Long titles, bilingual notes and photographs with different proportions are all supported.',
      '模板支持长标题、双语手记，以及横竖比例各不相同的照片。',
      'Change the accent colour to give every destination its own subtle visual identity.',
      '你还可以修改强调色，让每一个目的地拥有独立而克制的视觉气质。',
    ],
    accent: '#6d9d7b',
    photos: [
      {
        id: 'bamboo-01',
        title: 'THE STONE GATE',
        caption: 'The first photograph becomes the full-screen archive cover.',
        src: '/photos/sample-bamboo/01.jpg',
        width: 1400,
        height: 933,
      },
      {
        id: 'bamboo-02',
        title: 'WATER UNDER THE TREES',
        caption: 'Choose a focal point with the optional position field when needed.',
        src: '/photos/sample-bamboo/02.jpg',
        width: 1400,
        height: 935,
        position: 'center 55%',
      },
    ],
  },
]
