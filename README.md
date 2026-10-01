# FORGE — Cinematic Workout Wall

Minimal full-screen cinematic workout experience: no dashboard, tracker, media upload interface, or extra pages.

## Run
`npm install` then `npm run dev`. Build with `npm run build`.
Vercel: Framework Vite, Build Command `npm run build`, Output Directory `dist`, Root Directory `.`.

## Your media (codebase only)
Put up to 10 media files in each folder, named 01.jpg through 10.jpg:
`public/media/chest-1/`, `back-1/`, `legs-1/`, `rest-1/`, `chest-2/`, `back-2/`, `legs-2/`, `rest-2/`.
Images: JPG/JPEG/PNG/WebP. Videos: MP4/WebM; edit the MEDIA array in `src/ForgeApp.jsx` to point a slot at a video filename.
Images advance every 6.5 seconds; videos advance when playback ends.

## Music
Add one soundtrack per section at `public/audio/chest-1.mp3`, `back-1.mp3`, `legs-1.mp3`, `rest-1.mp3`, `chest-2.mp3`, `back-2.mp3`, `legs-2.mp3`, `rest-2.mp3`.
Tap the small play control to start; browsers generally block autoplay until user interaction. Switching workout sections loads its matching track and pauses playback.
