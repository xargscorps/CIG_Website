# CloudInfra Global Website

Production-ready source code for the CloudInfra Global company website.

The website presents CloudInfra Global's SAP transformation, RISE with SAP, SAP BTP, S/4HANA, analytics, cloud enablement, industry expertise, delivery lifecycle, global footprint and contact details.

## Technology

- Semantic HTML5
- Responsive CSS3
- Vanilla JavaScript
- Inline SVG diagrams and animations
- Vite production build
- No database or backend required

## Project structure

```text
CloudInfra-Global-Website-Source/
├── index.html                         Main website content and SEO metadata
├── package.json                       Project commands and dependency versions
├── package-lock.json                  Reproducible dependency lockfile
├── vite.config.js                     Development and production build settings
├── vercel.json                        Vercel deployment settings
├── netlify.toml                       Netlify deployment and security headers
├── src/
│   ├── styles/
│   │   └── main.css                   Layout, responsive design and animations
│   └── scripts/
│       └── main.js                    Navigation and micro-interactions
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── cloudinfra-global-logo.png
│   │   │   └── cloudinfra-global-social-preview.png
│   │   └── platforms/                 Platform logo assets
│   ├── _headers                       Cloudflare Pages security headers
│   ├── robots.txt                     Search-engine crawling rules
│   └── sitemap.xml                    Website sitemap
└── docs/
    ├── DEPLOYMENT-GUIDE.md
    ├── CONTENT-UPDATE-GUIDE.md
    └── ASSET-NOTICES.md
```

## Start locally

```bash
bun install
bun run dev
```

## Create the production version

```bash
bun run build
```

The deployable website will be created inside the `dist` folder.

See [docs/DEPLOYMENT-GUIDE.md](docs/DEPLOYMENT-GUIDE.md) for provider-specific instructions.
