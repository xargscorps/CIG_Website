# Deployment Guide

## Before deployment

1. Install bun runtime .
2. Open a terminal in the `CloudInfra-Global-Website-Source` folder.
3. Run `bun install`.
4. Run `bun run build`.
5. Confirm that the `dist` folder is created.

No database, API keys, environment variables or backend server are required.

## Vercel

1. Create a new Vercel project.
2. Import the folder or its Git repository.
3. Use `bun run build` as the build command.
4. Use `dist` as the output directory.
5. Deploy.

The included `vercel.json` already supplies these settings.

## Netlify

1. Create a new Netlify site.
2. Import the folder or its Git repository.
3. Deploy using the included `netlify.toml` file.

Netlify will run `bun run build` and publish the `dist` folder automatically.

## Cloudflare Pages

1. Create a Cloudflare Pages project.
2. Import the Git repository.
3. Set the build command to `bun run build`.
4. Set the build output directory to `dist`.
5. Deploy.

The included `public/_headers` file adds basic security headers.

## cPanel or traditional web hosting

1. Run `bun install` and `bun run build` on your computer.
2. Open the generated `dist` folder.
3. Upload everything inside `dist` to `public_html` on the hosting account.
4. Keep `index.html` at the root of `public_html`.

## Custom domain

The package currently uses `https://cloudinfraglobal.com/` for canonical, sitemap, structured-data and social-preview URLs. If another domain will be used, replace that address in:

- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`

Then run `bun run build` again before uploading.

## Contact actions

- Email links open `info@cloudinfraglobal.com`.
- Phone links open `+91 98225 98989`.
- Service enquiry buttons create emails with the relevant subject already entered.
