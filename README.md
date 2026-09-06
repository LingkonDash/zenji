# ZENJI — Anime Streetwear Australia

A premium anime-inspired e-commerce storefront built with Next.js, React, and modern motion-driven UX. This project recreates the ZENJI brand experience with cinematic visuals, shop browsing, product detail pages, wishlist flow, cart interactions, and a complete checkout journey.

<p align="center">
  <a href="https://zenji-lingkon.vercel.app/" target="_blank" rel="noreferrer">Live Demo</a>
  ·
  <a href="https://github.com/LingkonDash/zenji" target="_blank" rel="noreferrer">GitHub Repository</a>
  ·
  <a href="https://zenji.shop/" target="_blank" rel="noreferrer">Original Store</a>
  ·
  <a href="./DOCUMENTATION.md">Project Documentation</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.4-000000?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white" alt="Vercel" />
</p>

## Overview

ZENJI is a fashion storefront created for fans of anime culture, warrior aesthetics, and limited-edition streetwear. The experience combines bold storytelling, immersive animation, and ecommerce interactions in a single modern storefront.

The application includes:

- cinematic landing sections and motion-rich hero blocks
- filterable collection pages with product discovery
- detailed product pages and gallery layouts
- wishlist and cart persistence using browser storage
- checkout and order confirmation UX
- brand pages for story, reviews, FAQ, drops, and lookbook

## Live Links

- Live demo: https://zenji-lingkon.vercel.app/
- GitHub repository: https://github.com/LingkonDash/zenji
- Original brand site: https://zenji.shop/
- Project docs: [DOCUMENTATION.md](./DOCUMENTATION.md)

## Key Features

- Premium anime-inspired storefront design with strong visual branding
- Smooth scrolling and GSAP-powered motion effects
- Responsive product catalog with filtering and search behavior
- Wishlist and cart states stored locally for a lightweight shopping flow
- Dynamic product detail pages and collection presentation
- Special drop countdown and limited-release experience
- Checkout flow with modal-based confirmation states
- Custom brand pages for storytelling, FAQ, and editorial content

## Tech Stack

### Frontend
- Next.js 16
- React 19
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- Lucide React icons

### Architecture
- App Router with file-based routing
- Server-side product loading from local JSON data
- Custom browser storage cart/wishlist logic
- Responsive component-driven UI

## Project Structure

```bash
zenji/
├── public/
│   ├── data/
│   │   └── products.json
│   ├── images/
│   └── videos/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── images/
├── DOCUMENTATION.md
├── package.json
├── next.config.mjs
├── jsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── README.md
└── public/
```

## Main Pages

- Home
- Collection
- Product detail routes
- Drop and countdown experience
- Lookbook
- Our Story
- FAQ
- Wishlist
- Checkout
- Login
- Review
- Collaboration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

### Production build

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Linting

```bash
npm run lint
```

## Environment Variables

This project uses a `BASEURL` environment variable in the product data fetch layer. If needed, configure it before running in a non-local deployment environment.

Example:

```bash
BASEURL=https://your-domain.com
```

## Documentation

The project documentation is available in [DOCUMENTATION.md](./DOCUMENTATION.md). It includes additional technical notes, structure details, and implementation context for the storefront.

## Deployment

This project is configured for deployment on Vercel and includes the live demo at:

- https://zenji-lingkon.vercel.app/

## Notes

This repository is a front-end brand experience and storefront build inspired by the original ZENJI website, with a strong emphasis on visual storytelling, polished product presentation, and UX quality.

## License

This project is for demonstration and portfolio use. Please check the original brand and licensing requirements before using assets or brand materials in commercial contexts.

---

Built for the ZENJI brand experience with a modern Next.js storefront architecture.