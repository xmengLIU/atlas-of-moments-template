# Atlas of Moments

一套可以直接复用的个人旅行民族志地图模板。访客从一颗缓慢旋转的 3D 地球进入地区，再打开每个目的地的全屏旅行档案。

## 模板包含

- 可拖动、缩放和自动旋转的 3D 地球
- 世界地区与地区内目的地两级导航
- 封面大图、地点、坐标、日期与旅行手记
- 自动适配横图、竖图和不同尺寸的照片画廊
- 单张照片说明、全屏查看、上一张和下一张
- 桌面端与移动端响应式布局
- 中英文内容支持

## 一分钟开始

```bash
npm install
npm run dev
```

打开终端显示的本地地址，就可以看到示例旅行地图。

## 换成你的旅行内容

### 1. 放入照片

在 `public/photos/` 下为每个目的地创建一个文件夹：

```text
public/photos/
└── my-destination/
    ├── 01.jpg
    ├── 02.jpg
    └── 03.jpg
```

### 2. 编辑地点资料

打开 `src/data/destinations.ts`。模板的地区、目的地、坐标、日期、手记和每张照片的说明都集中在这一个文件里。

- `travelRegions`：世界地图上的一级地区，例如日本、英国或杭州
- `destinations`：地区里的具体目的地，例如京都、剑桥或西湖
- `lat` / `lng`：经纬度；北纬和东经使用正数，南纬和西经使用负数
- `viewAltitude`：进入地区后的镜头高度，通常使用 `0.14`–`0.65`
- `photos`：照片路径、尺寸、标题和说明

复制现有示例对象并修改内容，是添加新地点最快的方式。务必让 `destination.regionId` 与对应地区的 `id` 一致，并把目的地 `id` 加入该地区的 `destinationIds`。

### 3. 检查并生成正式版本

```bash
npm run build
npm run preview
```

## 照片建议

- JPG 或 WebP 均可，建议长边控制在 1600–2400 像素
- 第一张照片会成为档案封面
- 请填写真实的 `width` 与 `height`，画廊会据此组合横图和竖图
- 需要调整裁切位置时，可以给照片增加 `position: 'center 35%'`
- 文件名建议使用小写英文、数字和连字符，避免空格

更完整的字段示例见 [CUSTOMIZE.md](./CUSTOMIZE.md)。

## 技术栈

React、TypeScript、Vite、react-globe.gl 与 Three.js。

## 部署

这是一个纯静态网站。执行 `npm run build` 后，可将生成的 `dist/` 部署到 GitHub Pages、Vercel、Netlify、Cloudflare Pages 或任意静态托管服务。

## 授权

网站代码使用 [MIT License](./LICENSE)。`public/photos/` 中的示例旅行照片仅用于演示模板，不包含在 MIT 授权中；制作自己的站点时请替换为你拥有使用权的照片。

