# Ivan Torrente Portfolio

Personal portfolio built with Next.js, TypeScript, Tailwind, Motion and Sanity. See [CONTEXT.md](CONTEXT.md) for the project's terms.

## Run locally

```sh
npm install
npm run dev
```

Without a Sanity project, the site previews using the resume content in `content-seed/`.

## Connect Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) with a public `production` dataset.
2. Create an API token with Editor access.
3. Copy `.env.example` to `.env.local` and fill in the values.
4. Under the project's API settings, add these as CORS origins with credentials allowed: `http://localhost:3000` and your Vercel URL.
5. Run `npm run seed` to load the resume into Sanity. Running it again never overwrites edits made in Studio.
6. Edit content at `/studio`.

## Deploy to Vercel

1. Import the repository and add every value from `.env.local` as an environment variable.
2. In Sanity, add a webhook that sends `POST` requests to `https://<your-site>/api/revalidate` when documents are created, updated or deleted. Set its secret to the value of `SANITY_WEBHOOK_SECRET`.

### Launch check

Production builds fail until a published Experience entry started at least 10 years ago, because the site claims "10+ years". Add your Earlier Experience in Studio, then deploy again. Preview deployments aren't affected. Run the check yourself with `npm run check:launch`.

## Change the photo

The photo also serves as the site's logo. `public/photos/navy-suit.jpg` is the default, and the front card of the hero's photo stack. The other three cards are the files listed in `HERO_PHOTOS` in `src/lib/site.ts`. To replace it, sign in at `/login` with `ADMIN_PASSWORD`, then use the **Upload photo** button on the home page. JPEG, PNG and WebP are accepted, up to 4 MB. To crop an uploaded photo, or remove it and return to the default, use `/studio`.

## Contact form

The form on `/contact` opens the visitor's email app with the message filled in, so it needs no server or email service.

## Move to a custom domain

Add the domain in Vercel, update `NEXT_PUBLIC_SITE_URL`, add the domain to Sanity's CORS origins and redeploy.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```
