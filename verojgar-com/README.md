# Verojgar.com

A YouTube/Seekho-style practical learning platform for India:
- Learners choose a field and city.
- Teachers can create channels and upload videos.
- Video library supports skill + city filtering.
- Live learning section is ready for scheduled/live-session integration.
- React + Vite frontend.
- Supabase Auth + Postgres + Storage backend.

## 1. Install

```bash
npm install
npm run dev
```

## 2. Connect Supabase

Create a Supabase project.

Copy `.env.example` to `.env.local` and fill:

VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...

Run `supabase.sql` in Supabase SQL Editor.

In Storage create:
- videos
- thumbnails
- avatars

For the first prototype you can make videos public. Before paid/private content, use private buckets + signed URLs and stronger upload controls.

## 3. Production checklist

Before public launch:
- Add Terms of Service, Privacy Policy, Community Guidelines.
- Add report/block/moderation workflow.
- Add copyright takedown process.
- Add age/child-safety rules if minors can use the service.
- Add upload limits and video transcoding.
- Add thumbnail generation.
- Add creator channel pages.
- Add comments, likes, follows and notifications.
- Add proper live streaming provider/WebRTC architecture.
- Add analytics and error monitoring.
- Add backups and abuse/rate-limit protection.

## 4. Google launch

A website does not need to be "uploaded to Google". Publish it on a hosting provider using your domain, then verify the domain in Google Search Console and submit your sitemap.

For Verojgar.com:
1. Build: `npm run build`
2. Deploy the `dist` folder to Vercel/Netlify/Cloudflare Pages or another host.
3. Point `verojgar.com` DNS to the host.
4. Set HTTPS.
5. Add `https://verojgar.com/` to Google Search Console.
6. Submit `https://verojgar.com/sitemap.xml`.
7. Add a robots.txt and sitemap.
8. Create unique title/description metadata for important pages.
9. Ask Google to index the homepage and important pages.
10. Monitor Search Console for indexing/mobile/Core Web Vitals issues.

Google indexing is different from publishing an Android app to Google Play.
