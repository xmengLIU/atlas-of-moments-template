# Content configuration guide

Routine updates only require changes to `src/data/destinations.ts` and `public/photos/`.

## Region fields

```ts
{
  id: 'japan',
  name: 'Japan',
  englishName: 'Japan',
  continent: 'Asia',
  lat: 36.2,
  lng: 138.2,
  viewAltitude: 0.5,
  accent: '#d9a29a',
  destinationIds: ['kyoto', 'nara'],
  introTitle: 'JAPAN,',
  introEmphasis: 'TWO CITIES, TWO TEMPOS.',
  introCopy: ['An English introduction.', 'A second introduction line.'],
}
```

### Important region fields

- `id`: a unique lowercase identifier used by the application
- `lat` and `lng`: the camera target and world-map marker position
- `viewAltitude`: the camera distance after opening the region; values between `0.14` and `0.65` work well for most areas
- `accent`: the marker and interface accent colour
- `destinationIds`: the destination order shown in the region interface
- `introTitle` and `introEmphasis`: the two parts of the large region heading
- `introCopy`: two supporting lines, which may use one or two languages

Every value in `destinationIds` must match an object inside `destinations`.

## Destination fields

```ts
{
  id: 'kyoto',
  regionId: 'japan',
  name: 'KYOTO',
  englishName: 'Kyoto',
  secondaryName: 'Kyoto, Japan',
  language: 'en',
  region: 'Higashiyama · Gion',
  country: 'Kyoto · Japan',
  lat: 35.0116,
  lng: 135.7681,
  date: '2026.04',
  mood: 'SPRING WALK',
  eyebrow: 'A short sentence above the archive title',
  storyTitle: 'A TITLE CAN USE\nA LINE BREAK.',
  story: [
    'The first travel-journal paragraph.',
    'The second travel-journal paragraph.',
  ],
  accent: '#d9a29a',
  photos: [],
}
```

### Important destination fields

- `regionId`: must match the parent region's `id`
- `name`: the large archive title
- `secondaryName`: an optional second-language or local name
- `language`: controls minor language-specific presentation details
- `lat` and `lng`: the destination marker and camera target
- `date`: free-form display text, for example `2026.04` or `April 2026`
- `mood`: a short uppercase archive category
- `eyebrow`: the sentence displayed above the title on the cover
- `storyTitle`: use `\n` when a deliberate line break is needed
- `story`: any number of journal paragraphs, in one language or several
- `accent`: a CSS colour used for the destination marker

## Photograph fields

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

- `id`: a unique identifier for the photograph
- `title`: the short title displayed in the gallery and lightbox
- `caption`: the description displayed beneath the title
- `src`: an absolute path beginning with `/photos/`
- `width` and `height`: the photograph's real pixel dimensions
- `position`: optional CSS `background-position` used to adjust cropping

The first item in the `photos` array becomes the destination's cover photograph.

## Coordinates

Use decimal latitude and longitude:

- North latitude and east longitude are positive
- South latitude and west longitude are negative
- London: `lat: 51.5074`, `lng: -0.1278`
- Sydney: `lat: -33.8688`, `lng: 151.2093`

## Gallery layout

The gallery reads every photograph's aspect ratio and automatically groups the images into feature rows, landscape pairs, portrait pairs, portrait trios, or mixed rows.

For the best result:

- Enter accurate dimensions
- Mix landscape and portrait photographs when possible
- Place a strong landscape image first if it should become the cover
- Keep captions concise enough to remain readable over an image

## Troubleshooting

### A map marker does not appear

Check that the coordinates are numbers. Confirm that the destination `id`, its `regionId`, and the parent region's `destinationIds` entry match exactly.

### A photograph does not load

Confirm that the file exists inside `public/`, and that its `src` begins with `/photos/`. Paths and filenames are case-sensitive after deployment.

### The gallery proportions look incorrect

Verify the real `width` and `height` values. The layout depends on them even before the full photograph has loaded.

### The cover crops the subject

Add or adjust the optional position value:

```ts
position: 'center 30%'
```

### Destination labels overlap

Labels are automatically staggered according to their order in `destinationIds`. Reordering that list is usually enough to improve the result for nearby markers.

