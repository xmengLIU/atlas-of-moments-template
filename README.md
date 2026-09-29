# Atlas of Moments

**Atlas of Moments** is an open-source 3D travel map template for turning personal journeys into interactive photo archives.

Instead of presenting travel photographs as a conventional album, the project places them back on a globe. Visitors can rotate the Earth, select a region, open an individual destination, and explore its photographs, coordinates, travel date, field notes, and image captions.

The original website was created from photographs taken during trips between 2025 and 2026. This repository is a lightweight reusable version with sample content, designed for anyone who wants to build a personal travel map without creating the interface from scratch.

## Live project

[View the original Atlas of Moments website](https://atlas-of-moments.lmx2420175935.chatgpt.site)

The live project contains the full personal archive. This repository contains a smaller sample dataset that is easier to download, understand, and replace.

## What the website can do

- Display destinations on a draggable, zoomable, auto-rotating 3D globe
- Organize content in two levels: travel regions and individual destinations
- Move the camera smoothly from the world view to a selected local area
- Open each destination as a full-screen editorial archive
- Show a cover photograph, location, coordinates, travel date, theme, and field notes
- Arrange landscape and portrait photographs automatically according to their dimensions
- Open photographs in a full-screen lightbox
- Navigate with previous, next, and close controls
- Support Chinese, English, or bilingual travel writing
- Adapt the interface for desktop and mobile screens

## “Static” does not mean non-interactive

Atlas of Moments is a **client-side interactive website**. It does not require a backend server, database, account system, or content-management service.

The 3D globe, camera movement, archive transitions, gallery layout, and lightbox controls are all powered by React and JavaScript in the visitor's browser. The word *static* only describes how the site is hosted: the hosting provider serves the compiled HTML, CSS, JavaScript, textures, and photographs directly.

This makes the project easy to deploy on services such as GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any other static hosting provider.

## Technology

- React
- TypeScript
- Vite
- react-globe.gl
- Three.js
- Lucide React

## Getting started

### 1. Create your copy

Click **Use this template** on GitHub, or clone the repository:

```bash
git clone https://github.com/xmengLIU/atlas-of-moments-template.git
cd atlas-of-moments-template
```

### 2. Install the dependencies

```bash
npm install
```

### 3. Start the local website

```bash
npm run dev
```

Open the local address shown in the terminal. Vite will update the page automatically while you edit the content.

## Add your own destinations

All frequently edited travel content is stored in one file:

```text
src/data/destinations.ts
```

The file contains two collections:

- `travelRegions`: the large areas shown on the world map, such as Japan, the United Kingdom, or Hangzhou
- `destinations`: the individual archives inside those regions, such as Kyoto, Cambridge, or West Lake

The included Hangzhou sample demonstrates how one region can contain several independent destinations.

### Add a region

Copy an existing object inside `travelRegions` and change its ID, title, coordinates, accent colour, camera altitude, introduction, and destination IDs.

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

### Add a destination

Copy an existing object inside `destinations`. The destination's `regionId` must match the parent region's `id`, and its own `id` must also appear in the parent's `destinationIds` list.

Every destination can define:

- Display names in one or two languages
- Region and country labels
- Latitude and longitude
- Travel date
- Theme and accent colour
- Archive headline and introductory sentence
- One or more travel-journal paragraphs
- Any number of captioned photographs

See [CUSTOMIZE.md](./CUSTOMIZE.md) for complete field examples and troubleshooting notes.

## Add your photographs

Create one folder for each destination inside `public/photos/`:

```text
public/photos/
└── kyoto/
    ├── 01.jpg
    ├── 02.jpg
    └── 03.jpg
```

Then register the files in the destination's `photos` array:

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

The first photograph becomes the archive cover. The optional `position` value changes its crop when the main subject is not centred.

### Recommended image preparation

- Use JPG or WebP for photographs
- Resize the longest edge to approximately 1600–2400 pixels
- Keep file sizes reasonable for faster loading
- Enter the photograph's real `width` and `height`
- Use lowercase filenames with numbers and hyphens
- Avoid spaces and non-ASCII characters in file paths

Accurate dimensions are important because the gallery uses each image's aspect ratio to create balanced rows of landscape and portrait photographs.

## Project structure

```text
atlas-of-moments-template/
├── public/
│   ├── assets/                 # Earth and background textures
│   └── photos/                 # Replace with your travel photographs
├── src/
│   ├── data/
│   │   └── destinations.ts     # Regions, destinations, writing, and captions
│   ├── App.tsx                 # Globe, archive, gallery, and lightbox interactions
│   ├── index.css               # Visual design and responsive layouts
│   └── main.tsx
├── CUSTOMIZE.md                # Detailed content guide
├── index.html
└── package.json
```

## Build the production version

```bash
npm run build
```

The finished site will be generated in `dist/`.

To inspect that version locally:

```bash
npm run preview
```

## Deployment

Because the project does not require a backend, deployment only needs the generated `dist/` directory.

Common options include:

- **GitHub Pages:** deploy the Vite build output with a GitHub Actions workflow
- **Vercel:** import the repository, select Vite, and keep the default build settings
- **Netlify:** use `npm run build` as the build command and `dist` as the publish directory
- **Cloudflare Pages:** use `npm run build` and publish `dist`

## Sample photographs and privacy

The repository includes six reduced-size sample photographs so the archive and mixed gallery layout work immediately after installation. They are included for demonstration and are not covered by the software licence.

When publishing your own version, review every photograph, caption, date, and coordinate before deployment. Anything committed to a public repository or deployed on a public website should be treated as publicly accessible.

## Licence

The source code is available under the [MIT License](./LICENSE).

The sample photographs in `public/photos/` remain the copyright of their original photographer and should be replaced in derivative travel-map projects.
