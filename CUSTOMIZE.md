# 内容配置指南

日常更新只需要修改 `src/data/destinations.ts` 和 `public/photos/`。

## 地区字段

```ts
{
  id: 'japan',
  name: '日本',
  englishName: 'Japan',
  continent: 'Asia',
  lat: 36.2,
  lng: 138.2,
  viewAltitude: 0.5,
  accent: '#d9a29a',
  destinationIds: ['kyoto', 'nara'],
  introTitle: 'JAPAN,',
  introEmphasis: 'TWO CITIES, TWO TEMPOS.',
  introCopy: ['English introduction.', '中文介绍。'],
}
```

`destinationIds` 决定地区页面中的档案顺序。列表中的每个 ID 都必须对应一个 `destinations` 对象。

## 目的地字段

```ts
{
  id: 'kyoto',
  regionId: 'japan',
  name: 'KYOTO',
  englishName: 'Kyoto',
  secondaryName: '京都',
  language: 'en',
  region: 'Higashiyama · Gion',
  country: 'Kyoto · Japan',
  lat: 35.0116,
  lng: 135.7681,
  date: '2026.04',
  mood: 'SPRING WALK',
  eyebrow: 'A short sentence above the archive title',
  storyTitle: 'A TITLE CAN USE\nA LINE BREAK.',
  story: ['English paragraph.', '中文段落。'],
  accent: '#d9a29a',
  photos: [],
}
```

`story` 可以只有中文、只有英文，也可以像示例一样交替排列。

## 照片字段

```ts
{
  id: 'kyoto-01',
  title: 'MORNING IN GION',
  caption: 'The first light reaches the stone street.',
  src: '/photos/kyoto/01.jpg',
  width: 2000,
  height: 1333,
  position: 'center 45%',
}
```

`position` 是可选字段，对应 CSS 的 `background-position`。当人物或建筑在默认居中裁切下被遮挡时再添加它。

## 常见问题

### 地图光点没有出现

确认经纬度是数字，并检查 `regionId`、`destinationIds` 和目的地 `id` 是否完全一致。

### 图片无法显示

确认文件位于 `public/` 下，且 `src` 从 `/photos/` 开始。路径和文件名区分大小写。

### 画廊比例不理想

填写图片真实的 `width` 与 `height`。布局会根据宽高比自动把照片分成横图、竖图与重点大图。

